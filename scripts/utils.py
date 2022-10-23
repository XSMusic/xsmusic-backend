import re
import requests
import json

headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
}


def slugify(s):
    s = s.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '-', s)
    s = re.sub(r'^-+|-+$', '', s)
    return s


def get_styles_db():
    url = 'http://localhost:6969/styles/getAll'
    data = {
        "page": int(1),
        "pageSize": int(200),
    }
    data = json.dumps(data, indent=2)
    response = requests.post(url, headers=headers, data=data)
    if response.status_code == requests.codes.ok:
        styles = []
        for style in response.json()['items']:
            if (style):
                styles.append({'_id': style['_id'], 'name': style['name']})
        return styles
    else:
        print("Something went wrong")


def save_artists_db(artists):
    url = 'http://localhost:6969/artists/create'
    for artist in artists:
        data = {
            "name": artist.name,
            "country": artist.country,
            "birthdate": artist.birthdate,
            "image": artist.image,
            "styles": artist.styles,
            "info": artist.info,
            "slug": artist.slug
        }
        response = requests.post(url, data)
        print(response.text)


def save_styles_db(styles):
    url = 'http://localhost:6969/styles/create'
    for style in styles:
        data = {
            "name": style.capitalize()
        }
        response = requests.post(url, data)
        print(response.text)
