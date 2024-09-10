const serverURL = "Http://localhost";

function createDeleteButton(filmID, listType, username) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", async function () {
    await deleteFilm(filmID, listType, username);
    removeFilm(FilmID);
  });
  return deleteButton;
}

async function deleteFilm(filmID, listType, username) {
  await fetch(`http://localhost:8080/list`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: json.stringify({
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
