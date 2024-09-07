const apiKey = 'c430c77d8b25dc96309ce5d466d3c372';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
    }
};

// Obtener parámetros de la URL
function obtenerParametro(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// Cargar detalles de la película
// Función para cargar detalles de la película
async function cargarDetallesPelicula() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        console.error('ID de película no proporcionado');
        return;
    }

    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`;
    const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=es-ES`;
    const similarMoviesUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=es-ES&page=1`;

    try {
        const movieResponse = await fetch(movieUrl);
        const movieData = await movieResponse.json();

        // Configurar la información de la película
        document.querySelector('.info-movie img').src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
        document.querySelector('.info-synopsis span').textContent = movieData.overview;
        
        // Configurar las categorías
        const categories = movieData.genres.map(genre => genre.name);
        const categoryContainer = document.querySelector('.info-category');
        categoryContainer.innerHTML = ''; // Limpiar contenido anterior

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'back-category';
            categoryDiv.textContent = category;
            categoryContainer.appendChild(categoryDiv);
        });

        // Configurar el trailer
        const videosResponse = await fetch(videosUrl);
        const videosData = await videosResponse.json();
        const trailer = videosData.results.find(video => video.type === 'Trailer');
        
        if (trailer) {
            const trailerIframe = document.createElement('iframe');
            trailerIframe.className = 'trailer'
            trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;
            trailerIframe.width = '560';
            trailerIframe.height = '315';
            trailerIframe.frameBorder = '0';
            trailerIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            trailerIframe.allowFullscreen = true;

            document.querySelector('.trailer').appendChild(trailerIframe);
        } else {
            document.querySelector('.trailer').textContent = 'No hay trailer disponible.';
        }

        // // Configurar películas similares
        // const similarMoviesResponse = await fetch(similarMoviesUrl);
        // const similarMoviesData = await similarMoviesResponse.json();
        // const relatedMoviesContainer = document.querySelector('.related-movies');
        // relatedMoviesContainer.innerHTML = '';

        // similarMoviesData.results.forEach(movie => {
        //     const relatedMovieDiv = document.createElement('div');
        //     relatedMovieDiv.className = 'related-movie';

        //     const img = document.createElement('img');
        //     img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        //     img.alt = movie.title;
        //     relatedMovieDiv.appendChild(img);

        //     const title = document.createElement('h4');
        //     title.textContent = movie.title;
        //     relatedMovieDiv.appendChild(title);

        //     relatedMoviesContainer.appendChild(relatedMovieDiv);
        // });

    } catch (error) {
        console.error('Error al cargar los detalles de la película:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const returnButton = document.querySelector('#return-btn');
    if (returnButton) {
        returnButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', cargarDetallesPelicula);
