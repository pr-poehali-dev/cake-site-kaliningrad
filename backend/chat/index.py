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
    """Чат между покупателем и администратором по заявке"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    order_id = params.get('orderId')

    # GET — получить сообщения по заявке
    if method == 'GET':
        if not order_id:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'orderId required'})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, sender, text, created_at FROM messages WHERE order_id=%s ORDER BY created_at ASC",
            (order_id,)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [{'id': r[0], 'sender': r[1], 'text': r[2], 'createdAt': str(r[3])} for r in rows]
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

    # POST — отправить сообщение
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        oid = body.get('orderId')
        text = (body.get('text') or '').strip()
        sender = body.get('sender', 'client')

        if not oid or not text:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'orderId и text обязательны'})}

        if sender == 'admin':
            admin_token = (event.get('headers') or {}).get('X-Admin-Token', '')
            if admin_token != os.environ.get('ADMIN_PASSWORD', ''):
                return {'statusCode': 403, 'headers': headers, 'body': json.dumps({'error': 'Forbidden'})}

        conn = get_conn()
        cur = conn.cursor()

        # Получаем имя клиента для уведомления
        cur.execute("SELECT name FROM orders WHERE id=%s", (oid,))
        order_row = cur.fetchone()
        client_name = order_row[0] if order_row else 'Покупатель'

        cur.execute(
            "INSERT INTO messages (order_id, sender, text) VALUES (%s, %s, %s) RETURNING id, created_at",
            (oid, sender, text)
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        # Уведомление в Telegram только для сообщений от покупателя
        if sender == 'client':
            try:
                send_telegram(
                    f'💬 <b>Новое сообщение от {client_name}</b> (заявка #{oid})\n\n{text}\n\n'
                    f'👉 Ответить: /admin на сайте'
                )
            except Exception:
                pass

        return {'statusCode': 200, 'headers': headers,
                'body': json.dumps({'ok': True, 'id': row[0], 'createdAt': str(row[1])}, ensure_ascii=False)}

    return {'statusCode': 405, 'headers': headers, 'body': ''}
