const apiKey = 'c430c77d8b25dc96309ce5d466d3c372'
const categoriesUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`; // Categorias
const trendingUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`; // Peliculas en tendencia

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
        
        // Suponiendo que la respuesta contiene un campo 'genres'
        const categories = data.genres; // Ajusta según la estructura de tu respuesta
        
        const dropdownContent = document.getElementById('category-dropdown-content');
        dropdownContent.innerHTML = ''; // Limpiar el contenido antes de agregar nuevas categorías

        categories.forEach(category => {
            const link = document.createElement('a');
            link.href = '#'; // Ajusta el enlace si es necesario
            link.textContent = category.name; // Ajusta según la estructura de tu objeto de categoría
            dropdownContent.appendChild(link);
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
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

document.addEventListener('DOMContentLoaded', loadCategories);
document.addEventListener('DOMContentLoaded', loadTrendingMovies);
