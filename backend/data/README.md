# Base dataset pack

This folder contains two kinds of data:

- `fir_dummy_1200.*`: the original broad demo dataset already used by the seed script.
- `base/fir_*.csv` and `base/fir_*.json`: smaller starter datasets for specific demo scenarios.

## Starter datasets

- `fir_city_pulse_300`
  - Balanced starter data across Chennai, Bengaluru, and Hyderabad.
  - Good default dataset for dashboard, upload, filters, map, and prediction demos.
- `fir_women_safety_180`
  - Higher concentration of women-related incidents and clustered urban points.
  - Good for women safety markers, alerts, and hotspot visualization.
- `fir_accident_hotspots_180`
  - Accident-heavy records with denser traffic hotspots.
  - Good for accident cluster analysis and patrol planning demos.

## Source inspiration

These files are synthetic and import-ready. They were shaped around public Indian open-data themes so the demo stays grounded in realistic use cases without depending on brittle external downloads.

- Crime against women catalog: https://www.data.gov.in/catalog/cases-registered-and-their-disposal-under-crime-against-women
- Crime in India 2023 resource example: https://www.data.gov.in/resource/stateut-wise-disposal-persons-arrested-crime-against-women-during-2023
- Road accidents resource: https://www.data.gov.in/resource/stateut-wise-total-number-road-accidents-india-2016-2019
- Police stations resource example: https://www.data.gov.in/resource/d64-police-stations

## Generate again

```bash
cd backend
python scripts/generate_base_datasets.py
```

## Use with the app

- Upload any `.csv` or `.json` file from `base/` through the admin upload UI.
- Or seed the backend with a CSV:

```bash
python scripts/seed_db.py --file data/base/fir_city_pulse_300.csv
```
