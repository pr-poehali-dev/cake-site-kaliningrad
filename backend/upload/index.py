import json
import os
import base64
import uuid
import boto3

def handler(event: dict, context) -> dict:
    """Загрузка фото заказа в S3 и возврат публичной ссылки"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    file_data = body.get('file')
    file_name = body.get('name', 'photo.jpg')

    if not file_data:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Нет файла'})}

    if ',' in file_data:
        file_data = file_data.split(',', 1)[1]

    binary = base64.b64decode(file_data)
    ext = file_name.rsplit('.', 1)[-1].lower() if '.' in file_name else 'jpg'
    # Если имя содержит путь (например portfolio/photo.jpg) — используем его с uuid
    if '/' in file_name:
        folder = file_name.rsplit('/', 1)[0]
        key = f"{folder}/{uuid.uuid4()}.{ext}"
    else:
        key = f"order-photos/{uuid.uuid4()}.{ext}"

    content_type_map = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}
    content_type = content_type_map.get(ext, 'image/jpeg')

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=binary, ContentType=content_type, ACL='public-read')

    url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key}"
    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'url': url})}