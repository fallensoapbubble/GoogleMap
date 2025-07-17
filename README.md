


# 🗺️ ValueVista: Real Estate Meets Real Engineering 🚀

Welcome to **ValueVista**, where property search gets an IQ upgrade!  
This isn't just another frontend/backend app – it's a full-stack, full-power, map-powered, AI-curious real estate platform.

---

## 🔧 Tech Stack That Slaps

- 🖥️ **Frontend**: React + Vite + Tailwind + Lucide Icons  
- 🧠 **Backend**: Node.js + GraphQL + Apollo + MongoDB  
- 🧰 **Dev Magic**: Docker Compose, hot-reload, data seeding, live debugging  
- 🌍 **Maps & Intelligence**: Google Maps API, price heatmaps, walk zones, AI recs  
- 🧪 **Database**: MongoDB w/ preloaded dump

---

## ⚡ TL;DR — Get It Running in 3 Steps

```bash
# 1️⃣ Clone the repo
https://github.com/fallensoapbubble/GoogleMap

# 2️⃣ Fire it up
docker-compose -f gmapfinal.yml up -d --build

# 3️⃣ Open the magic
Frontend 👉 http://localhost:8080  
Backend 👉 http://localhost:4000/graphql
````

---

## 🧰 Dev Toolbox

### 🔄 Stop Everything

```bash
docker-compose -f gmapfinal.yml down
```

### 💣 Nuke Everything (Warning: This deletes all volumes & containers!)

```bash
docker system prune -a --volumes -f
```

### 🧠 Peek into MongoDB (CLI Wizardry)

```bash
docker exec -it gmap-mongo mongosh

# Once inside:
use realestate
show collections
db.properties.find().pretty()
```

---

## 🧩 Services Breakdown (Docker Compose Style)

| Service    | Port    | Description                       |
| ---------- | ------- | --------------------------------- |
| `frontend` | `8080`  | Vite dev server with hot-reload   |
| `backend`  | `4000`  | GraphQL API w/ Node.js + Apollo   |
| `mongo`    | `27017` | MongoDB with seeded property data |

---

## 📦 File Structure

```
├── frontend/       # React + Vite App
├── backend/        # Node + GraphQL + Apollo Server
├── dump/           # MongoDB seed dump
├── gmapfinal.yml   # Docker Compose config
└── .env.local      # Your API keys & secrets (not committed)
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root of each project (`frontend/`, `backend/`) and add the following:

### frontend/.env.local

```env
VITE_GRAPHQL_URL=http://localhost:4000/
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### backend/.env.local

```env
MONGODB_URI=mongodb://mongo:27017/realestate
```

---

## 🧪 Bonus Commands

### Rebuild and restart everything

```bash
docker-compose -f gmapfinal.yml up -d --build
```

### See what’s in the database

```bash
docker exec -it gmap-mongo mongo realestate --eval "db.properties.find().toArray()"
```

---

## 🛸 Future Plans

* AR overlays for real-world property scouting
* Blockchain for transaction verification
* AI agent matchmaker (swipe left on bad realtors)
* Offline map caching & voice search


---

## 🧼 Clean Exit

```bash
docker-compose -f gmapfinal.yml down
```

Thanks for being a map nerd with us.
Now go explore some property data like it's 2040. 🛰️

---

