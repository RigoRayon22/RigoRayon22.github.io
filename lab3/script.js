// ===== "Image" icons (SVG as <img src="...">) =====
const ICON_OK = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <circle cx="12" cy="12" r="11" fill="#2ee59d"/>
  <path d="M7 12.4l3.2 3.2L17.6 8.2" fill="none" stroke="#000" stroke-width="2.8"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

const ICON_NO = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <circle cx="12" cy="12" r="11" fill="#ff4d6d"/>
  <path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="#000" stroke-width="2.8"
    stroke-linecap="round"/>
</svg>`);

// ===== localStorage keys =====
const TIMES_KEY = "pokemonQuiz_timesTaken";
const LAST_SCORE_KEY = "pokemonQuiz_lastScore";

// ===== helpers =====
function shuffle(arr) {
  // Fisher-Yates shuffle
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function setFeedback(element, correct, msg, detail) {
  element.hidden = false;
  element.innerHTML = `
    <img src="${correct ? ICON_OK : ICON_NO}" alt="${correct ? "Correct" : "Incorrect"}">
    <div>
      <div><strong>${msg}</strong></div>
      <div style="font-size: 12px; color:#555;">${detail}</div>
    </div>
  `;
}

function normalizeText(s) {
  return String(s || "").trim().toLowerCase();
}

// ===== build Q1 radio options in random order =====
const q1Options = [
  "Bulbasaur",
  "Charmander",
  "Squirtle",
  "Pikachu" // correct (NOT a Kanto starter)
];

const q1ChoicesDiv = document.getElementById("q1Choices");
const shuffledQ1 = shuffle(q1Options);

for (let i = 0; i < shuffledQ1.length; i++) {
  const opt = shuffledQ1[i];
  const id = "q1_" + i;

  const wrapper = document.createElement("div");
  wrapper.className = "choice";

  wrapper.innerHTML = `
    <input type="radio" id="${id}" name="q1" value="${opt}">
    <label for="${id}">${opt}</label>
  `;

  q1ChoicesDiv.appendChild(wrapper);
}

// ===== slider value display =====
const q5Range = document.getElementById("q5Range");
const q5Val = document.getElementById("q5Val");
q5Val.textContent = q5Range.value;

q5Range.addEventListener("input", function () {
  q5Val.textContent = q5Range.value;
});

// ===== load localStorage stats =====
const timesTakenEl = document.getElementById("timesTaken");
const lastScoreEl = document.getElementById("lastScore");

function loadStats() {
  const times = Number(localStorage.getItem(TIMES_KEY) || "0");
  const last = localStorage.getItem(LAST_SCORE_KEY);

  timesTakenEl.textContent = times;
  lastScoreEl.textContent = last ? `${last} / 100` : "—";
}
loadStats();

// ===== submit grading =====
const form = document.getElementById("quizForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let score = 0;

  // Q1
  const q1 = form.querySelector('input[name="q1"]:checked');
  const q1Correct = q1 && q1.value === "Pikachu";
  if (q1Correct) score += 20;
  setFeedback(
    document.getElementById("q1Feedback"),
    q1Correct,
    q1Correct ? "Correct!" : "Incorrect!",
    q1Correct ? "Pikachu is not a Gen 1 starter choice." : "Correct answer: Pikachu."
  );

  // Q2
  const q2Checked = Array.from(form.querySelectorAll('input[name="q2"]:checked'))
    .map(x => x.value);
  const q2Set = new Set(q2Checked);

  const needed = ["Vaporeon", "Jolteon", "Flareon"];
  const hasAll = needed.every(v => q2Set.has(v));
  const hasWrong = q2Set.has("Pikachu");
  const q2Correct = hasAll && !hasWrong && q2Checked.length === 3;

  if (q2Correct) score += 20;
  setFeedback(
    document.getElementById("q2Feedback"),
    q2Correct,
    q2Correct ? "Correct!" : "Incorrect!",
    q2Correct ? "Yep! Those are the Gen 1 Eeveelutions." : "Correct: Vaporeon, Jolteon, Flareon."
  );

  // Q3
  const q3 = document.getElementById("q3Select").value;
  const q3Correct = q3 === "Electric";
  if (q3Correct) score += 20;
  setFeedback(
    document.getElementById("q3Feedback"),
    q3Correct,
    q3Correct ? "Correct!" : "Incorrect!",
    q3Correct ? "Electric beats Water." : "Correct answer: Electric."
  );

  // Q4
  const q4 = document.getElementById("q4Text").value;
  const q4Correct = normalizeText(q4) === "25";
  if (q4Correct) score += 20;
  setFeedback(
    document.getElementById("q4Feedback"),
    q4Correct,
    q4Correct ? "Correct!" : "Incorrect!",
    q4Correct ? "Yep! Pikachu is #25." : "Correct answer: 25."
  );

  // Q5
  const q5 = Number(q5Range.value);
  const q5Correct = q5 === 12;
  if (q5Correct) score += 20;
  setFeedback(
    document.getElementById("q5Feedback"),
    q5Correct,
    q5Correct ? "Correct!" : "Incorrect!",
    q5Correct ? "Nice slider control!" : "Set it to exactly 12."
  );

  // show total
  const results = document.getElementById("results");
  const scoreLine = document.getElementById("scoreLine");
  const congrats = document.getElementById("congrats");

  results.hidden = false;
  scoreLine.textContent = `Score: ${score} / 100`;

  // above 80
  congrats.hidden = !(score > 80);

  // update localStorage times taken + last score
  const prevTimes = Number(localStorage.getItem(TIMES_KEY) || "0");
  localStorage.setItem(TIMES_KEY, String(prevTimes + 1));
  localStorage.setItem(LAST_SCORE_KEY, String(score));
  loadStats();
});

// ===== reset button =====
document.getElementById("resetBtn").addEventListener("click", function () {
  form.reset();

  // reset slider display
  q5Val.textContent = q5Range.value;

  // hide feedback
  const ids = ["q1Feedback", "q2Feedback", "q3Feedback", "q4Feedback", "q5Feedback"];
  for (let i = 0; i < ids.length; i++) {
    const el = document.getElementById(ids[i]);
    el.hidden = true;
    el.innerHTML = "";
  }

  document.getElementById("results").hidden = true;
  document.getElementById("congrats").hidden = true;
});