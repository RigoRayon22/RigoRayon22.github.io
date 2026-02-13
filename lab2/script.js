let secretNumber = Math.floor(Math.random() * 100); // 0-99
let attempts = [];
let maxAttempts = 7;

let wins = 0;
let losses = 0;
let gameOver = false;

const form = document.getElementById("guessForm");
const playerName = document.getElementById("playerName");
const guessInput = document.getElementById("guessInput");

const guessBtn = document.getElementById("guessBtn");
const resetBtn = document.getElementById("resetBtn");

const attemptCount = document.getElementById("attemptCount");
const attemptList = document.getElementById("attemptList");

const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");

const errorMsg = document.getElementById("errorMsg");
const hintMsg = document.getElementById("hintMsg");
const winMsg = document.getElementById("winMsg");
const loseMsg = document.getElementById("loseMsg");

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function updateAttemptsList() {
  attemptCount.textContent = attempts.length.toString();
  attemptList.innerHTML = "";

  // latest first
  const reversed = [...attempts].reverse();
  reversed.forEach((num, i) => {
    const li = document.createElement("li");
    li.textContent = num;
    attemptList.appendChild(li);
  });
}

function showError(text) {
  errorMsg.textContent = text;
  show(errorMsg);
}

function clearError() {
  errorMsg.textContent = "";
  hide(errorMsg);
}

function endGameWin() {
  gameOver = true;
  wins++;
  winsEl.textContent = wins.toString();

  winMsg.textContent = "Congrats! You guessed the number in " + attempts.length + " tries.";
  show(winMsg);

  hide(loseMsg);

  guessBtn.disabled = true;
  show(resetBtn);
}

function endGameLose() {
  gameOver = true;
  losses++;
  lossesEl.textContent = losses.toString();

  // rubric: show "You Lost" in red AND random number
  loseMsg.textContent = "You Lost! The number was " + secretNumber + ".";
  show(loseMsg);

  hide(winMsg);

  guessBtn.disabled = true;
  show(resetBtn);
}

function resetGame() {
  secretNumber = Math.floor(Math.random() * 100);
  attempts = [];
  gameOver = false;

  clearError();
  hintMsg.textContent = "New game started. Make a guess!";

  hide(winMsg);
  hide(loseMsg);

  guessBtn.disabled = false;
  hide(resetBtn);

  guessInput.value = "";
  updateAttemptsList();
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (gameOver) return;

  clearError();

  if (playerName.value.trim() === "") {
    showError("Please enter your name.");
    return;
  }

  const guessValue = guessInput.value;

  if (guessValue === "") {
    showError("Please enter a guess.");
    return;
  }

  const guess = Number(guessValue);

  // rubric: error if higher than 99
  if (guess > 99) {
    showError("Error: guess must be 99 or less.");
    return;
  }
  if (guess < 0) {
    showError("Error: guess must be 0 or higher.");
    return;
  }
  if (!Number.isInteger(guess)) {
    showError("Error: guess must be a whole number.");
    return;
  }

  attempts.push(guess);
  updateAttemptsList();

  // message high/low
  if (guess < secretNumber) {
    hintMsg.textContent = "Too low!";
  } else if (guess > secretNumber) {
    hintMsg.textContent = "Too high!";
  } else {
    hintMsg.textContent = "Correct!";
  }

  // win within 7 attempts
  if (guess === secretNumber && attempts.length <= maxAttempts) {
    endGameWin();
    return;
  }

  // lose if not within 7 attempts
  if (attempts.length >= maxAttempts && guess !== secretNumber) {
    endGameLose();
    return;
  }

  guessInput.select();
});

resetBtn.addEventListener("click", resetGame);

// start
updateAttemptsList();