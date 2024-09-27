const cardWrapper = document.querySelector('.content-cards');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');

// массив фильмов
const films = [
    {
        id: 0,
        title: 'Маленький Будда',
        year: '1993',
        genre: 'Драма',
        rating: 7.2,
        link: '/film.html',
        img: {
            avif: '../images/buddha.avif',
            webp: '../images/buddha.webp',
            jpg: '../images/buddha.jpg'
        }
    },
    {
        id: 1,
        title: 'Клетка',
        year: '2000',
        genre: ['Ужасы', 'Фантастик', 'Триллер'],
        rating: 7.1,
        link: '',
        img: {
            avif: '../images/cell.avif',
            webp: '../images/cell.webp',
            jpg: '../images/cell.jpg'
        }
    },
    {
        id: 2,
        title: 'Кошмар на улице Вязов',
        year: '1984',
        genre: 'Ужасы',
        rating: 7.7,
        link: '',
        img: {
            avif: '../images/freddy.avif',
            webp: '../images/freddy.webp',
            jpg: '../images/freddy.jpg'
        }
    },
    {
        id: 3,
        title: 'Каратэ-пацан',
        year: '2010',
        genre: ['Драма', 'Спорт', 'Семейный'],
        rating: 7.1,
        link: '',
        img: {
            avif: '../images/karate_kid.avif',
            webp: '../images/karate_kid.webp',
            jpg: '../images/karate_kid.jpg'
        }
    },
    {
        id: 4,
        title: 'Морской монстр',
        year: '2022',
        genre: ['Мультфильм', 'Фэнтези', 'Семейный'],
        rating: 7.1,
        link: '',
        img: {
            avif: '../images/sea_beast.avif',
            webp: '../images/sea_beast.webp',
            jpg: '../images/sea_beast.jpg'
        }
    },
    {
        id: 5,
        title: 'Человек-паук: Нет пути домой',
        year: '2021',
        genre: ['Фантастика', 'Боевик', 'Приключения'],
        rating: 7.9,
        link: '',
        img: {
            avif: '../images/spiderman.avif',
            webp: '../images/spiderman.webp',
            jpg: '../images/spiderman.jpg'
        }
    },
];

// первое слово из категории "Жанр" с заглавной буквы
const capitalizeFirstWord = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Настройки для Fuse.js
const fuseOptions = {
    keys: ['title', 'year', 'genre', 'rating'],
    threshold: 0.4, // Чувствительность поиска
};
const fuse = new Fuse(films, fuseOptions);

// функция для рендера карточек
const renderFilm = (array) => {
    cardWrapper.innerHTML = '';

    if (array.length === 0) {
        cardWrapper.innerHTML = '<p>К сожалению, ничего не найдено :(</p>';
        return;
    }


    array.forEach((item) => {
        // если жанры в виде массива, объединяем их через запятую
        const genres = Array.isArray(item.genre)
            ? item.genre.map((genre, index) => index === 0 ? capitalizeFirstWord(genre) : genre.toLowerCase()).join(', ')
            // если жанр один
            : capitalizeFirstWord(item.genre);

        cardWrapper.insertAdjacentHTML('beforeend', `
            <a class="content-cards__item" href="${item.link}">
                <div class="content-cards__item--image">
                    <picture>
                        <source srcset="${item.img.avif}" type="image/avif">
                        <source srcset="${item.img.webp}" type="image/webp">
                        <img src="${item.img.jpg}" alt="Постер к фильму ${item.title}" loading="lazy">
                    </picture>
                </div>
                
                <div class="content-cards__item--text">
                    <h3 class="content-cards__item--title">${item.title}</h3>
                    <span class="content-cards__item--year">${item.year}</span>
                    <p class="content-cards__item--genre">${genres}</p>
                    <p class="content-cards__item--rating">${item.rating}</p>
                </div>
            </a>
            `)
    });
}

// Дебаунсинг для оптимизации поиска
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

// Функция поиска фильмов с использованием Fuse.js
const searchFilms = debounce(() => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        renderFilm(films); // Если поиск пустой, рендерим весь каталог
        return;
    }

    const results = fuse.search(query).map(result => result.item);
    renderFilm(results);
}, 300); // Задержка 300 мс

// Поиск при вводе текста в поле
searchInput.addEventListener('input', searchFilms);

// Поиск по нажатию на кнопку
searchBtn.addEventListener('click', searchFilms);

// Поиск по нажатию на Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchFilms();
    }
});

// Изначальный рендер всех фильмов
renderFilm(films);