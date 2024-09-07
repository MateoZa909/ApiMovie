async function searchMovies(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=${query}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.results; // Devolver el arreglo de películas
    } catch (error) {
        console.error('Error al buscar la película:', error);
        return [];
    }
}

async function loadMovieSuggestions() {
    const input = document.querySelector('.search-input');
    const suggestionsBox = document.createElement('div');
    suggestionsBox.classList.add('suggestions-box');
    document.querySelector('.search-img').appendChild(suggestionsBox);

    input.addEventListener('input', async function() {
        const query = input.value.trim();

        // Ocultar el recuadro de sugerencias si el input está vacío
        if (query.length === 0) {
            suggestionsBox.innerHTML = '';  // Limpiar sugerencias si no hay texto
            suggestionsBox.style.display = 'none';
            return; // Termina la función si no hay texto
        }

        const movies = await searchMovies(query);

        // Limpiar el contenido anterior de las sugerencias
        suggestionsBox.innerHTML = '';

        // Mostrar solo los primeros 5 resultados
        movies.slice(0, 5).forEach(movie => {
            const suggestion = document.createElement('div');
            suggestion.textContent = movie.title;
            suggestion.classList.add('suggestion-item');

            // Manejo del click en cada sugerencia
            suggestion.addEventListener('click', () => {
                window.location.href = `details.html?id=${movie.id}`;
            });

            suggestionsBox.appendChild(suggestion);
        });

        // Mostrar u ocultar el recuadro dependiendo de si hay resultados
        suggestionsBox.style.display = movies.length ? 'block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', loadMovieSuggestions);
