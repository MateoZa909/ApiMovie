// Carga de películas y series
async function loadCategoryContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    const categoryName = urlParams.get('name');

    if (!categoryId || !categoryName) {
        console.error('No se proporcionó el ID o nombre de la categoría.');
        return;
    }

    // Actualizar el título con el nombre de la categoría
    document.title = `Películas y Series - ${categoryName}`; // Cambiar title 
    document.querySelector('.back-title-category h1').textContent = categoryName;

    try {
        // URLs para obtener películas y series por categoría
        const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&with_genres=${categoryId}`;
        const seriesUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=es-ES&with_genres=${categoryId}`;

        // Obtener películas y series en paralelo
        const [moviesResponse, seriesResponse] = await Promise.all([
            fetch(moviesUrl),
            fetch(seriesUrl)
        ]);

        if (!moviesResponse.ok || !seriesResponse.ok) {
            throw new Error(`Error HTTP: ${moviesResponse.status} ${seriesResponse.status}`);
        }

        const moviesData = await moviesResponse.json();
        const seriesData = await seriesResponse.json();
        const movies = moviesData.results;
        const series = seriesData.results;

        const gridContent = document.querySelector('.grid-content');
        gridContent.innerHTML = ''; // Limpiar contenido anterior

        // Mostrar películas
        if (movies.length) {
            const moviesTitle = document.createElement('h2');
            moviesTitle.textContent = 'Películas';
            moviesTitle.classList.add('color-change');
            gridContent.appendChild(moviesTitle);

            movies.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'card';

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                img.classList = 'image-movie-serie'
                img.alt = movie.title;

                const span = document.createElement('span');
                span.textContent = movie.title;
                span.classList.add('name-ms');

                card.appendChild(img);
                card.appendChild(span);
                
                // Añadir evento de clic para redirigir a details.html
                card.addEventListener('click', () => {
                    window.location.href = `details.html?id=${movie.id}`; // Redirigir con el ID de la película
                });

                gridContent.appendChild(card);
            });
        }

        // Mostrar series
        if (series.length) {
            const seriesTitle = document.createElement('h2');
            seriesTitle.textContent = 'Series';
            seriesTitle.classList.add('color-change');
            gridContent.appendChild(seriesTitle);

            series.forEach(serie => {
                const card = document.createElement('div');
                card.className = 'card';

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w500${serie.poster_path}`;
                img.alt = serie.name;

                const span = document.createElement('span');
                span.textContent = serie.name;

                card.appendChild(img);
                card.appendChild(span);
                
                // Añadir evento de clic para redirigir a details.html
                card.addEventListener('click', () => {
                    window.location.href = `details.html?id=${serie.id}`; // Redirigir con el ID de la serie
                });

                gridContent.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error al cargar los elementos de la categoría:', error);
    }
}

// Volver a la página principal
document.addEventListener('DOMContentLoaded', () => {
    const returnButton = document.querySelector('#return-btn');
    if (returnButton) {
        returnButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', loadCategoryContent);
