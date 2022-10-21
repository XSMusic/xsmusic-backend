from utils import slugify

class Artist:
    def __init__(self, name="", country="es", styles="", birthdate="", gender="male", image="", info=""):
        self.name = name
        self.country = country
        self.birthdate = birthdate
        self.styles = styles
        self.gender = gender
        self.image = image
        self.info = info
        self.slug = slugify(name)
    
    def print_all(self):
        print('1', self.name)
        print('2', self.country)
        print('3', self.birthdate)
        print('4', self.gender)
        print('5', str(self.styles))
        print('6', self.gender)
        print('7', self.image)
        print('8', self.info)