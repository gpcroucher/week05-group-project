//function to create delete button
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
//not done this yet, but this is assuming we will render it
function renderFilm(film, listType, username) {
  const filmElement = document.createElement("div");
  filmElement.id = `film-${film.id}`;
  filmElement.textContent = film.title;

  const deleteButton = createDeleteButton(film.id, listType, username);
  filmElement.appendChild(deleteButton);

  document.getElementById("filmList").appendChild(filmElement);
}
