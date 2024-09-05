const apiKey = 'c430c77d8b25dc96309ce5d466d3c372'
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

// Peliculas en tendencia
async function loadTrendingMovies() {
    try {
        const response = await fetch(trendingUrl, options);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const movies = data.results; // Ajusta según la estructura de tu respuesta
        
        const carouselInner = document.querySelector('.carousel-inner');
        const carouselIndicators = document.querySelector('.carousel-indicators');
        
        // Limpiar el contenido del carrusel antes de agregar nuevas películas
        carouselInner.innerHTML = '';
        carouselIndicators.innerHTML = '';

        movies.forEach((movie, index) => {
            // Crear indicadores
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#carouselExampleCaptions');
            indicator.setAttribute('data-bs-slide-to', index);
            if (index === 0) indicator.classList.add('active');
            indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            carouselIndicators.appendChild(indicator);

            // Crear item del carrusel
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`; // Ajusta según el tamaño de la imagen
            img.className = 'd-block w-100';
            img.id = 'images'
            img.alt = movie.title;

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
    } catch (error) {
        console.error('Error al cargar las películas en tendencia:', error);
    }
}

// Peliculas más vistas
async function loadTopMovies() {
    try {
        const response = await fetch(popularMoviesUrl);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const movies = data.results.slice(0, 10); // Obtener las primeras 10 películas más vistas
        const container = document.querySelector('.tenmovies');
        
        // Limpiar el contenido antes de agregar nuevas películas
        container.innerHTML = '';

        movies.forEach((movie, index) => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('back');

            const title = document.createElement('h1');
            title.textContent = index + 1; // Número de la película
            movieDiv.appendChild(title);

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            img.alt = movie.title;
            movieDiv.appendChild(img);

            container.appendChild(movieDiv);
        });
    } catch (error) {
        console.error('Error al cargar las películas más vistas:', error);
    }
}


document.addEventListener('DOMContentLoaded', loadCategories);
document.addEventListener('DOMContentLoaded', loadTopMovies);
document.addEventListener('DOMContentLoaded', loadTrendingMovies);
