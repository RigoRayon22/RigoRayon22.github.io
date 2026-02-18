const songs = []; // array 

const moods = [
  {
    id: "chill",
    bg: "#0b1220",
    card: "#111827",
    accent: "#38bdf8",
    accent2: "#22c55e",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=60",
    tagline: "Soft focus. Smooth transitions."
  },
  {
    id: "hype",
    bg: "#120a1c",
    card: "#1a1030",
    accent: "#f97316",
    accent2: "#a78bfa",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=60",
    tagline: "Big energy. No skips."
  },
  {
    id: "lateNight",
    bg: "#030712",
    card: "#0b1220",
    accent: "#60a5fa",
    accent2: "#34d399",
    image: "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=600&q=60",
    tagline: "Neon hours. Headphones on."
  },
  {
    id: "sunny",
    bg: "#1a1208",
    card: "#231a10",
    accent: "#fbbf24",
    accent2: "#fb7185",
    image: "https://images.unsplash.com/photo-1521337706264-a414f153a5e3?auto=format&fit=crop&w=600&q=60",
    tagline: "Windows open. Feel-good loops."
  }
];

// Elements
const sessionForm = document.getElementById("sessionForm");
const nameInput = document.getElementById("nameInput");
const genreSelect = document.getElementById("genreSelect");
const themeSelect = document.getElementById("themeSelect");
const minutesInput = document.getElementById("minutesInput");
const energyInput = document.getElementById("energyInput");
const resetBtn = document.getElementById("resetBtn");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const planTitle = document.getElementById("planTitle");
const planDetails = document.getElementById("planDetails");
const schedule = document.getElementById("schedule");
const themeImage = document.getElementById("themeImage");

// Listener #1  submit
sessionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const dj = nameInput.value.trim();
  const minutes = Number(minutesInput.value);
  const energy = Number(energyInput.value);

  // Control structure  if/else
  if (!dj) {
    planTitle.textContent = "Missing DJ Name";
    planDetails.textContent = "Type a DJ name so your setlist has a header.";
    return;
  }

  applyMood(themeSelect.value);          // style change 
  renderSetlist(dj, minutes, energy);    // content change 
});

// Listener #2  click
addTaskBtn.addEventListener("click", () => addSongFromInput());

// Listener #3  change
themeSelect.addEventListener("change", () => applyMood(themeSelect.value));

// Listener #4  keydown
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addSongFromInput();
  }
});

resetBtn.addEventListener("click", () => {
  songs.length = 0;
  taskList.innerHTML = "";
  schedule.innerHTML = "";
  planTitle.textContent = "No setlist yet";
  planDetails.textContent = "Choose a mood and click “Generate Setlist”.";
  nameInput.value = "";
  genreSelect.value = "hiphop";
  themeSelect.value = "chill";
  energyInput.value = 5;
  minutesInput.value = 30;
  applyMood("chill");
});

function addSongFromInput() {
  const text = taskInput.value.trim();

  // Control structure 
  if (text.length < 2) {
    planDetails.textContent = "Add a real song title (at least 2 characters).";
    return;
  }

  songs.push(text); // array usage 
  taskInput.value = "";
  renderSongs();
}

function renderSongs() {
  taskList.innerHTML = "";

  // Loop 
  for (let i = 0; i < songs.length; i++) {
    const li = document.createElement("li");
    li.className = "taskItem";
    li.textContent = songs[i];

    const del = document.createElement("button");
    del.textContent = "Remove";
    del.addEventListener("click", () => {
      songs.splice(i, 1);
      renderSongs();
    });

    li.appendChild(del);
    taskList.appendChild(li);
  }
}

function renderSetlist(dj, totalMinutes, energy) {
  const genre = genreSelect.value;
  const mood = themeSelect.value;

  planTitle.textContent = `${dj}'s ${pretty(genre)} Set`;
  planDetails.textContent =
    `Mood: ${pretty(mood)} • Energy: ${energy}/10 • Length: ${totalMinutes} min • Songs added: ${songs.length}`;

  schedule.innerHTML = "";

  // Blocks based on energy
  const opener = energy <= 3 ? "Warm-up" : "Opener";
  const peak = energy >= 7 ? "Peak" : "Groove";
  const cooldown = energy >= 8 ? "Victory Lap" : "Cool Down";

  addBlock(opener, pickLine(1, "Start smooth. Let the rhythm settle."));
  addBlock(peak, pickLine(2, "Bring the hook. Raise the tempo."));
  addBlock(cooldown, pickLine(3, "Leave them wanting one more."));

  // Optional song rotation section
  if (songs.length > 0) {
    const rotation = document.createElement("div");
    rotation.className = "block";

    const title = document.createElement("p");
    title.className = "blockTitle";
    title.textContent = "Song Rotation";

    const list = document.createElement("p");
    list.className = "muted";

    const take = Math.min(8, songs.length);
    let result = [];

    for (let i = 0; i < take; i++) {
      result.push(`• ${songs[i % songs.length]}`);
    }

    list.textContent = result.join("  ");
    rotation.appendChild(title);
    rotation.appendChild(list);
    schedule.appendChild(rotation);
  } else {
    addBlock("Add songs", "Tip: add 3–5 tracks so the rotation section appears.");
  }
}

function addBlock(title, text) {
  const div = document.createElement("div");
  div.className = "block";

  const h = document.createElement("p");
  h.className = "blockTitle";
  h.textContent = title;

  const p = document.createElement("p");
  p.className = "muted";
  p.textContent = text;

  div.appendChild(h);
  div.appendChild(p);
  schedule.appendChild(div);
}

function applyMood(moodId) {
  const m = moods.find(x => x.id === moodId) || moods[0];

  // Style change via code 
  document.documentElement.style.setProperty("--bg", m.bg);
  document.documentElement.style.setProperty("--card", m.card);
  document.documentElement.style.setProperty("--accent", m.accent);
  document.documentElement.style.setProperty("--accent2", m.accent2);

  // Dynamic image via JS 
  themeImage.src = m.image;
  themeImage.alt = `${m.id} mood cover`;

  // Content update 
  document.getElementById("subtitle").textContent = m.tagline;
}

function pretty(v) {
  return v.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
}

function pickLine(blockNum, fallback) {
  if (songs.length === 0) return fallback;
  return `Feature: ${songs[(blockNum - 1) % songs.length]}`;
}

// init
applyMood("chill");