import json
import os
import psycopg2
import urllib.request

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'], options=f'-c search_path="{SCHEMA}"')

def send_telegram(text: str):
    token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')
    if not token or not chat_id:
        return
    data = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode()
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{token}/sendMessage',
        data=data, headers={'Content-Type': 'application/json'}
    )
    urllib.request.urlopen(req, timeout=5)

def handler(event: dict, context) -> dict:
    """Сохранение и получение заявок"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')

    # POST — новая заявка от покупателя
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO orders (name, phone, date, type, comment, promo, print, photo_url, estimated_price, kg, qty)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
            (body.get('name',''), body.get('phone',''), body.get('date',''),
             body.get('type',''), body.get('comment',''), body.get('promo',''),
             body.get('print',''), body.get('photoUrl',''), body.get('estimatedPrice',''),
             body.get('kg',''), body.get('qty',''))
        )
        order_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        # Уведомление в Telegram
        lines = [f'🎂 <b>Новая заявка #{order_id}</b>']
        if body.get('name'): lines.append(f'👤 {body["name"]}')
        if body.get('phone'): lines.append(f'📞 {body["phone"]}')
        if body.get('type'): lines.append(f'🛒 {body["type"]}')
        if body.get('estimatedPrice'): lines.append(f'💰 {body["estimatedPrice"]}')
        if body.get('date'): lines.append(f'📅 {body["date"]}')
        if body.get('print'): lines.append(f'🖼 {body["print"]}')
        if body.get('comment'): lines.append(f'💬 {body["comment"]}')
        if body.get('promo'): lines.append(f'🎟 Промокод: {body["promo"]}')
        try:
            send_telegram('\n'.join(lines))
        except Exception:
            pass

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'orderId': order_id})}

    # PUT — обновить статус заявки (только для админа)
    if method == 'PUT':
        admin_token = event.get('headers', {}).get('X-Admin-Token', '')
        if admin_token != os.environ.get('ADMIN_PASSWORD', ''):
            return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}
        body = json.loads(event.get('body') or '{}')
        order_id = body.get('id')
        status = body.get('status')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("UPDATE orders SET status=%s WHERE id=%s", (status, order_id))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    # GET — список заявок (только для админа)
    if method == 'GET':
        admin_token = event.get('headers', {}).get('X-Admin-Token', '')
        if admin_token != os.environ.get('ADMIN_PASSWORD', ''):
            return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""SELECT id, name, phone, date, type, comment, promo, print, photo_url,
                              estimated_price, kg, qty, status, created_at
                       FROM orders ORDER BY created_at DESC""")
        rows = cur.fetchall()
        cols = ['id','name','phone','date','type','comment','promo','print','photoUrl',
                'estimatedPrice','kg','qty','status','createdAt']
        result = [dict(zip(cols, [str(v) if v is not None else '' for v in r])) for r in rows]
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

    return {'statusCode': 405, 'headers': headers, 'body': ''}
