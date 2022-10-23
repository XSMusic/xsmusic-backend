
# TODO: Falta poder decirle que me devuelva como json (print) o que lo guarde en un archivo como ahora
import requests
import json
from bs4 import BeautifulSoup
from utils import save_artists_db

months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
wiki_codes = ['[1]', '[2]', '[3]', '[4]',
             '[5]', '[6]', '[7]', '[8]', '[9]', '[10]']
url = 'https://es.wikipedia.org/wiki/'
headers = {
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
}

def set_wikipedia_atributes(artists):
    try:
        for idx, artist in enumerate(artists):
            name = artist.name
            response = requests.get(url + name, headers=headers)
            soup = BeautifulSoup(response.text, features="lxml")
            artist.image = get_image(soup)
            artist.info = get_desc(soup)
            artist.birthdate = get_birthdate(soup)
        save_artists_db(artists)
    except ValueError:
        print('Error set_attr_artists')

def get_image(soup):
    try:
        image_a = soup.find(class_="image")
        if (image_a):
            image_element = image_a.find("img")
            image = image_element['src']
            image_split = image.split("//")
            image_ok = 'https://' + image_split[1]
            return image_ok
    except ValueError:
        print('Error get_image')

def get_birthdate(soup):
    try:
        birthdate = soup.find(string="Nacimiento")
        if (birthdate):
            birthdate_replaced = ''
            for idx, p in enumerate(birthdate.parent.parent.find('td').children):
                if (idx == 0):
                    birthdate_replaced = p.replace("\n", "")
            if (birthdate_replaced.find('(') >= 0):
                birthdate_replaced = birthdate_replaced.split("(")[0]
            birthdate_replaced = birthdate_replaced.replace("de ", "")
            birthdate_array = birthdate_replaced.split(' ')
            if (birthdate_array[0]):
                day = int(birthdate_array[0])
                month_es = birthdate_array[1]
                month = get_month(month_es)
                year = int(birthdate_array[2])
                date = str(year) + "-" + str(month) + "-" + str(day)
                return date
            else:
                return ''
        else:
            return ''
    except ValueError:
        print('Error get_birthdate')


def get_desc(soup):
    try: 
        desc_div = soup.find(class_="mw-parser-output")
        if desc_div:
            desc_p = desc_div.find_all("p")
            if len(desc_p) >= 2 and desc_p[0].text and desc_p[1].text:
                info = desc_p[0].text + '<br>' + desc_p[1].text
                info = info.replace('\n', '<br>')
                for i in wiki_codes:
                    info = info.replace(i, "")
                return info
            else:
                return ''
        else:
            return ''
    except ValueError:
        print('Error get_desc')


def get_month(month_es):
    for idx, m in enumerate(months):
        if (m == month_es):
            return int(idx + 1)
