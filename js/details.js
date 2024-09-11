const apiKey = 'c430c77d8b25dc96309ce5d466d3c372';

// Obtener parámetros de la URL
function obtenerParametro(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// Cargar detalles de la película
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

        // Actualizar el título del documento con el nombre de la película
        document.title = movieData.title;

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

            // Añadir el evento de clic para redirigir a categories.html
            categoryDiv.addEventListener('click', () => {
                const categoryId = movieData.genres.find(genre => genre.name === category).id;
                window.location.href = `categories.html?id=${encodeURIComponent(categoryId)}&name=${encodeURIComponent(category)}`;
            });

            categoryContainer.appendChild(categoryDiv);
        });

        // Configurar el trailer
        const videosResponse = await fetch(videosUrl);
        const videosData = await videosResponse.json();
        const trailer = videosData.results.find(video => video.type === 'Trailer');
        
        const trailerContainer = document.querySelector('.trailer');
        trailerContainer.innerHTML = ''; // Limpiar contenido anterior

        // Crear y añadir el encabezado para el tráiler
        const trailerHeader = document.createElement('h3');
        trailerHeader.textContent = 'TRAILER'; 
        trailerHeader.classList = 'trailer'
        trailerContainer.appendChild(trailerHeader);
        
        if (trailer) {
            const trailerIframe = document.createElement('iframe');
            trailerIframe.classList = 'trailer';
            trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;
            trailerIframe.width = '560';
            trailerIframe.height = '315';
            trailerIframe.frameBorder = '0';
            trailerIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            trailerIframe.allowFullscreen = true;
            trailerContainer.appendChild(trailerIframe);
        } else {
            // Crear y configurar la imagen de reemplazo
            const noVideoImage = document.createElement('img');
            noVideoImage.src = '/public/videonotfound.png';
            noVideoImage.alt = 'No video available';
            noVideoImage.classList = 'novideo-image';
            trailerContainer.appendChild(noVideoImage);
        }

        // Configurar películas similares
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

// Funcion para volver a la pagina principal (index.html)
document.addEventListener('DOMContentLoaded', () => {
    const returnButton = document.querySelector('#return-btn');
    const returnInfo = document.querySelector('.return-info');
    if (returnButton) {
        returnButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    returnButton.addEventListener('mouseup', () => {
        returnInfo.style.display = 'flex';
    })
});

document.addEventListener('DOMContentLoaded', cargarDetallesPelicula);
