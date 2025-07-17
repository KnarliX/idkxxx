# 🚀 Jarvi v0.1.2 — Full Changelog

> Released: **18 July 2025**  
> Stage: `BETA`  
> Status: **LIVE**  

---

## 🧠 TL;DR
Jarvi’s v0.1.2 is finally here — after a long delay due to website development.  
This version introduces a **brand-new Playlist System**, fixes core bugs, switches to a **new backend database**, and updates the default prefix.  
Major backend cleanup + improved stability.

---

## 🐛 Bug Fixes

- 🔁 **Double response bug**: Fixed issue where commands like `help` used to respond **twice**
- ❌ **Error spam on invalid commands**: Cleaned up error handling logic
- ⚠️ **Non-existent command fallback**: Now properly shows “Unknown Command” message
- 📎 Minor cleanup: Removed unused aliases and old debug logs

---

## ⚙️ System Changes

- 🗃️ **New backend database deployed**  
  → All **previous user data wiped**  
  → System is now faster, scalable & future-ready

- 📌 **Default prefix updated**  
  → Old: `.`  
  → New: `,` (comma)

- 🧱 Internal rework for better playlist support, queue stability, and config management

---

## 🎧 New Feature — Playlist System

Introducing Jarvi's **personal playlist system** — create and manage custom music playlists.

### 📂 How It Works:
- Each playlist gets a **unique ID** (e.g. `abc123`, `3dfbkm`)
- IDs are stored per-user
- Works across servers

### 📖 Commands:
> Use the new prefix `,` (comma)

| Command | Description |
|--------|-------------|
| `create-playlist <name>` | Create a new playlist |
| `add-to-playlist <id> <song/url>` | Add songs via name or URL |
| `delete-playlist <id>` | Delete a playlist |
| `edit-playlist <id> name description <value>` | Update name/description |
| `import-playlist <id or link>` | Import from ID or supported platforms |
| `playlists` | Show your playlists |
| `pplay <id>` | Play a playlist |
| `remove-song <id> <index>` | Remove song by index (e.g. `,remove-song 3dfbkm 3`) |
| `playlist-songs <id>` | View playlist contents |

---

## 🧪 Current Limitations (Known Issues)

- 🎵 **Using a temporary third-party music node**  
  → May cause slight delays or quality drops  
  → Dedicated high-speed node coming in v0.1.3

- 🧹 **No playlist sharing yet**  
  → Playlist sharing/collab planned for future updates

- 🔐 **Data is still non-persistent if bot is removed**  
  → Proper cloud sync coming soon

---

## 📎 Dev Notes

- This version was supposed to release by **10 June 2025**, but work on the [official website](https://jarvibeta.xyz) pushed things back.
- Codebase is now more modular — making future updates much faster.
- Commands are now lint-checked and auto-documented internally.

---

## 💬 Feedback & Support

- 🌍 Website: [jarvibeta.xyz](https://jarvibeta.xyz)
- 🛟 Support Server: [discord.gg/SzKNuhqwcF](https://discord.gg/SzKNuhqwcF)
- 🧑‍💻 Dev Blog & Legal: [github.com/Jarvi-bot/legal](https://github.com/Jarvi-bot/legal)

---

> Maintained with ☕, love & late nights by the [KnarliX](https://github.com/KnarliX).  
> Stay tuned for next dropping 🔜
