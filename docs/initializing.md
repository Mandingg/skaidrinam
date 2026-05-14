## Pradinė konfigūracija (Būtina!)

### 1. Backend paruošimas
1. Eikite į `backend` aplanką (cd backend)
2. Jei neturite, sukurkite ir aktyvuokite virtualią aplinką:
   * **Windows:** `py -m venv venv` tada `.\venv\Scripts\activate`
   * **macOS/Linux:** `python3 -m venv venv` tada `source venv/bin/activate`
3. **SVARBU:** Įdiekite visas bibliotekas:
   ```bash
   pip install -r requirements.txt


### 2. Frontend paruošimas
1. Eikite į `frontend` aplanką.
2. **SVARBU:** Įdiekite visas bibliotekas:
   ```bash
   npm install


### Svarbi pastaba dėl paketų valdymo
Jei savo darbe naudojate naujas Python bibliotekas (pvz., papildomus įrankius duomenų analizei ar naujas FastAPI dalis):
1. Įdiekite paketą savo virtualioje aplinkoje: `pip install <paketo_pavadinimas>`.
2. **BŪTINAI** atnaujinkite `requirements.txt` failą: `pip freeze > requirements.txt`.
3. Įkelkite (commit/push) atnaujintą `requirements.txt` į saugyklą, kad kiti komandos nariai galėtų sinchronizuoti savo aplinkas.