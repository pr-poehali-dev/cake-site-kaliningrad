import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Получение и добавление отзывов. Только клиенты с заказом могут оставить отзыв."""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if event.get('httpMethod') == 'GET':
        cur.execute("SELECT name, text, stars, created_at FROM reviews ORDER BY created_at DESC")
        rows = cur.fetchall()
        result = [{'name': r[0], 'text': r[1], 'stars': r[2]} for r in rows]
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        phone = body.get('phone', '').strip()
        name = body.get('name', '').strip()
        text = body.get('text', '').strip()
        stars = int(body.get('stars', 5))

        if not phone or not name or not text:
            cur.close()
            conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все поля'})}

        # Проверяем, есть ли заказ с таким номером телефона
        clean_phone = ''.join(filter(str.isdigit, phone))
        cur.execute("SELECT id FROM orders WHERE regexp_replace(phone, '[^0-9]', '', 'g') = %s LIMIT 1", (clean_phone,))
        order = cur.fetchone()

        if not order:
            cur.close()
            conn.close()
            return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Отзыв могут оставить только клиенты, оформившие заказ'}, ensure_ascii=False)}

        # Проверяем, не оставлял ли уже отзыв
        cur.execute("SELECT id FROM reviews WHERE regexp_replace(phone, '[^0-9]', '', 'g') = %s LIMIT 1", (clean_phone,))
        existing = cur.fetchone()
        if existing:
            cur.close()
            conn.close()
            return {'statusCode': 409, 'headers': headers, 'body': json.dumps({'error': 'Вы уже оставляли отзыв'}, ensure_ascii=False)}

        cur.execute(
            "INSERT INTO reviews (name, phone, text, stars) VALUES (%s, %s, %s, %s)",
            (name, phone, text, stars)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    cur.close()
    conn.close()
    return {'statusCode': 405, 'headers': headers, 'body': ''}
