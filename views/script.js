fetch("http://localhost:1234/movies")
  .then((res) => res.json())
  .then((res) => {
    const htmlMovies = res
      .map((movie) => {
        return `
        <div class="movie" data-id="${movie.id}">
          <img src="${movie.poster}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <button class="delete-btn">eliminar</button>
        </div>
      `;
      })
      .join("");

    document.querySelector(".container").innerHTML = htmlMovies;

    actionDeleteBtns()

  });

const actionDeleteBtns = () => {
  // cada btn al hacerle click, obtener su atributo data-id
  const deleteBtns = document.querySelectorAll(".delete-btn")

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.parentElement.getAttribute("data-id");
      fetch(`http://localhost:1234/movies/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          e.target.parentElement.remove();
        });
    });
  });
};
