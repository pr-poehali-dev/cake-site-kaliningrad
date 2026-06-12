import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Сохранение заявки и получение списка заявок"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        cur.execute(
            "INSERT INTO orders (name, phone, date, type, comment, promo) VALUES (%s, %s, %s, %s, %s, %s)",
            (body.get('name', ''), body.get('phone', ''), body.get('date', ''),
             body.get('type', ''), body.get('comment', ''), body.get('promo', ''))
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    cur.close()
    conn.close()
    return {'statusCode': 405, 'headers': headers, 'body': ''}
