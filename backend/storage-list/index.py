import json
import os
import boto3

def handler(event: dict, context) -> dict:
    """Список файлов из S3 хранилища"""
    headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    s3 = boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )
    result = s3.list_objects_v2(Bucket='files')
    key_id = os.environ['AWS_ACCESS_KEY_ID']
    files = []
    for obj in result.get('Contents', []):
        key = obj['Key']
        url = f"https://cdn.poehali.dev/projects/{key_id}/files/{key}"
        files.append({'key': key, 'url': url, 'size': obj['Size']})

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps(files, ensure_ascii=False)}