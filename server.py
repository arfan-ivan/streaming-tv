from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import re
from typing import Dict, List

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Country codes mapping
COUNTRY_CODES = {
    'af': 'Afghanistan',
    'al': 'Albania',
    'dz': 'Algeria',
    'as': 'American Samoa',
    'ad': 'Andorra',
    'ao': 'Angola',
    'ai': 'Anguilla',
    'aq': 'Antarctica',
    'ag': 'Antigua and Barbuda',
    'ar': 'Argentina',
    'am': 'Armenia',
    'aw': 'Aruba',
    'au': 'Australia',
    'at': 'Austria',
    'az': 'Azerbaijan',
    'bs': 'Bahamas',
    'bh': 'Bahrain',
    'bd': 'Bangladesh',
    'bb': 'Barbados',
    'by': 'Belarus',
    'be': 'Belgium',
    'bz': 'Belize',
    'bj': 'Benin',
    'bm': 'Bermuda',
    'bt': 'Bhutan',
    'bo': 'Bolivia (Plurinational State of)',
    'bq': 'Bonaire, Sint Eustatius and Saba',
    'ba': 'Bosnia and Herzegovina',
    'bw': 'Botswana',
    'bv': 'Bouvet Island',
    'br': 'Brazil',
    'io': 'British Indian Ocean Territory',
    'bn': 'Brunei Darussalam',
    'bg': 'Bulgaria',
    'bf': 'Burkina Faso',
    'bi': 'Burundi',
    'cv': 'Cabo Verde',
    'kh': 'Cambodia',
    'cm': 'Cameroon',
    'ca': 'Canada',
    'ky': 'Cayman Islands',
    'cf': 'Central African Republic',
    'td': 'Chad',
    'cl': 'Chile',
    'cn': 'China',
    'cx': 'Christmas Island',
    'cc': 'Cocos (Keeling) Islands',
    'co': 'Colombia',
    'km': 'Comoros',
    'cd': 'Congo, Democratic Republic of the',
    'cg': 'Congo',
    'ck': 'Cook Islands',
    'cr': 'Costa Rica',
    'ci': 'Côte dIvoire',
    'hr': 'Croatia',
    'cu': 'Cuba',
    'cw': 'Curaçao',
    'cy': 'Cyprus',
    'cz': 'Czechia',
    'dk': 'Denmark',
    'dj': 'Djibouti',
    'dm': 'Dominica',
    'do': 'Dominican Republic',
    'ec': 'Ecuador',
    'eg': 'Egypt',
    'sv': 'El Salvador',
    'gq': 'Equatorial Guinea',
    'er': 'Eritrea',
    'ee': 'Estonia',
    'sz': 'Eswatini',
    'et': 'Ethiopia',
    'fk': 'Falkland Islands (Malvinas)',
    'fo': 'Faroe Islands',
    'fj': 'Fiji',
    'fi': 'Finland',
    'fr': 'France',
    'gf': 'French Guiana',
    'pf': 'French Polynesia',
    'tf': 'French Southern Territories',
    'ga': 'Gabon',
    'gm': 'Gambia',
    'ge': 'Georgia',
    'de': 'Germany',
    'gh': 'Ghana',
    'gi': 'Gibraltar',
    'gr': 'Greece',
    'gl': 'Greenland',
    'gd': 'Grenada',
    'gp': 'Guadeloupe',
    'gu': 'Guam',
    'gt': 'Guatemala',
    'gg': 'Guernsey',
    'gn': 'Guinea',
    'gw': 'Guinea-Bissau',
    'gy': 'Guyana',
    'ht': 'Haiti',
    'hm': 'Heard Island and McDonald Islands',
    'va': 'Holy See',
    'hn': 'Honduras',
    'hk': 'Hong Kong',
    'hu': 'Hungary',
    'is': 'Iceland',
    'in': 'India',
    'id': 'Indonesia',
    'ir': 'Iran (Islamic Republic of)',
    'iq': 'Iraq',
    'ie': 'Ireland',
    'im': 'Isle of Man',
    'il': 'Israel',
    'it': 'Italy',
    'jm': 'Jamaica',
    'jp': 'Japan',
    'je': 'Jersey',
    'jo': 'Jordan',
    'kz': 'Kazakhstan',
    'ke': 'Kenya',
    'ki': 'Kiribati',
    'kp': 'Korea (Democratic People\'s Republic of)',
    'kr': 'Korea, Republic of',
    'kw': 'Kuwait',
    'kg': 'Kyrgyzstan',
    'la': 'Lao People\'s Democratic Republic',
    'lv': 'Latvia',
    'lb': 'Lebanon',
    'ls': 'Lesotho',
    'lr': 'Liberia',
    'ly': 'Libya',
    'li': 'Liechtenstein',
    'lt': 'Lithuania',
    'lu': 'Luxembourg',
    'mo': 'Macao',
    'mg': 'Madagascar',
    'mw': 'Malawi',
    'my': 'Malaysia',
    'mv': 'Maldives',
    'ml': 'Mali',
    'mt': 'Malta',
    'mh': 'Marshall Islands',
    'mq': 'Martinique',
    'mr': 'Mauritania',
    'mu': 'Mauritius',
    'yt': 'Mayotte',
    'mx': 'Mexico',
    'fm': 'Micronesia (Federated States of)',
    'md': 'Moldova, Republic of',
    'mc': 'Monaco',
    'mn': 'Mongolia',
    'me': 'Montenegro',
    'ms': 'Montserrat',
    'ma': 'Morocco',
    'mz': 'Mozambique',
    'mm': 'Myanmar',
    'na': 'Namibia',
    'nr': 'Nauru',
    'np': 'Nepal',
    'nl': 'Netherlands',
    'nc': 'New Caledonia',
    'nz': 'New Zealand',
    'ni': 'Nicaragua',
    'ne': 'Niger',
    'ng': 'Nigeria',
    'nu': 'Niue',
    'nf': 'Norfolk Island',
    'mp': 'Northern Mariana Islands',
    'no': 'Norway',
    'om': 'Oman',
    'pk': 'Pakistan',
    'pw': 'Palau',
    'ps': 'Palestine, State of',
    'pa': 'Panama',
    'pg': 'Papua New Guinea',
    'py': 'Paraguay',
    'pe': 'Peru',
    'ph': 'Philippines',
    'pn': 'Pitcairn',
    'pl': 'Poland',
    'pt': 'Portugal',
    'pr': 'Puerto Rico',
    'qa': 'Qatar',
    're': 'Réunion',
    'ro': 'Romania',
    'ru': 'Russian Federation',
    'rw': 'Rwanda',
    'bl': 'Saint Barthélemy',
    'sh': 'Saint Helena, Ascension and Tristan da Cunha',
    'kn': 'Saint Kitts and Nevis',
    'lc': 'Saint Lucia',
    'mf': 'Saint Martin (French part)',
    'pm': 'Saint Pierre and Miquelon',
    'vc': 'Saint Vincent and the Grenadines',
    'ws': 'Samoa',
    'sm': 'San Marino',
    'st': 'Sao Tome and Principe',
    'sa': 'Saudi Arabia',
    'sn': 'Senegal',
    'rs': 'Serbia',
    'sc': 'Seychelles',
    'sl': 'Sierra Leone',
    'sg': 'Singapore',
    'sx': 'Sint Maarten (Dutch part)',
    'sk': 'Slovakia',
    'si': 'Slovenia',
    'sb': 'Solomon Islands',
    'so': 'Somalia',
    'za': 'South Africa',
    'gs': 'South Georgia and the South Sandwich Islands',
    'ss': 'South Sudan',
    'es': 'Spain',
    'lk': 'Sri Lanka',
    'sd': 'Sudan',
    'sr': 'Suriname',
    'sj': 'Svalbard and Jan Mayen',
    'se': 'Sweden',
    'ch': 'Switzerland',
    'sy': 'Syrian Arab Republic',
    'tw': 'Taiwan, Province of China',
    'tj': 'Tajikistan',
    'tz': 'Tanzania, United Republic of',
    'th': 'Thailand',
    'tl': 'Timor-Leste',
    'tg': 'Togo',
    'tk': 'Tokelau',
    'to': 'Tonga',
    'tt': 'Trinidad and Tobago',
    'tn': 'Tunisia',
    'tr': 'Türkiye',
    'tm': 'Turkmenistan',
    'tc': 'Turks and Caicos Islands',
    'tv': 'Tuvalu',
    'ug': 'Uganda',
    'ua': 'Ukraine',
    'uk': 'United Kingdom of Great Britain and Northern Ireland',
    'ae': 'United Arab Emirates',
    'gb': 'United Kingdom of Great Britain and Northern Ireland',
    'us': 'United States of America',
    'um': 'United States Minor Outlying Islands',
    'uy': 'Uruguay',
    'uz': 'Uzbekistan',
    'vu': 'Vanuatu',
    've': 'Venezuela (Bolivarian Republic of)',
    'vn': 'Viet Nam',
    'vg': 'Virgin Islands, British',
    'vi': 'Virgin Islands, U.S.',
    'wf': 'Wallis and Futuna',
    'eh': 'Western Sahara',
    'ye': 'Yemen',
    'zm': 'Zambia',
    'zw': 'Zimbabwe'
}

