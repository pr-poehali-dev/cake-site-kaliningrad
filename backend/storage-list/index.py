import json
import os
import boto3

def handler(event: dict, context) -> dict:
    """Список файлов из S3 хранилища"""
    headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    key_id = os.environ['AWS_ACCESS_KEY_ID']
    s3 = boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=key_id,
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

    files = []
    try:
        # Перебираем все страницы (больше 1000 файлов)
        paginator = s3.get_paginator('list_objects_v2')
        for page in paginator.paginate(Bucket='files', Prefix='portfolio/'):
            for obj in page.get('Contents', []):
                key = obj['Key']
                # CDN путь: /files/{key} — bucket name не входит в URL
                url = f"https://cdn.poehali.dev/projects/{key_id}/files/{key}"
                files.append({'key': key, 'url': url})
    except Exception as e:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)})}

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps(files, ensure_ascii=False)}