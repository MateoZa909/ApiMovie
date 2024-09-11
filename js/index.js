const apiKey = 'c430c77d8b25dc96309ce5d466d3c372';
const categoriesUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`; // Categorias
const trendingUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`; // Peliculas en tendencia
const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`; // Peliculas populares

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
    }
};

// Redirigir a la página de detalles
function redirigirADetallesPelicula(movieId) {
    window.location.href = `details.html?id=${movieId}`;
}

// Categorias
async function loadCategories() {
    try {
        const response = await fetch(categoriesUrl, options);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const categories = data.genres; 
        
        const wrapper = document.getElementById('categories-wrapper');
        wrapper.innerHTML = ''; // Limpiar el contenido antes de agregar nuevas categorías

        categories.forEach(category => {
            const div = document.createElement('div');
            div.className = 'category';
        
            // Crear un elemento span para el texto
            const span = document.createElement('span');
            span.className = 'category-text';  // Asignar una clase específica al texto
            span.textContent = category.name;
        
            // Agregar el span dentro del div
            div.appendChild(span);

            // Añadir el evento de clic para redirigir a categories.html con el ID y nombre de la categoría
            div.addEventListener('click', () => {
                window.location.href = `categories.html?id=${encodeURIComponent(category.id)}&name=${encodeURIComponent(category.name)}`;
            });
        
            // Añadir el div al contenedor
            wrapper.appendChild(div);
        });

        // Iniciar el carrusel
        startCarousel();
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

// Funcion de carrusel
function startCarousel() {
    const wrapper = document.querySelector('.categories-wrapper');
    const items = document.querySelectorAll('.category');
    const itemWidth = items[0].offsetWidth + 10; // Incluye el margen
    const totalWidth = itemWidth * items.length;

    let scrollAmount = 0;

    function scroll() {
        scrollAmount += itemWidth;
        if (scrollAmount >= totalWidth) {
            scrollAmount = 0;
        }
        wrapper.style.transform = `translateX(-${scrollAmount}px)`;
    }

    function scrollLeft() {
        scrollAmount -= itemWidth;
        if (scrollAmount < 0) {
            scrollAmount = totalWidth - itemWidth;
        }
        wrapper.style.transform = `translateX(-${scrollAmount}px)`;
    }

    function scrollRight() {
        scrollAmount += itemWidth;
        if (scrollAmount >= totalWidth) {
            scrollAmount = 0;
        }
        wrapper.style.transform = `translateX(-${scrollAmount}px)`;
    }

    // Set interval for auto-scrolling
    const interval = setInterval(scrollRight, 3000); // Ajusta el intervalo según sea necesario

    // Clear the interval when user interacts with buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
        clearInterval(interval);
        scrollLeft();
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        clearInterval(interval);
        scrollRight();
    });
}

// Películas en tendencia
async function loadTrendingMovies() {
    try {
        const response = await fetch(trendingUrl, options);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const movies = data.results; 
        const carouselInner = document.querySelector('.carousel-inner');
        const carouselIndicators = document.querySelector('.carousel-indicators');

        if (carouselInner && carouselIndicators) {
            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';

            movies.forEach((movie, index) => {
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#carouselExampleCaptions');
                indicator.setAttribute('data-bs-slide-to', index);
                if (index === 0) indicator.classList.add('active');
                indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                carouselIndicators.appendChild(indicator);

                const carouselItem = document.createElement('div');
                carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                img.className = 'd-block w-100';
                img.alt = movie.title;

                // Agregar evento de clic en la imagen
                img.addEventListener('click', () => {
                    redirigirADetallesPelicula(movie.id);
                });

                const caption = document.createElement('div');
                caption.className = 'carousel-caption d-none d-md-block';
                
                const title = document.createElement('h5');
                title.textContent = movie.title;
                caption.appendChild(title);

                const description = document.createElement('p');
                description.textContent = movie.overview;
                caption.appendChild(description);

                carouselItem.appendChild(img);
                carouselItem.appendChild(caption);
                carouselInner.appendChild(carouselItem);
            });
        } else {
            console.error('Elementos del carrusel no encontrados');
        }
    } catch (error) {
        console.error('Error al cargar las películas en tendencia:', error);
    }
}

// Películas más vistas
async function loadTopMovies() {
    try {
        const response = await fetch(popularMoviesUrl);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const movies = data.results.slice(0, 10);
        const container = document.querySelector('.tenmovies');

        if (container) {
            container.innerHTML = '';

            movies.forEach((movie, index) => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('back');

                const title = document.createElement('h1');
                title.textContent = index + 1;
                movieDiv.appendChild(title);

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                img.alt = movie.title;

                // Agregar evento de clic en la imagen
                img.addEventListener('click', () => {
                    redirigirADetallesPelicula(movie.id);
                });

                movieDiv.appendChild(img);
                container.appendChild(movieDiv);
            });
        } else {
            console.error('Elemento con clase "tenmovies" no encontrado');
        }
    } catch (error) {
        console.error('Error al cargar las películas más vistas:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadTrendingMovies();
    loadTopMovies();

    // Manejar la redirección al hacer clic en el botón de regreso
    const returnBtn = document.getElementById('return-btn');
    if (returnBtn) {
        returnBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});
