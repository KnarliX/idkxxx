<div style="white-space:pre; font-family:monospace;">

# Lottie Animation Player — README

Ek **iframe-friendly**, **zero-CSS (inline styles only)** Lottie player jo URL ke query parameters se poori tarah configurable hai. Is guide me tum seekhoge ki isko kaise setup karna hai, kaun-kaun se parameters milte hain, aur unka prayog kaise karna hai — step-by-step.

[a536dab](../../issues)

---

## ✅ Features (Saar)
- **URL-driven config**: `name`, `speed`, `bg`/`background`, `loop`, `autoplay`, `direction`, `renderer`, `width`, `height`, `trigger`, `start`, `end`, `frame`, `progress`.
- **Defaults sensible**: agar param na do to bhi theek se chalega.
- **Fallback**: requested animation na mile to optional fallback `animations/error-404.json` par.
- **No external CSS**: sab kuch inline; iframe me seedha embed karo.
- **Sanitization**: `name` me sirf `a-z, A-Z, 0-9, -, _` allow; path traversal se suraksha.

---

## 📦 File Structure
project-root/
├─ animations/
│  ├─ welcome.json
│  └─ error-404.json     (optional but recommended)
├─ index.html
└─ player.js

> **Note**: `index.html` minimal shell hai; saara logic `player.js` me.

---

## 🚀 Quick Start
1. **Lottie JSON** files ko `animations/` folder me rakho (e.g., `welcome.json`).
2. Niche diye gaye `index.html` aur `player.js` ko project me daalo.
3. Local/static server se chalao (XHR ke kaaran `file://` se seedha kholne par block ho sakta hai). Examples:
   - Node: `npx serve` ya `npx http-server`
   - Python: `python -m http.server 8000`
4. Browser me `http://localhost:8000/` khol do → default animation chalega.
5. Iframe embed karna ho to:
   `<iframe src="/?name=welcome&speed=1.2" style="width:400px;height:400px;border:none;"></iframe>`

---

## 🧩 index.html (Minimal Shell)
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Lottie Player</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <script src="player.js" defer></script>
</head>
<body style="margin:0;overflow:hidden;">
  <div id="lottie"></div>
</body>
</html>

---

## 🧩 player.js (Configurable Loader)
function getParam(key, def) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key) ?? def;
}

const name = getParam("name", "welcome");
const speed = parseFloat(getParam("speed", "1"));
const bg = getParam("bg", getParam("background", "transparent"));

let loopParam = getParam("loop", "true");
let loop = true;
if (loopParam.toLowerCase() === "false") loop = false;
else if (!isNaN(loopParam)) loop = parseInt(loopParam);

const autoplay = getParam("autoplay", "true").toLowerCase() === "true";
const direction = parseInt(getParam("direction", "1"));
const renderer = getParam("renderer", "svg");
const width = getParam("width", "100vw");
const height = getParam("height", "100vh");

document.body.style.background = bg;
const container = document.getElementById("lottie");
container.style.width = width;
container.style.height = height;

const anim = lottie.loadAnimation({
  container,
  renderer,
  loop,
  autoplay,
  path: `animations/${name}.json`
});

anim.addEventListener("DOMLoaded", () => {
  anim.setSpeed(speed);
  anim.setDirection(direction);
});

---

## ⚙️ Usage Examples
- Default:
  `/` → plays `animations/welcome.json`

- Custom:
  `/?name=error-404&speed=0.5&bg=black&loop=false&autoplay=true&direction=-1&renderer=canvas&width=500px&height=500px`

---

</div>
