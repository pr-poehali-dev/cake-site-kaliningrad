import json
import os
import base64
import uuid
import boto3
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'], options=f'-c search_path="{SCHEMA}"')

def handler(event: dict, context) -> dict:
    """Портфолио: получение и добавление фото"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')

    # GET — список фото для сайта
    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, url, title FROM portfolio_photos ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [{'id': r[0], 'url': r[1], 'title': r[2]} for r in rows]
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

    # POST — загрузка фото (только админ)
    if method == 'POST':
        admin_token = (event.get('headers') or {}).get('X-Admin-Token', '')
        if admin_token != os.environ.get('ADMIN_PASSWORD', ''):
            return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}

        body = json.loads(event.get('body') or '{}')
        file_data = body.get('file', '')
        title = body.get('title', 'Работа')

        if not file_data:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Нет файла'})}

        if ',' in file_data:
            file_data = file_data.split(',', 1)[1]

        binary = base64.b64decode(file_data)
        ext = body.get('name', 'photo.jpg').rsplit('.', 1)[-1].lower()
        key = f"portfolio/{uuid.uuid4()}.{ext}"

        content_type_map = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}
        content_type = content_type_map.get(ext, 'image/jpeg')

        # Загружаем в S3
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        )

        url = None
        key_id = os.environ['AWS_ACCESS_KEY_ID']
        for bucket in ['files', 'portfolio']:
            try:
                s3.put_object(Bucket=bucket, Key=key, Body=binary, ContentType=content_type)
                url = f"https://cdn.poehali.dev/projects/{key_id}/files/{key}"
                print(f"Uploaded to bucket={bucket} key={key}")
                break
            except Exception as e:
                print(f"Failed bucket={bucket}: {e}")

        if not url:
            return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'Не удалось загрузить файл'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("INSERT INTO portfolio_photos (url, title) VALUES (%s, %s) RETURNING id", (url, title))
        photo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'id': photo_id, 'url': url})}

    return {'statusCode': 405, 'headers': headers, 'body': ''}
