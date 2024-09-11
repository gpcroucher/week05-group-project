// Jon did this =)
let username = "";
window.onload = function () {
  if (username != "") {
    document.getElementById("usernamePrompt").innerText =
      "Welcome, " + username + "!";
  } else {
    username = prompt("Please enter your username:");
  }
};

const serverURL = "Http://localhost";
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
  9648: "Mystery",
  53: "Thriller",
  10752: "War",
  9648: "Western",
};
const searchForm = document.getElementById("searchform");
const searchResults = document.getElementById("search-results");

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

function createCard(movieObject) {
  const movieContainer = document.createElement("div"); // Card container
  const movieTitle = document.createElement("h2"); //create title element
  movieTitle.innerText = movieObject.title; // add text from title object
  movieTitle.classList.add("card-title"); // add class to title element
  const movieRdate = document.createElement("h3"); // create release date element
  movieRdate.classList.add("release-date"); // add release-date class
  movieRdate.innerText = movieObject.release_date;
  const moviePoster = document.createElement("img"); // create img element for poster
  moviePoster.src =
    "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + movieObject.poster_path; // add src to img element
  moviePoster.classList.add("movie-poster"); // add class to img element
  const movieOverview = document.createElement("h3"); // create overview element
  movieOverview.innerText = movieObject.overview; // add overview text to element
  //TODO: swap genre for genre IDs to display genre on page
  const movieGenreIDs = movieObject.genre_ids; // assign genre array for specific movie
  const movieGenresContainer = document.createElement("div"); //create container for genres
  movieGenresContainer.classList.add("genre-container"); //add class
  movieGenreIDs.forEach((genre) => {
    const genreText = document.createElement("h3");
    genreText.classList.add("genre-text");
    genreText.innerText = genreMap[genre] + " ";
    movieGenresContainer.appendChild(genreText);
  }); //get genre name from genre map and append each genre to the genre container div
  const movieRatingContainer = document.createElement("div"); //create div to hold rating and label
  const movieRatingLabel = document.createElement("h2"); //create label element
  movieRatingLabel.classList.add("rating-label"); //adds rating-label class to the element
  movieRatingLabel.innerText = "Rating: "; //add text to label
  const movieRatingContent = document.createElement("h3"); //create rating content element
  movieRatingContent.classList.add("rating-content"); //add rating-content class to element
  movieRatingContent.innerText = movieObject.vote_average; //rating from movieObject.
  movieRatingContainer.appendChild(movieRatingLabel); //add label to ratingcontainer
  movieRatingContainer.appendChild(movieRatingContent); // add content to ratingcontainer

  const buttonContainer = document.createElement("div"); //container for buttons

  const addToWatchButton = document.createElement("button"); //create button to add to watch list
  addToWatchButton.innerText = "Add to watchlist"; //give the button some text
  addToWatchButton.addEventListener("click", () => {
    addToWatch(movieObject.id);
  }); //add event listener to add movie to watch list

  const addToSeenButton = document.createElement("button"); //create button to add to seen list
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
//Function implemented by Will
async function addToWatch(filmID) {
  const response = await fetch(`http://localhost:8080/add`, {
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
  const response = await fetch(`http://localhost:8080/add`, {
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
  const response = await fetch(`http://localhost:8080/search?q=${query}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  console.log(data);
  data.forEach((movie) => {
    const card = createCard(movie);
    searchResults.appendChild(card);
  });
  // TODO: write displaySearchResults() function [cards]
  // displaySearchResults(data);
  searchForm.reset();
  return data;
}

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

searchForm.addEventListener("submit", searchTMDB);
