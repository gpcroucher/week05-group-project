const serverURL = import.meta.env.VITE_SERVER_URL;

// Jon did this =)
let username = getCookie("username");
window.onload = function () {
  if (username != "" && username != null) {
    document.getElementById("usernamePrompt").innerText =
      "Welcome, " + username + "!";
  } else {
    username = prompt("Please enter your username:").toLowerCase(); //Jon did this please change if it doesnt work
    setCookie(username);
    console.log(username);
  }
};

//genreMap is a key-value pair of ID : genre, for getting genre names as movieObject gets array of genres as IDs.
//key-value pair from TMDB's genre database
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};
const searchForm = document.getElementById("searchform");
const searchResults = document.getElementById("search-results");

const displayWatchlistButton = document.getElementById("displayWatchlist");
const displaySeenlistButton = document.getElementById("displaySeenlist");

displayWatchlistButton.addEventListener("click", handleDisplayWatchlist);
displaySeenlistButton.addEventListener("click", handleDisplaySeenlist);

async function handleDisplayWatchlist() {
  searchResults.innerHTML = "";
  const watchlist = await fetch(
    `${serverURL}/list?list=watch&user=${username}`
  );
  const watchlistData = await watchlist.json();
  console.log(watchlistData.watchlist);

  watchlistData.watchlist.forEach(async (filmID) => {
    const details = await fetch(`${serverURL}/film?filmid=${filmID}`);
    const detailsData = await details.json();
    console.log("detailsData:", detailsData);
    const card = createUserSearchCard(detailsData);
    searchResults.appendChild(card);
  });
}

async function handleDisplaySeenlist() {
  searchResults.innerHTML = "";
  const seenlist = await fetch(`${serverURL}/list?list=seen&user=${username}`);
  const seenlistData = await seenlist.json();
  console.log("Seenlist:", seenlistData.seenlist);

  seenlistData.seenlist.forEach(async (filmID) => {
    const details = await fetch(`${serverURL}/film?filmid=${filmID}`);
    const detailsData = await details.json();
    console.log("detailsData:", detailsData);
    const card = createUserSearchCard(detailsData);
    searchResults.appendChild(card);
  });
}

//function to create delete button

function createDeleteButton(filmID, listType, username) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", async function () {
    await deleteFilm(filmID, listType, username.lowerCase()); //Jon did this please change if it doesnt work
    removeFilm(filmID);
  });
  return deleteButton;
}

