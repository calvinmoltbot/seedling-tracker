# Seedling Tracker

A mobile-first web app for gardeners to track seed sowings — from packet to plant.

## The Problem

You're in the greenhouse, hands full of soil, planting dozens of seed trays. You promise yourself you'll remember what you planted where. You won't. Three weeks later you have trays of seedlings and no idea what's what.

## The Solution

Seedling Tracker connects your physical seed trays to a digital record:

1. **Plant seeds** → Snap a photo of the packet
2. **Create a record** → Enter name, variety, brand
3. **Photograph the tray** → Visual reminder of what went where
4. **Print a label** → Stick code S001 (or write it) on the tray
5. **Track progress** → Mark germinated, potted, shared, or discarded

## Features (MVP)

- 📱 Mobile-first design — works perfectly on your phone in the greenhouse
- 📸 Photo capture — seed packet and tray photos for visual records
- 🏷️ Label codes — Auto-generated codes (S001, S002...) link physical trays to digital records
- 📋 Status tracking — Know what's at what stage (planted → germinated → potted)
- 🔍 Quick lookup — Find any sowing by its label code

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Image Storage:** Local filesystem

## Getting Started

```bash
# Clone the repo
git clone https://github.com/calvinmoltbot/seedling-tracker.git
cd seedling-tracker

# Install dependencies (run in both frontend and backend directories)
cd frontend && npm install
cd ../backend && npm install

# Start development servers
cd backend && npm run dev   # Starts API on :3001
cd frontend && npm run dev  # Starts React dev server on :5173
```

## Project Structure

```
seedling-tracker/
├── frontend/          # React app
├── backend/           # Express API
├── uploads/           # Image storage (gitignored)
└── database.sqlite    # SQLite database (gitignored)
```

## Roadmap

See [GitHub Issues](https://github.com/calvinmoltbot/seedling-tracker/issues) for detailed tasks:

1. **Project Setup & Architecture** — Foundation and tooling
2. **Database Schema & Models** — Data structure for sowings and photos
3. **Create Sowing Flow** — Multi-step form with photo capture
4. **View & Manage Sowings** — List and detail views
5. **Label Printing Integration** — Printable labels for physical trays

## Future Ideas (Post-MVP)

- QR code support (if the PrintMaster can print them)
- Care reminders ("Pot up tomatoes today")
- Year-over-year history
- Plant database with growing guides
- Share sowings with family

## License

MIT
