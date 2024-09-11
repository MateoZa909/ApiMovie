async function searchMovies(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=${query}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Películas encontradas:', data.results); // Log de películas
        return data.results; // Devolver el arreglo de películas
    } catch (error) {
        console.error('Error al buscar la película:', error);
        return [];
    }
}

async function searchSeries(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=es-ES&query=${query}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Series encontradas:', data.results); // Log de series
        return data.results; // Devolver el arreglo de series
    } catch (error) {
        console.error('Error al buscar la serie:', error);
        return [];
    }
}

async function searchPeople(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${apiKey}&language=es-ES&query=${query}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Personas encontradas:', data.results); // Log de personas
        return data.results; // Devolver el arreglo de personas (actores/directores)
    } catch (error) {
        console.error('Error al buscar la persona:', error);
        return [];
    }
}

async function loadMovieSuggestions() {
    const input = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.icon-search');
    const closeIcon = document.querySelector('.icon-close');
    const suggestionsBox = document.createElement('div');
    suggestionsBox.classList.add('suggestions-box');
    document.querySelector('.search-img').appendChild(suggestionsBox);

    input.addEventListener('input', async function() {
        const query = input.value.trim();

        // Mostrar y ocultar iconos según el texto
        if (query.length > 0) {
            searchIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        } else {
            searchIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }

        if (query.length === 0) {
            suggestionsBox.innerHTML = ''; // Limpiar sugerencias si no hay texto
            suggestionsBox.style.display = 'none';
            return; // Termina la función si no hay texto
        }

        // Buscar películas, series y personas en paralelo
        const [movies, series, people] = await Promise.all([
            searchMovies(query),
            searchSeries(query),
            searchPeople(query)
        ]);

        console.log('Resultados combinados:', { movies, series, people }); // Log de todos los resultados

        // Limpiar el contenido anterior de las sugerencias
        suggestionsBox.innerHTML = '';

        // Mostrar resultados de películas
        if (movies.length) {
            const movieTitle = document.createElement('h4');
            movieTitle.textContent = 'Películas';
            movieTitle.classList = 'pelicula';
            suggestionsBox.appendChild(movieTitle);

            movies.slice(0, 5).forEach(movie => {
                const suggestion = document.createElement('div');
                suggestion.textContent = movie.title;
                suggestion.classList.add('suggestion-item');

                suggestion.addEventListener('click', () => {
                    window.location.href = `details.html?id=${movie.id}`;
                });

                suggestionsBox.appendChild(suggestion);
            });
        }

        // Mostrar resultados de series
        if (series.length) {
            const seriesTitle = document.createElement('h4');
            seriesTitle.textContent = 'Series';
            seriesTitle.classList = 'series';
            suggestionsBox.appendChild(seriesTitle);

            series.slice(0, 5).forEach(serie => {
                const suggestion = document.createElement('div');
                suggestion.textContent = serie.name;
                suggestion.classList.add('suggestion-item');

                suggestion.addEventListener('click', () => {
                    window.location.href = `series-details.html?id=${serie.id}`;
                });

                suggestionsBox.appendChild(suggestion);
            });
        }

        // Mostrar resultados de personas (actores/directores)
        if (people.length) {
            const peopleTitle = document.createElement('h4');
            peopleTitle.textContent = 'Personas';
            peopleTitle.classList = 'personas';
            suggestionsBox.appendChild(peopleTitle);

            people.slice(0, 5).forEach(person => {
                const suggestion = document.createElement('div');
                suggestion.textContent = person.name;
                suggestion.classList.add('suggestion-item');

                suggestion.addEventListener('click', () => {
                    window.location.href = `person-details.html?id=${person.id}`;
                });

                suggestionsBox.appendChild(suggestion);
            });
        }

        // Mostrar u ocultar el recuadro dependiendo de si hay resultados
        suggestionsBox.style.display = (movies.length || series.length || people.length) ? 'block' : 'none';
    });

    // Al hacer clic en el ícono de cerrar, limpiar la entrada y restaurar el ícono de búsqueda
    closeIcon.addEventListener('click', function() {
        input.value = '';
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = 'none';
        searchIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', loadMovieSuggestions);