async function deleteFilm(filmID, listType, username) {
  await fetch(`${serverURL}/list`, {
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

function createCard(movieObject) {
  const movieContainer = document.createElement("div"); // Card container
  movieContainer.classList.add("movie-container");
  movieContainer.setAttribute("data-film-id", movieObject.id);

  const movieTitle = document.createElement("h2"); //create title element
  movieTitle.innerText = movieObject.title; // add text from title object
  movieTitle.classList.add("lato-bold");
  movieTitle.classList.add("card-title"); // add class to title element

  const movieRdate = document.createElement("h3"); // create release date element
  movieRdate.classList.add("release-date"); // add release-date class
  movieRdate.innerText = "Released: " + movieObject.release_date;

  const moviePoster = document.createElement("img"); // create img element for poster
  moviePoster.src =
    "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + movieObject.poster_path; // add src to img element
  moviePoster.alt = "Movie Poster";
  moviePoster.classList.add("movie-poster"); // add class to img element

  const movieOverview = document.createElement("h3"); // create overview element
  movieOverview.classList.add("lato-regular");
  movieOverview.classList.add("movie-overview");
  movieOverview.innerText = movieObject.overview; // add overview text to element

  const movieGenreIDs = movieObject.genre_ids; // assign genre array for specific movie
  const movieGenresContainer = document.createElement("div"); //create container for genres
  movieGenresContainer.classList.add("genre-container"); //add class
  movieGenreIDs.forEach((genre) => {
    const genreText = document.createElement("h3");
    genreText.classList.add("lato-regular");
    genreText.classList.add("genre-text");
    genreText.innerText = genreMap[genre] + " ";
    movieGenresContainer.appendChild(genreText);
  }); //get genre name from genre map and append each genre to the genre container div

  const movieRatingContainer = document.createElement("div"); //create div to hold rating and label
  movieRatingContainer.classList.add("movie-rating-container");

  const movieRatingLabel = document.createElement("h2"); //create label element
  movieRatingLabel.classList.add("rating-label"); //adds rating-label class to the element
  movieRatingLabel.innerText = "Rating: "; //add text to label
  const movieRatingContent = document.createElement("h3"); //create rating content element

  movieRatingContent.classList.add("rating-content"); //add rating-content class to element
  movieRatingContent.innerText = movieObject.vote_average; //rating from movieObject.

  movieRatingContainer.appendChild(movieRatingLabel); //add label to ratingcontainer
  movieRatingContainer.appendChild(movieRatingContent); // add content to ratingcontainer

  const buttonContainer = document.createElement("div"); //container for buttons
  buttonContainer.classList.add("button-container");

  const addToWatchButton = document.createElement("button"); //create button to add to watch list
  addToWatchButton.classList.add("add-button");
  addToWatchButton.innerText = "Add to watchlist"; //give the button some text
  addToWatchButton.addEventListener("click", () => {
    addToWatch(movieObject.id);
  }); //add event listener to add movie to watch list

  const addToSeenButton = document.createElement("button"); //create button to add to seen list
  addToSeenButton.classList.add("add-button");
  addToSeenButton.innerText = "Add to seen"; //give the button some text
  addToSeenButton.addEventListener("click", () => {
    addToSeen(movieObject.id);
  }); // add even listener to add movie to watch list

  buttonContainer.appendChild(addToWatchButton); //add watchlist button to button container
  buttonContainer.appendChild(addToSeenButton); //add seenlist button to button container
  movieContainer.appendChild(movieTitle);
  movieContainer.appendChild(movieRdate);
  movieContainer.appendChild(moviePoster);
  movieContainer.appendChild(movieOverview);
  movieContainer.appendChild(movieGenresContainer);
  movieContainer.appendChild(movieRatingContainer);
  movieContainer.appendChild(buttonContainer);

  return movieContainer;
}

//Creates cards with addtional delete buttons to remove from a user's lists'.
//TODO: we need a way to put the ID of the movie in the card so we know what movie to remove... I think 0.o
function createUserSearchCard(movieContainer) {
  const currentMovieContainer = createCard(movieContainer);
  const deleteButtonContainer = document.createElement("div");
  deleteButtonContainer.classList.add("button-container");
  const deleteWatchlistButton = document.createElement("button");
  //JON
  deleteWatchlistButton.classList.add("delete-button");
  deleteWatchlistButton.innerText = "Remove from Watchlist";
  // JON
  deleteWatchlistButton.addEventListener("click", function () {
    searchResults.removeChild(currentMovieContainer);
    const filmID = currentMovieContainer.getAttribute("data-film-id");
    deleteFilm(filmID, "watchlist", username);
  });
  // JON
  const deleteSeenlistButton = document.createElement("button");
  deleteSeenlistButton.classList.add("delete-button");
  deleteSeenlistButton.innerText = "Remove from Seenlist";

  deleteSeenlistButton.addEventListener("click", function () {
    searchResults.removeChild(currentMovieContainer);
    const filmID = currentMovieContainer.getAttribute("data-film-id");
    deleteFilm(filmID, "seenlist", username);
  });

  // Marc
  deleteButtonContainer.appendChild(deleteWatchlistButton);
  deleteButtonContainer.appendChild(deleteSeenlistButton);
  currentMovieContainer.appendChild(deleteButtonContainer);

  return currentMovieContainer;
}
//Function implemented by Will
async function addToWatch(filmID) {
  const response = await fetch(`${serverURL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      list: "watch",
      filmID: filmID,
      username: username,
    }),
  });
  notifyUser("Movie added to watch list!");
}
//Function implemented by Will
async function addToSeen(filmID) {
  const response = await fetch(`${serverURL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      list: "seen",
      filmID: filmID,
      username: username,
    }),
  });
  notifyUser("Movie added to seen list!");
}

async function searchTMDB(event) {
  event.preventDefault();
  searchResults.innerHTML = "";
  const searchFormData = new FormData(searchForm);
  const result = Object.fromEntries(searchFormData);
  const query = result.searchinput;
  if (query === "") {
    alert("Please enter a search term");
    return;
  }
  const response = await fetch(`${serverURL}/search?q=${query}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  console.log("Search Data:", data);

  const bannerElement = document.getElementById("bannerImage");
  // const bannerURL = data[0]
  for (const movie of data) {
    if (movie.backdrop_path != null) {
      bannerElement.src =
        "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces" +
        movie.backdrop_path;
      break;
    }
  }

  data.forEach((movie) => {
    const card = createCard(movie);
    searchResults.appendChild(card);
  });
  searchForm.reset();
  return data;
}

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
let fullQuote;
async function startGame() {
  const response = await fetch(`http://${serverURL}/random-quote`);
  const data = await response.json();
  fullQuote = data.quote;

  const words = fullQuote.split(" ");
  const firstWord = words[0];
  const lastWord = words[words.length - 1];

  const prompt = document.getElementById("quote-prompt");
  prompt.textContent = `Clue: ${firstWord} ... ${lastWord}`;

  document.getElementById("feedback").textContent = "";
  document.getElementById("quote-guess").value = "";
}

const quizForm = document.getElementById("quote-user-answer");
quizForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const userGuess = document.getElementById("quote-guess").value;
  // stack overflow regex magic
  const fullQuoteWords = splitIntoWords(
    fullQuote.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
  );
  const userGuessWords = splitIntoWords(
    userGuess.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
  );

  const accuracy = calculateAccuracy(userGuessWords, fullQuoteWords);
  console.log(accuracy);

  const feedback = document.getElementById("feedback");
  if (accuracy >= 80) {
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
searchForm.addEventListener("submit", searchTMDB);

function notifyUser(notification) {
  const notificationContainer = document.getElementById(
    "notification-container"
  );
  const notificationText = document.getElementById("notification-text");
  notificationContainer.classList.add("show");
  notificationContainer.classList.remove("hidden");
  notificationText.innerText = notification;
  setTimeout(() => {
    notificationContainer.classList.remove("show");
    notificationContainer.classList.add("hidden");
    notificationText.innerText = "";
  }, 3000);
}

function setCookie(name) {
  const d = new Date();
  d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = "username=" + name + ";" + expires;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const cookiesArray = document.cookie.split(";");

  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

// window.saveUsername = function () {
//   const username = prompt("Please enter your username:");
//   if (username) {
//     setCookie(username);
//     console.log("Current cookies: " + document.cookie);
//     alert("Username saved: " + username);
//   }
// };

// window.displayUsername = function () {
//   const username = getCookie("username");
//   const displayArea = document.getElementById("displayArea");
//   if (username) {
//     displayArea.innerText = "Saved Username: " + username;
//   } else {
//     displayArea.innerText = "No username found.";
//   }
// };
