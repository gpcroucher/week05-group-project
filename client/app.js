const serverURL = "Http://localhost";

//function to create delete button

function createDeleteButton(filmID, listType, username) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", async function () {
    await deleteFilm(filmID, listType, username);
    removeFilm(filmID);
  });
  return deleteButton;
}

async function deleteFilm(filmID, listType, username) {
  await fetch(`http://localhost:8080/list`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filmID: filmID,
      list: listType,
      username: username,
    }),
  });
}

function removeFilm(filmID) {
  const filmElement = document.getElementById(`film-${filmID}`);
  if (filmElement) {
    filmElement.remove();
  }
}
//not done this yet, but this is assuming we will render it
function renderFilm(film, listType, username) {
  const filmElement = document.createElement("div");
  filmElement.id = `film-${film.id}`;
  filmElement.textContent = film.title;

  const deleteButton = createDeleteButton(film.id, listType, username);
  filmElement.appendChild(deleteButton);

  document.getElementById("filmList").appendChild(filmElement);
}
const form = document.getElementById("searchform");
const searchButton = document.getElementById("searchsubmit");

async function searchTMDB(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const result = Object.fromEntries(formData);
  const query = result.searchinput;
  if (query === "") {
    alert("Please enter a search term");
    return;
  }
  const response = await fetch(`http://localhost:8080/search?q=${query}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  console.log(data);
  // TODO: write displaySearchResults() function [cards]
  // displaySearchResults(data);
  form.reset();
  return data;
}

form.addEventListener("submit", searchTMDB);

//for the Game

function splitIntoWords(text) {
  return text.split(" ").filter((word) => word);
}

function calculateAccuracy(userGuessWords, fullQuoteWords) {
  let correctWords = 0;

  for (let i = 0; i < fullQuoteWords.length; i++) {
    if (
      userGuessWords[i] &&
      userGuessWords[i].toLowerCase() === fullQuoteWords[i].toLowerCase()
    ) {
      correctWords++;
    }
  }
  return (correctWords / fullQuoteWords.length) * 100;
}

async function startGame() {
  const response = await fetch(`http://localhost:8080/random-quote`);
  const data = await response.json();
  const fullQuote = data.quote;

  const words = fullQuote.split(" ");
  const firstWord = words[0];
  const lastWord = words[words.length - 1];

  const prompt = document.getElementById("quote-prompt");
  prompt.textContent = `Clue: ${firstWord} ... ${lastWord}`;

  document.getElementById("feedback").textContent = "";
  document.getElementById("quote-guess").value = "";
}

const quizForm = document.getElementById("quote-user-answer");
quizForm.addEventListener("Submit", function (event) {
  event.preventDefault();

  const userGuess = document.getElementById("quote-guess").value;
  const fullQuoteWords = splitIntoWords(fullQuote);
  const userGuessWords = splitIntoWords(userGuess);

  const accuracy = calculateAccuracy(userGuessWords, fullQuoteWords);

  const feedback = document.getElementById("feedback");
  if (accuracy >= 90) {
    feedback.textContent = `Correct! Well Done!`;
  } else {
    feedback.textContent = `Incorrect! The correct answer is: "${fullQuote}"`;
  }
  quizForm.style.display = "none";
  document.getElementById("new-quote-button").style.display = "block";
});

//to start another game

function newGame() {
  document.getElementById("feedback").textContent = "";
  document.getElementById("quote-guess").value = "";
  document.getElementById("quote-user-answer").style.display = "block";
  document.getElementById("new-quote-button").style.display = "none";
  startGame();
}

document.getElementById("new-quote-button").addEventListener("click", newGame);

startGame();
