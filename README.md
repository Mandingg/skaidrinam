# Skaidrinam – Finansų valdymo sistema su čekių skanavimu

Šis projektas skirtas automatizuotam išlaidų sekimui naudojant OCR technologiją.

## Komanda
- Inga
- Patrik
- Emilija
- Stasys
- Edvin
- Benita
- Karolis
- Dmitrij
- Gintarė
- Andrius

## Tikslas
Sukurti sistemą, kuri leidžia vartotojams įkelti čekius, nuskaityti juos OCR pagalba ir analizuoti išlaidas.

## Technologijos
- Python
- FastAPI
- MySQL
- Docker
- Streamlit/React



## ===== Aplikacijos  funkciniai reikalavimai =====


Vartotojo registracija:

Sistema leidžia naujam vartotojui užsiregistruoti.

Vartotojo prisijungimas:

Sistema leidžia vartotojui prisijungti naudojant jų registruotą el. pašto adresą ir slaptažodį.

Sistema patvirtina duomenis ir, sėkmingai patvirtinus autentiškumą, suteikia prieigą prie puslapio.

Vartotojo atsijungimas:

Sistema leidžia vartotojui atsijungti nuo savo paskyros, redaguoti ir ištrinti savo paskyrą.

Prieigos kontrolė:

Sistema apriboja prieigą prie tam tikrų funkcijų pagal naudotojo rolę.

Sistema turi užtikrinti, kad neautorizuoti naudotojai negalėtų patekti į ribotas vietas.

Informavimo sistema:

Sistema atvaizduoja pranešimus, kai įvykdomi veiksmai, ar kyla klaidos.

Paieškos funkcijos:

Sistemoje turi būti įdiegta paieškos funkcija, leidžianti programoje ieškoti konkretaus turinio.

Paieškos rezultatai sistemoje turi būti rodomi patogiu naudotojui būdu.

Puslapiavimas:

Sistema turi leisti naudotojams naršyti tarp puslapių naudojant puslapiavimo valdiklius.

Filtravimas:

Sistemoje turi būti numatytos filtravimo parinktys, leidžiančios naudotojams susiaurinti elementų sąrašą pagal kriterijus.

Rūšiavimas:

Sistemoje turi būti numatytos rūšiavimo parinktys, leidžiančios naudotojams rūšiuoti elementų sąrašą pagal įvairius požymius.

Sistema leidžia naudotojams perjungti kiekvieno rūšiuojamo požymio didėjimo arba mažėjimo tvarką.

Turinio valdymas:

Sistema turi leisti administratoriams tvarkyti rodomą turinį (pridėti, redaguoti, ištrinti).

Sistema turi užtikrinti, kad turinio valdymo užduotis galėtų atlikti tik autorizuoti naudotojai.

Ataskaitų generavimas:

Sistema turi leisti administratoriams generuoti ataskaitas apie naudotojų veiklą ir sistemos naudojimą.

Nefunkciniai reikalavimai

Suderinamumas:

Sistema turi būti suderinama su pagrindinėmis naršyklėmis („Chrome“, „Firefox“, „Safari“, „Edge“).

Sistema turi būti pritaikyta ir veikti įvairiuose įrenginiuose (desktop, tablets, smartphones).

Prieinamumas:

Sistema turi atitikti prieinamumo standartus WCAG 2.1, kad ja galėtų naudotis neįgalieji.

Sistemoje turi būti numatytas alternatyvus vaizdų tekstas ir navigacijos klaviatūra palaikymas.

Apsauga:

Sistema naudoja šifravimą, kad apsaugotų slaptus duomenis, pavyzdžiui, slaptažodžius.

Tinkamumas naudoti:

Sistemoje pateikiami aiškūs pranešimai apie klaidas ir nurodymai, kaip spręsti problemas.

Logging:

Sistemoje turi būti saugomi naudotojų veikla.

Sistemoje administratoriams turi būti suteiktos priemonės žurnalams peržiūrėti