def get_country_name_from_filename(filename: str) -> str:
    code = filename.split("_")[0].lower()
    return COUNTRY_CODES.get(code, code.upper())

def parse_m3u(content: str, source_file: str) -> List[Dict]:
    channels = []
    lines = content.strip().splitlines()
    for i in range(len(lines)):
        if lines[i].startswith("#EXTINF"):
            info = lines[i]
            url = lines[i + 1] if i + 1 < len(lines) else ""
            match = re.match(r'#EXTINF:-1.*?tvg-id="(.*?)".*?group-title="(.*?)",(.*)', info)
            tvg_id, group, name = (match.groups() if match else ("", "", info.split(",")[-1].strip()))
            channel_id = (tvg_id or name).replace(" ", "_").replace("/", "_").lower()
            channels.append({
                "id": channel_id,
                "name": name,
                "group": group,
                "source": source_file,
                "country": get_country_name_from_filename(source_file),
                "url": url.strip()
            })
    return channels

def load_channels(directory: str = "./streams") -> Dict[str, List[Dict]]:
    grouped_channels = {}
    if not os.path.exists(directory):
        print(f"Directory {directory} not found")
        return {}

    for file in os.listdir(directory):
        if file.endswith(".m3u"):
            path = os.path.join(directory, file)
            with open(path, encoding="utf-8") as f:
                content = f.read()
            channels = parse_m3u(content, file)
            parts = os.path.splitext(file)[0].split("_", 1)
            country_code = parts[0].lower()
            country_name = COUNTRY_CODES.get(country_code, country_code.upper())
            source_name = parts[1] if len(parts) > 1 else "Unknown"
            group_key = f"{country_name} / {source_name.replace('_', ' ').title()}"
            grouped_channels.setdefault(group_key, []).extend(channels)

    return grouped_channels

