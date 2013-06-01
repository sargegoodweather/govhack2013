import urllib
import json

def doQuery(x):
    return json.loads(urllib.urlopen('http://govhack.atdw.com.au/productsearchservice.svc/products?key=278965474541&out=json&' + x).read().decode('utf16'))
