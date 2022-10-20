from utils import slugify

class Artist:
  def __init__(self, name="", country="es", birthdate="", styles="", gender="male", image="", info=""):
    self.name = name
    self.country = country
    self.birthdate = birthdate
    self.styles = styles
    self.gender = gender
    self.image = image
    self.info = info
    self.slug = slugify(name)
    
    
print(Artist('perro').name)