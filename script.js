//  `http://www.omdbapi.com/?i=tt3896198&apikey=c1ca85f5&s=${movie.title}`

// global tags

const API_KEY = "c1ca85f5";
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const moviesGrid = document.querySelector("#moviesGrid");
const resultsInfo = document.getElementById("resultsInfo");
const sortSelect = document.getElementById("sortSelect");

let currentMovies = [];

// listens to form submit and saves the result as fetchMovies(searchTerm)

searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const searchTerm = searchInput.value.trim();
	if (searchTerm) {
		console.log(fetchMovies(searchTerm));
	}
});

// Show skeleton loading cards
function showSkeletons() {
	const skeletons = Array(10)
		.fill(0)
		.map(
			() => `
  <div class="movie-card movie-card--skeleton" >
    <div class="movie-card__img movie-card__img--skeleton"></div>
    <div class="movie-card__title movie-card__title--skeleton"></div>
    <div class="movie-card__year movie-card__year--skeleton"></div>
  </div>
  `,
		)
		.join("");

	moviesGrid.innerHTML = skeletons;
}

// creates a funtion that fetches movies from an api

async function fetchMovies(searchTerm) {
	showSkeletons();

	const res = await fetch(
		`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`,
	);
	const data = await res.json();

	setTimeout(() => {
		if (searchTerm === undefined) {
			resultsInfo.textContent = `Please Enter The Movie You Are Looking For Into The Search Bar`;
			currentMovies = [];
			displayMovies(currentMovies);
		} else if (data.Response === "True") {
			currentMovies = data.Search;
			resultsInfo.textContent = `Showing: ${searchTerm}`;
			sortSelect.value = "default";
			displayMovies(currentMovies);
		} else {
			resultsInfo.textContent = `Showing: ${searchTerm}`;
			moviesGrid.innerHTML = "<p> No movies found.</p>";
			currentMovies = [];
		}
	}, 2000);
}
console.log(fetchMovies());
//creates a function that displays the movies in the order that filterSelect determines

function displayMovies(movies) {
	const movieResults = movies
		.map((movie) => {
			const poster = movie.Poster !== "N/A" ? movie.Poster : "";

			return `
    <div class="movie-card">
      ${poster ? `<img class="movie-card__img" src="${poster}" alt="${movie.Title}">` : `<div class=movie-card__poster-placeholder>`}
      <h2 class="movie-card__title">${movie.Title}.</h2>
      <p class="movie-card__year">${movie.Year}</p>
    </div>
    `;
		})
		.join("");

	moviesGrid.innerHTML = movieResults;

	// add error listeners after DOM insertation
	moviesGrid.querySelectorAll(".movie-card__img").forEach((img) => {
		img.addEventListener("error", () => {
			const placeholder = document.createElement("div");
			placeholder.className = "movie-card__poster-placeholder";
			placeholder.innerHTML = "Movie Poster<br>Not Avalable";
			img.replaceWith(placeholder);
		});
	});
}

// creates a function that sortes the movies by the inputed search filter

sortSelect.addEventListener("change", (e) => {
	sortMovies(e.target.value);
});

function sortMovies(sortType) {
	let sortedMovies = [...currentMovies];

	if (sortType === "a-z") {
		sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
	} else if (sortType === "z-a") {
		sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
	} else if (sortType === "newest") {
		sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
	} else if (sortType === "oldest") {
		sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
	}

	displayMovies(sortedMovies);
}
