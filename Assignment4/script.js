const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ui = {
  input: $("#wordInput"),
  search: $("#searchBtn"),
  status: $("#status"),
  results: $("#results"),
  defTpl: $("#defTpl"),
  history: $("#history"),
  clearHistory: $("#clearHistory"),
  themeToggle: $("#themeToggle"),
};

const HISTORY_KEY = "dict_history_v1";
const THEME_KEY = "dict_theme_v1";
const HISTORY_LIMIT = 10;

/* ---------- Theme ---------- */
function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
    ui.themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("light");
    ui.themeToggle.textContent = "🌙";
  }
}
applyTheme(localStorage.getItem(THEME_KEY) || "dark");

ui.themeToggle.addEventListener("click", () => {
  const current = document.body.classList.contains("light") ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

/* ---------- History ---------- */
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}
function saveHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_LIMIT)));
}
function addToHistory(word) {
  if (!word) return;
  const list = loadHistory().filter(w => w.toLowerCase() !== word.toLowerCase());
  list.unshift(word);
  saveHistory(list);
  renderHistory();
}
function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}
function renderHistory() {
  const list = loadHistory();
  ui.history.innerHTML = "";
  if (!list.length) return;
  list.forEach(w => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = w;
    chip.addEventListener("click", () => searchWord(w));
    ui.history.appendChild(chip);
  });
}
ui.clearHistory.addEventListener("click", clearHistory);
renderHistory();

/* ---------- Search ---------- */
ui.search.addEventListener("click", () => searchWord());
ui.input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchWord();
});

async function searchWord(manualWord) {
  const word = (manualWord || ui.input.value || "").trim();
  if (!word) {
    setStatus("Type a word to search.");
    return;
  }
  setStatus("Loading…");
  ui.results.hidden = true;
  ui.results.innerHTML = "";

  try {
    const res = await fetch(API_BASE + encodeURIComponent(word));
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    renderResults(data, word);
    addToHistory(word);
    setStatus("");
  } catch (err) {
    setStatus("No results found. Try another word.");
  }
}

function setStatus(msg) {
  ui.status.textContent = msg || "";
}

/* ---------- Render ---------- */
function renderResults(data, queryWord) {
  ui.results.innerHTML = "";
  ui.results.hidden = false;

  // The API returns an array of entries (same word, different origins/usages)
  data.forEach(entry => {
    const meanings = entry.meanings || [];
    if (!meanings.length) return;

    meanings.forEach(meaning => {
      const defs = meaning.definitions || [];
      if (!defs.length) return;

      const card = ui.defTpl.content.firstElementChild.cloneNode(true);

      // Word and part of speech
      $(".word", card).textContent = entry.word || queryWord;
      $(".pos", card).textContent = meaning.partOfSpeech ? `Part of speech: ${meaning.partOfSpeech}` : "";

      // Phonetics + audio
      const phWrap = $(".phonetics", card);
      const phonetics = (entry.phonetics || []).filter(p => p.text || p.audio);
      const addedAudios = new Set();

      phonetics.forEach(p => {
        if (p.text) {
          const tag = document.createElement("span");
          tag.className = "phonetic-tag";
          tag.textContent = p.text;
          phWrap.appendChild(tag);
        }
        if (p.audio && !addedAudios.has(p.audio)) {
          addedAudios.add(p.audio);
          const btn = document.createElement("button");
          btn.className = "audio-btn";
          btn.type = "button";
          btn.textContent = "🔊";
          btn.addEventListener("click", () => {
            const audio = new Audio(p.audio);
            audio.play().catch(() => {});
          });
          phWrap.appendChild(btn);
        }
      });

      // Definitions list
      const defsWrap = $(".defs", card);
      defs.slice(0, 6).forEach((d, idx) => {
        const row = document.createElement("div");
        row.className = "definition";
        const defP = document.createElement("p");
        defP.innerHTML = `<strong>${idx + 1}.</strong> ${escapeHTML(d.definition || "")}`;
        row.appendChild(defP);

        if (d.example) {
          const ex = document.createElement("div");
          ex.className = "example";
          ex.textContent = `“${d.example}”`;
          row.appendChild(ex);
        }
        defsWrap.appendChild(row);
      });

      // Synonyms
      const syns = uniqueFlat([
        meaning.synonyms || [],
        defs.map(d => d.synonyms || []).flat()
      ]).slice(0, 20);

      if (syns.length) {
        const wrap = $(".syns", card);
        wrap.hidden = false;
        const chips = $(".chips", wrap);
        syns.forEach(s => {
          const chip = document.createElement("button");
          chip.className = "chip";
          chip.textContent = s;
          chip.addEventListener("click", () => searchWord(s));
          chips.appendChild(chip);
        });
      }

      // Antonyms
      const ants = uniqueFlat([
        meaning.antonyms || [],
        defs.map(d => d.antonyms || []).flat()
      ]).slice(0, 20);

      if (ants.length) {
        const wrap = $(".ants", card);
        wrap.hidden = false;
        const chips = $(".chips", wrap);
        ants.forEach(a => {
          const chip = document.createElement("button");
          chip.className = "chip";
          chip.textContent = a;
          chip.addEventListener("click", () => searchWord(a));
          chips.appendChild(chip);
        });
      }

      ui.results.appendChild(card);
    });
  });

  if (!ui.results.children.length) {
    setStatus("No usable definitions found.");
  }
}

/* ---------- Helpers ---------- */
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
function uniqueFlat(arr) {
  return [...new Set(arr.flat().filter(Boolean))];
}

/* ---------- Optional: load a demo word on first visit ---------- */
if (!loadHistory().length) {
  searchWord("example");
}
