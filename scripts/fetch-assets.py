"""Refresh local imagery and subset open fonts to WOFF2.

Run: uv run --no-project --with fonttools --with brotli python scripts/fetch-assets.py
"""
import concurrent.futures
import io
import pathlib
import urllib.request
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parents[1] / 'public'

def get(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'Hooky asset builder'})
    return urllib.request.urlopen(request, timeout=45).read()

def font(name, source):
    base = 'https://raw.githubusercontent.com/google/fonts/main/ofl/'
    family = source.split('/')[0]
    face = TTFont(io.BytesIO(get(base + source)))
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    selector = subset.Subsetter(options=options)
    selector.populate(unicodes=list(range(0x0000, 0x0250)) + list(range(0x2000, 0x2070)) + list(range(0x2190, 0x2200)))
    selector.subset(face)
    face.flavor = 'woff2'
    destination = ROOT / 'fonts' / (name + '.woff2')
    destination.parent.mkdir(exist_ok=True)
    face.save(destination)
    (ROOT / 'fonts' / (name + '-LICENSE.txt')).write_bytes(get(base + family + '/OFL.txt'))
    print('Font:', name, destination.stat().st_size)

def photo(name, source):
    destination = ROOT / 'images' / (name + '.jpg')
    destination.parent.mkdir(exist_ok=True)
    destination.write_bytes(get('https://images.unsplash.com/' + source + '?auto=format&fit=crop&w=1000&q=85'))
    print('Photo:', name, destination.stat().st_size)

if __name__ == '__main__':
    jobs = [(font, ('space-grotesk', 'spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf')),
            (font, ('inter', 'inter/Inter%5Bopsz,wght%5D.ttf')),
            (font, ('ibm-plex-mono', 'ibmplexmono/IBMPlexMono-Regular.ttf')),
            (photo, ('portrait', 'photo-1472099645785-5658abf4ff4e')),
            (photo, ('landscape', 'photo-1500534623283-312aade485b7')),
            (photo, ('mountains', 'photo-1519681393784-d120267933ba'))]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(function, *args) for function, args in jobs]
        for future in futures:
            future.result()
