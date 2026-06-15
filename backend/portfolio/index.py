import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'], options=f'-c search_path="{SCHEMA}"')

def handler(event: dict, context) -> dict:
    """Портфолио: получение и добавление фото (base64 в БД)"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')

    # GET — список фото (url = data uri)
    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, url, title FROM portfolio_photos ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [{'id': r[0], 'url': r[1], 'title': r[2]} for r in rows]
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

    # POST — сохранение фото как data URI прямо в БД
    if method == 'POST':
        admin_token = (event.get('headers') or {}).get('X-Admin-Token', '')
        if admin_token != os.environ.get('ADMIN_PASSWORD', ''):
            return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}

        body = json.loads(event.get('body') or '{}')
        file_data = body.get('file', '')  # base64 data URI: "data:image/jpeg;base64,..."
        title = body.get('title', 'Работа')

        if not file_data:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Нет файла'})}

        # Сохраняем data URI прямо как url — браузер умеет его показывать
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO portfolio_photos (url, title) VALUES (%s, %s) RETURNING id",
            (file_data, title)
        )
        photo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': headers,
                'body': json.dumps({'ok': True, 'id': photo_id})}

    return {'statusCode': 405, 'headers': headers, 'body': ''}
