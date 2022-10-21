import re
import requests


def slugify(s):
    s = s.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '-', s)
    s = re.sub(r'^-+|-+$', '', s)
    return s


def save_db(artists):
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
