🛒 Fullstack Webshop - Skolprojekt

Detta är en fullstack-webshop byggd med en tydlig separation mellan frontend och backend. Projektet använder en molnbaserad SQL-databas för att hantera produkter, kunder och ordrar.

---

## 🛠 Teknikstack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js & Express.js
- **Databas:** SQL (Hostad via [Aiven](https://aiven.io/))

---

## 🚀 Kom igång lokalt

Följ dessa steg för att installera och köra projektet på din egen dator.

### 1. Installation av dependencies

Du behöver installera paket i projektets root, samt i mapparna för frontend och backend.

````bash
# I projektets root
npm install

# Installera för frontend
cd frontend
npm install
cd ..

# Installera för backend
cd backend
npm install
### 2. Konfigurera Databas (.env)

Du måste koppla backenden till din Aiven-databas för att applikationen ska fungera.

1. Navigera till mappen `backend/`.
2. Skapa en fil med namnet `.env`.
3. Lägg till din anslutningssträng:

```env
DATABASE_URL=din_aiven_anslutningssträng_här
PORT=3000
````

---

## 2. Konfigurera Databas (.env)

Du måste koppla backenden till din Aiven-databas för att applikationen ska fungera.

1. Navigera till mappen `backend/`.
2. Skapa en fil med namnet `.env`.
3. Lägg till din anslutningssträng:

```env
Så här har vår .env fil sett ut.
DB_HOST=***
DB_USER=***
DB_PASSWORD=***
DB_NAME=***
DB_PORT=***

PORT=3000
```

---

### 3. Starta applikationen

För att köra projektet fullt ut behöver du ha två processer igång samtidigt:

- **Backend:** Gå till mappen `backend/` i terminalen och kör:

```bash
node server.js
```

- **Frontend:** Stå i projektets root och starta din frontend genom att använda tillägget **Live Server** i VS Code (högerklicka på `index.html` inne i mappen `frontend/` och välj _"Open with Live Server"_).

---

## ✨ Funktioner

- **Produktkatalog:** Hämtar data i realtid från SQL-databasen.
- **Kategorisering:** Sortera produkter baserat på kategori för enklare navigering.
- **Sökfunktion:** Hitta produkter snabbt via ett dynamiskt sökfält.
- **Varukorg:** Lägg till, ändra och hantera produkter inför ett köp.
- **Användarhantering:** Möjlighet att registrera sig som kund i systemet.
- **Orderläggning:** Skapa och spara ordrar som kopplas direkt till kundkontot i databasen.

---

## 📂 Projektstruktur

```plaintext
.
├── backend/            # Express-endpoints och miljövariabler (.env)
├── frontend/           # Klient-sidan (HTML, CSS, JS)
├── node_modules/       # Projektets bibliotek/dependencies
├── package.json        # Root-konfiguration
├── server.js           # Huvudfil för backend-servern
└── README.md           # Projektdokumentation
```
