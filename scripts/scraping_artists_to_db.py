from scraping_get_artists import get_name_styles
import requests
import json

url = 'http://localhost:6969/artists/create'
artists = get_name_styles()


try:
    for artist in artists:
        data = {
            "name": artist["name"],
            "country": artist["country"],
            "styles": artist["styles"],
            "slug": artist["slug"]
        }
        dataJSON = json.dumps(data, indent=2)
        response = requests.post(url, data)
        print(response.text)
except ValueError:
    print("❌ Error al añadir Artistas")