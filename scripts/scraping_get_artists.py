import requests
from bs4 import BeautifulSoup
from artist import Artist
from utils import save_db
from scraping_set_artists import set_wikipedia_atributes

url = "https://djrankings.org/"
headers = {
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
}

def init():
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, features="lxml")
    container = soup.find(name="tbody")
    data = container.find_all('tr')
    generate_items(data)

def generate_items(data):
    try:
        artists = []
        name_ok = ''
        styles_ok = ''
        country_ok = ''
        for item in data:
            if (name_ok != '' and styles_ok != '' and country_ok != ''):
                artist = Artist(name_ok, country_ok, styles_ok)
                artists.append(artist)
                name_ok = ''
                styles_ok = ''
                country_ok = ''
            dataset = set_name_country_styles(item)
            if dataset[0] != "":
                name_ok = dataset[0]
            if dataset[1] != "":
                country_ok = dataset[1]
            if dataset[2] != "":
                styles_ok = dataset[2]

        set_wikipedia_atributes(artists)
        
    except ValueError:
        print("❌ Error al obtener Artistas")


def set_name_country_styles(item):
    name_ok = ''
    styles_ok = ''
    country_ok = ''
    name = item.find('a', class_="ajax_link cap")
    style = item.find('td', class_="last")
    if (name):
        name_ok = name.text.title()
    if (style):
        style.text.split(', ')
        styles_ok = style.text.split(', ')

    country_imgs = item.select('img[src*="flags"]')
    if len(country_imgs) > 0:
        country_img = country_imgs[0]
        country_a = str(country_img).split('src="/tpls/img/flags/16/')[1]
        country_b = country_a.split(
            '.png" style="float:left;margin-right:5px;"/>')
        country_ok = country_b[0]

    return [name_ok, country_ok, styles_ok]


def slugify(s):
    s = s.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '-', s)
    s = re.sub(r'^-+|-+$', '', s)
    return s

try:
    init()

except ValueError:
    print("❌ Error al añadir Artistas")
