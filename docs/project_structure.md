## Projekto struktūra
cekiukai-project/
├── backend/                # Python API dalis (FastAPI)
│   ├── app/                # Pagrindinis programos kodas
│   │   ├── models/         # Pydantic aprašytos klasės, kaip turi atrodyti: User, Expense ir pan (duomenų validavimui)
│   │   ├── routes/         # API endpoint'ai (auth, expenses, admin, user)
│   │   ├── services/       # Duomenų traukimas iš DB, OCR, skaičiavimai
│   │   └── utils/          # Pagalbinės funkcijos (LOG, valiutos)
│   ├── uploads/            # Laikina JPG/PNG nuotraukų saugykla (ignoruojama Git)
│   ├── venv/               # Virtuali Python aplinka (ignoruojama Git)
│   └── main.py             # Pagrindinis programos paleidimo failas
├── frontend/               # React vartotojo sąsaja (Vite)
│   ├── public/             # Statiniai failai (favicon ir kt.)
│   └── src/                # React šaltinio kodas
│       ├── assets/         # Nuotraukos, logotipai, stiliai
│       ├── components/     # Daugkartinio naudojimo komponentai (Spinner, Buttons)
│       ├── pages/          # Puslapiai (Login, Dashboard, History)
│       ├── services/       # API servisai (Axios užklausos)
│       └── utils/          # Datos formatavimas, skaičiavimai
├── database/               # SQL skriptai DB struktūrai (init.sql)
├── docs/                   # Papildoma projekto dokumentacija
├── docker-compose.yml      # Docker konteinerių konfigūracija
└── .gitignore              # Failai, kurių Git neturi sekti