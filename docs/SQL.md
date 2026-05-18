# Skaidrinam – SQL workflow

## Projekto struktūra

database/
├── 01_schema.sql
├── 02_seed.sql
└── 03_dev_data.sql (nebūtina)

- 01_schema.sql → lentelių struktūra, FK, indeksai
- 02_seed.sql → minimalūs pradiniai duomenys
- 03_dev_data.sql → papildomi development/test duomenys

---

# Docker paleidimas

## Paleisti servisus

docker compose up -d

## Sustabdyti servisus

docker compose down

## Pilnai perkurti DB nuo nulio

docker compose down -v
docker compose up -d

SVARBU!!!:

- `-v` ištrina visą MySQL volume
- DB sukuriama iš naujo naudojant SQL 01_schema ir 02_seed failus

---

# MySQL prisijungimas

Host: localhost
Port: 3306
Database: skaidrinam_db

Credentials saugomi `.env` faile.

---

# DB failų paskirtis

## 01_schema.sql

Skirtas tik:

- CREATE TABLE
- ALTER TABLE
- FOREIGN KEY
- INDEX
- CONSTRAINT

Negalima:

- dėti testinių INSERT
- dėti demo duomenų

## 02_seed.sql

Skirtas:

- kategorijoms
- bazinėms parduotuvėms
- roles
- admin user
- minimaliems būtiniems duomenims

## 03_dev_data.sql

Nebūtinas.

Naudojamas:

- demo duomenims
- development test data
- prezentacijoms

Gali būti generuojamas naudojant:
Workbench → Server → Data Export → Dump Data Only

---

# DB pakeitimų workflow

## Jei keičiasi schema

Pvz:

- nauja lentelė
- naujas column
- FK pakeitimai

Veiksmai:

1. Atnaujinti `01_schema.sql`
2. Commitinti pakeitimus
3. Kiti komandos nariai:
   - git pull
   - docker compose down -v
   - docker compose up -d

## Jei keičiasi seed duomenys

Pvz:

- naujos kategorijos
- naujos default stores

Veiksmai:

1. Atnaujinti `02_seed.sql`
2. Commitinti
3. Kiti komandos nariai:
   - git pull
   - docker compose down -v
   - docker compose up -d

---

# Svarbios taisyklės

- Nekeisti DB rankiniu būdu neatsinaujinant SQL failų
- Schema visada turi būti saugoma Git
- Nekommitinti lokalios MySQL volume informacijos
- Nekommitinti `.env`
- Po schema pakeitimų visada testuoti clean setup naudojant:
  docker compose down -v
  docker compose up -d

---

# Workflow

1. docker compose up -d
2. Dirbti su DB / backend
3. Commitinti schema pokyčius
4. git push
5. Kiti komandos nariai:
   - git pull
   - docker compose down -v
   - docker compose up -d
