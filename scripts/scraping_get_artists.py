import requests
import json
from bs4 import BeautifulSoup
import os
import re
import uuid


url = "https://djrankings.org/"
headers = {
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
}
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, features="lxml")
container = soup.find(name="tbody")
tr = container.find_all('tr')
artists = []


def slugify(s):
  s = s.lower().strip()
  s = re.sub(r'[^\w\s-]', '', s)
  s = re.sub(r'[\s_-]+', '-', s)
  s = re.sub(r'^-+|-+$', '', s)
  return s

def get_name_styles():
    name_ok = ''
    style_ok = ''
    country_ok = ''
    for item in tr:
        if (name_ok != '' and style_ok != '' and country_ok != ''):
            artists.append({
                '_id': uuid.uuid4().hex,
                'name': name_ok,
                'country': country_ok,
                'birthdate': '',
                'styles': style_ok,
                'gender': 'male',
                'image': '',
                'info': '',
                'slug': slugify(name_ok)
            })
            name_ok = ''
            style_ok = ''
            country_ok = ''
        name = item.find('a', class_="ajax_link cap")
        style = item.find('td', class_="last")
        if (name):
            name_ok = name.text.title()
        if (style):
            style.text.split(', ')
            style_ok = style.text.split(', ')

        country_imgs = item.select('img[src*="flags"]')
        if len(country_imgs) > 0:
            country_img = country_imgs[0]
            country_a = str(country_img).split('src="/tpls/img/flags/16/')[1]
            country_b = country_a.split(
                '.png" style="float:left;margin-right:5px;"/>')
            country_ok = country_b[0]


get_name_styles()

f = open(os.path.dirname(os.path.abspath(__file__)) + '/artists.json', "w")
artistsDumps = json.dumps(artists, indent=2)
f.write(artistsDumps)
f.close()