CHANNELS_BY_GROUP = load_channels()

def encode_group_key(group_key: str) -> str:
    return group_key.replace(" / ", "__").replace(" ", "_").lower()

def decode_group_key(encoded_key: str) -> str:
    parts = encoded_key.split("__")
    if len(parts) != 2:
        return encoded_key
    country = parts[0].replace("_", " ").title()
    source = parts[1].replace("_", " ").title()
    return f"{country} / {source}"

@app.get("/channels")
def get_channels():
    return {
        group: [{"id": c["id"], "name": c["name"]} for c in channels]
        for group, channels in CHANNELS_BY_GROUP.items()
    }

@app.post("/reload")
def reload_channels():
    global CHANNELS_BY_GROUP
    CHANNELS_BY_GROUP = load_channels()
    return {"status": "Reloaded"}

@app.get("/hls/{group_key}/{channel_index}/stream.m3u8")
async def proxy_stream(group_key: str, channel_index: int):
    group_name = decode_group_key(group_key)
    if group_name not in CHANNELS_BY_GROUP:
        raise HTTPException(status_code=404, detail="Group not found")
    channels = CHANNELS_BY_GROUP[group_name]
    if not 0 <= channel_index < len(channels):
        raise HTTPException(status_code=404, detail="Channel index out of range")

    url = channels[channel_index]["url"]
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=10.0)
            resp.raise_for_status()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Stream not available")

    base_path = f"/hls/{group_key}/{channel_index}"
    rewritten = [
        line if not line or line.startswith("#") else f"{base_path}/{line.split('/')[-1]}"
        for line in resp.text.splitlines()
    ]
    return Response("\n".join(rewritten), media_type="application/vnd.apple.mpegurl")

@app.get("/hls/{group_key}/{channel_index}/{segment_path:path}")
async def proxy_segment(group_key: str, channel_index: int, segment_path: str):
    group_name = decode_group_key(group_key)
    if group_name not in CHANNELS_BY_GROUP:
        raise HTTPException(status_code=404, detail="Group not found")
    channels = CHANNELS_BY_GROUP[group_name]
    if not 0 <= channel_index < len(channels):
        raise HTTPException(status_code=404, detail="Channel index out of range")

    segment_url = f"{channels[channel_index]['url'].rsplit('/', 1)[0]}/{segment_path}"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(segment_url, timeout=10.0)
            resp.raise_for_status()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Segment not available")

    content_type = resp.headers.get("content-type", "video/mp2t")
    return Response(content=resp.content, media_type=content_type)
