# Google Sheet events template

Use one Google Sheet tab for the CLINIQ agenda. Row 1 must contain the exact headers below.

```csv
date,artist_name,display_name,event_type,opening_time,closing_time,minimum_age,published,featured,show_detail_page,image_url,album_url,ticket_url,description_nl,description_en
2026-06-11,JINK,,regular,,,,true,false,false,,,,,
2026-06-12,Paul Gouda,,regular,,,,true,false,false,,,,,
2026-06-20,Big Rob,DJ BIG ROB,regular,,,,true,false,false,,,,,
```

## Required column headers

```text
date
artist_name
display_name
event_type
opening_time
closing_time
minimum_age
published
featured
show_detail_page
image_url
album_url
ticket_url
description_nl
description_en
```

Do not remove or rename these headers. Extra columns are allowed and ignored by the website.

## Date formats

Supported date formats:

- `YYYY-MM-DD`
- `DD-MM-YYYY`
- `DD/MM/YYYY`

The website normalizes all valid dates to `YYYY-MM-DD`. Invalid date rows are skipped and logged server-side.

## Defaults

If `opening_time`, `closing_time`, or `minimum_age` are empty, these defaults are used:

| Day | opening_time | closing_time | minimum_age |
| --- | --- | --- | --- |
| Thursday | 22:00 | 02:00 | 18+ |
| Friday | 22:00 | 03:00 | 21+ |
| Saturday | 22:00 | 03:00 | 21+ |

Other days stay empty unless filled in the sheet.

## Artist mapping

If `display_name` is filled, the website uses it exactly.

If `display_name` is empty, these mappings are applied to `artist_name`:

| artist_name | Website display |
| --- | --- |
| Sidney | DJ SDNX |
| Len | DJ Hadless |
| Big Rob | DJ BIG ROB |
| BIG ROB | DJ BIG ROB |
| big rob | DJ BIG ROB |

If `artist_name` is empty too, the display name becomes `CLINIQ`.

## Event type values

Accepted `event_type` values:

- `regular`
- `featured`
- `special`
- `private`

If empty, `event_type` defaults to `regular`.

## Publishing fields

- `published`: empty defaults to `true`.
- `featured`: empty defaults to `false`.
- `show_detail_page`: empty defaults to `true` only for `featured` or `special` events; regular events default to `false`.

Regular events do not show descriptions, detail CTAs, “Bekijk event”, or generated generic text on event cards.

Featured and special events show descriptions if provided and show CTAs when `show_detail_page` is true or `ticket_url` exists.
