console.log("running");

// random number 1-99
let correctNumber = Math.floor(Math.random() * 99) + 1;

let correctMessage = "Congrats! You guessed it!";
let attempts = 0;
let wins = 0;
let losses = 0;

let guessInput = document.querySelector("#guessInput");
let guessButton = document.querySelector("#guessButton");
let guessResult = document.querySelector("#guessResult");
let hintMessage = document.querySelector("#hintMessage");
let attemptCount = document.querySelector("#attemptCount");
let winCount = document.querySelector("#winCount");
let lossCount = document.querySelector("#lossCount");
let previousGuesses = document.querySelector("#previousGuesses");
let playAgainButton = document.querySelector("#playAgainButton");

function validateInput(value) {
  if (value < 1 || value > 99 || isNaN(value)) {
    guessResult.textContent = "Enter a number between 1 and 99.";
    guessResult.className = "yellow";
    return false;
  }
  return true;
}

guessButton.addEventListener("click", function () {

  let userGuess = Number(guessInput.value);

  if (!validateInput(userGuess)) return;

  attempts++;
  attemptCount.textContent = attempts;

  // append guesses (required hint)
  previousGuesses.textContent += userGuess + " ";

  if (userGuess === correctNumber) {
    guessResult.textContent = correctMessage + " Attempts: " + attempts;
    guessResult.className = "green";

    wins++;
    winCount.textContent = wins;

    guessButton.disabled = true;
    playAgainButton.style.display = "inline";

    return;
  }

  guessResult.textContent = "Wrong guess!";
  guessResult.className = "red";

  if (userGuess < correctNumber) {
    hintMessage.textContent = "Too low. Guess higher.";
  } else {
    hintMessage.textContent = "Too high. Guess lower.";
  }

  if (attempts === 7) {
    guessResult.textContent = "You Lost! The number was " + correctNumber;
    guessResult.className = "red";

    losses++;
    lossCount.textContent = losses;

    guessButton.disabled = true;
    playAgainButton.style.display = "inline";
  }

  guessInput.value = "";
});

playAgainButton.addEventListener("click", function () {

  correctNumber = Math.floor(Math.random() * 99) + 1;
  attempts = 0;
  attemptCount.textContent = 0;
  previousGuesses.textContent = "";
  hintMessage.textContent = "";
  guessResult.textContent = "New game started!";
  guessResult.className = "";

  guessButton.disabled = false;
  playAgainButton.style.display = "none";
});