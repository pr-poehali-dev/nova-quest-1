"""Получение, сохранение, обновление и удаление рецептов пользователей."""
import json
import os
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, title, category, time, calories, protein, fat, carbs,
                   image, description, servings, ingredients, steps, created_at
            FROM recipes ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        recipes = []
        for row in rows:
            recipes.append({
                'id': f'user_{row[0]}',
                'title': row[1],
                'category': row[2],
                'time': row[3],
                'calories': row[4],
                'protein': row[5],
                'fat': row[6],
                'carbs': row[7],
                'image': row[8],
                'description': row[9],
                'servings': row[10],
                'ingredients': list(row[11]) if row[11] else [],
                'steps': list(row[12]) if row[12] else [],
            })

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'recipes': recipes}, ensure_ascii=False),
        }

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        required = ['title', 'category', 'time', 'calories', 'protein', 'fat', 'carbs', 'description', 'servings', 'ingredients', 'steps']
        for field in required:
            if not body.get(field) and body.get(field) != 0:
                return {
                    'statusCode': 400,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({'error': f'Поле {field} обязательно'}, ensure_ascii=False),
                }

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO recipes (title, category, time, calories, protein, fat, carbs, image, description, servings, ingredients, steps)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            body['title'],
            body['category'],
            body['time'],
            int(body['calories']),
            int(body['protein']),
            int(body['fat']),
            int(body['carbs']),
            body.get('image', ''),
            body['description'],
            int(body['servings']),
            body['ingredients'],
            body['steps'],
        ))
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 201,
            'headers': CORS_HEADERS,
            'body': json.dumps({'id': f'user_{new_id}', 'success': True}, ensure_ascii=False),
        }

    if method == 'PUT':
        path = event.get('path', '/')
        recipe_id = path.strip('/').split('/')[-1]
        if not recipe_id.isdigit():
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный id'})}

        body = json.loads(event.get('body') or '{}')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            UPDATE recipes SET
                title=%s, category=%s, time=%s, calories=%s, protein=%s,
                fat=%s, carbs=%s, image=%s, description=%s, servings=%s,
                ingredients=%s, steps=%s
            WHERE id=%s
        """, (
            body['title'], body['category'], body['time'],
            int(body['calories']), int(body['protein']), int(body['fat']), int(body['carbs']),
            body.get('image', ''), body['description'], int(body['servings']),
            body['ingredients'], body['steps'], int(recipe_id),
        ))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True})}

    if method == 'DELETE':
        path = event.get('path', '/')
        recipe_id = path.strip('/').split('/')[-1]
        if not recipe_id.isdigit():
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный id'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM recipes WHERE id=%s", (int(recipe_id),))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True})}

    return {'statusCode': 405, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Method not allowed'})}