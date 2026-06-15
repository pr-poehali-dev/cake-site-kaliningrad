import json
import os
import psycopg2
import base64
from PIL import Image
import io

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'], options=f'-c search_path="{SCHEMA}"')

def compress_image(data_uri: str, max_size=800) -> str:
    if ',' in data_uri:
        header, b64 = data_uri.split(',', 1)
    else:
        header, b64 = 'data:image/jpeg;base64', data_uri
    binary = base64.b64decode(b64)
    img = Image.open(io.BytesIO(binary)).convert('RGB')
    img.thumbnail((max_size, max_size), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=75, optimize=True)
    compressed = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/jpeg;base64,{compressed}"

def handler(event: dict, context) -> dict:
    """Портфолио: получение и добавление фото (сжатые base64 в БД)"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, url, title FROM portfolio_photos WHERE url NOT IN ('deleted', 'hidden') AND char_length(url) < 400000 ORDER BY created_at DESC LIMIT 20")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [{'id': r[0], 'url': r[1], 'title': r[2]} for r in rows]
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

    if method == 'POST':
        admin_token = (event.get('headers') or {}).get('X-Admin-Token', '')
        if admin_token != os.environ.get('ADMIN_PASSWORD', ''):
            return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}

        body = json.loads(event.get('body') or '{}')
        file_data = body.get('file', '')
        title = body.get('title', 'Работа')

        if not file_data:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Нет файла'})}

        compressed = compress_image(file_data)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO portfolio_photos (url, title) VALUES (%s, %s) RETURNING id",
            (compressed, title)
        )
        photo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': headers,
                'body': json.dumps({'ok': True, 'id': photo_id, 'url': compressed})}

    if method == 'DELETE':
        admin_token = (event.get('headers') or {}).get('X-Admin-Token', '')
        if admin_token != os.environ.get('ADMIN_PASSWORD', ''):
            return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}
        body = json.loads(event.get('body') or '{}')
        photo_id = body.get('id')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("UPDATE portfolio_photos SET url='deleted' WHERE id=%s", (photo_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': headers, 'body': ''}