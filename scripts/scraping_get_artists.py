import requests
from bs4 import BeautifulSoup
from artist import Artist
from utils import save_styles_db, get_styles_db
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
        styles_db = get_styles_db()
        artists = []
        styles_list = []
        name = ''
        styles = ''
        country = ''
        for item in data:
            if (name != '' and styles != '' and country != ''):
                artist = Artist(name, country, styles)
                artists.append(artist)
                name = ''
                styles = ''
                country = ''
            dataset = set_name_country_styles(item)
            
            if dataset[0] != "":
                name = dataset[0]
            if dataset[1] != "":
                country = dataset[1]
            if dataset[2] != "":
                styles = dataset[2]
                if len(styles) > 0 and styles[0] != '' and styles[0] != 'Genre':
                    styles_array = []
                    for style_i in styles:
                        styles_array.append(filter_styles(style_i, styles_db)['_id'])
                    styles = styles_array
        set_wikipedia_atributes(artists)

    except ValueError:
        print("❌ Error al obtener Artistas")

def filter_styles(style, styles):
    for x in styles:
        if x['name'] == style:
            return x


def set_name_country_styles(item):
    try:
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
    except ValueError:
        print("❌ Error al setear NCS")


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
