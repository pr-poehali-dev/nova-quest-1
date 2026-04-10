"""Загрузка изображения рецепта в S3 и возврат публичного URL."""
import json
import os
import base64
import uuid
import boto3

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    image_b64 = body.get('image')
    content_type = body.get('contentType', 'image/jpeg')

    if not image_b64:
        return {
            'statusCode': 400,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Поле image обязательно'}),
        }

    ext = content_type.split('/')[-1].replace('jpeg', 'jpg')
    key = f'recipes/{uuid.uuid4()}.{ext}'

    image_data = base64.b64decode(image_b64)

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=image_data, ContentType=content_type)

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key}"

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps({'url': cdn_url}),
    }
