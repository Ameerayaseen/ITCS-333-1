//news.js 
document.addEventListener('DOMContentLoaded', () => {
    // Setup the page layout 
    const body = document.body;
    body.style.background = '#f3f4f6';
    body.style.fontFamily = 'sans-serif';
    body.className = 'text-gray-900';

    const app = document.createElement('main');
    app.className = 'max-w-4xl mx-auto p-6';
    document.body.appendChild(app);

    // Header
    const header = document.createElement('header');
    header.className = 'bg-purple-700 text-white p-6 text-center text-2xl font-bold';
    header.textContent = 'CampusNews';
    document.body.insertBefore(header, app);

    // News Section
    const newsSection = document.createElement('section');
    newsSection.className = 'bg-white p-6 rounded-lg shadow-md';
    const newsTitle = document.createElement('h2');
    newsTitle.className = 'text-xl font-bold text-purple-700';
    newsTitle.textContent = 'Latest News';
    newsSection.appendChild(newsTitle);

    const loading = document.createElement('p');
    loading.textContent = 'Loading...';
    loading.className = 'text-center mt-4';
    newsSection.appendChild(loading);

    const newsContainer = document.createElement('div');
    newsContainer.id = 'news-container';
    newsSection.appendChild(newsContainer);

    const pagination = document.createElement('div');
    pagination.id = 'pagination';
    pagination.className = 'flex justify-center mt-4';
    newsSection.appendChild(pagination);

    // Search Section
    const searchSection = document.createElement('section');
    searchSection.className = 'bg-white p-6 mt-6 rounded-lg shadow-md';
    const searchTitle = document.createElement('h2');
    searchTitle.className = 'text-xl font-bold text-purple-700';
    searchTitle.textContent = 'Search News';
    const searchInput = document.createElement('input');
    searchInput.className = 'border p-2 rounded w-full mt-4';
    searchInput.placeholder = 'Search news...';
    searchInput.type = 'text';
    searchInput.id = 'search-input';
    searchSection.append(searchTitle, searchInput);

    app.append(newsSection, searchSection);

    //Footer
    const footer = document.createElement('footer');
    footer.className = 'bg-gray-900 text-white text-center p-4 mt-8';
    footer.innerHTML = `
        <p>&copy; CampusNews 2025</p>
        <p>Share This Story Choose Your Platform!</p>
    `;
    document.body.appendChild(footer);

    //News Logic
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    let allNews = [];
    let currentPage = 1;
    const itemsPerPage = 5;

    async function fetchNews() {
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error('Failed to fetch news');
            allNews = await res.json();
            renderNews();
            renderPagination();
        } catch (error) {
            newsContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        } finally {
            loading.style.display = 'none';
        }
    }

    function renderNews() {
        const searchQuery = searchInput.value.toLowerCase();
        const filtered = allNews.filter(n =>
            n.title.toLowerCase().includes(searchQuery) || n.body.toLowerCase().includes(searchQuery)
        );

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const current = filtered.slice(start, end);

        newsContainer.innerHTML = '';
        current.forEach(news => {
            const article = document.createElement('article');
            article.className = 'border p-4 rounded-lg shadow-md mb-4';

            const title = document.createElement('h3');
            title.className = 'text-lg font-semibold';
            title.textContent = news.title;

            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.innerHTML = '<b>Read more</b>';
            const content = document.createElement('p');
            content.textContent = news.body;

            details.append(summary, content);
            article.append(title, details);
            newsContainer.appendChild(article);
        });
    }

    function renderPagination() {
        pagination.innerHTML = '';
        const totalItems = allNews.filter(n =>
            n.title.toLowerCase().includes(searchInput.value.toLowerCase())
        ).length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `px-4 py-2 mx-1 rounded ${i === currentPage ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border'}`;
            btn.onclick = () => {
                currentPage = i;
                renderNews();
                renderPagination();
            };
            pagination.appendChild(btn);
        }
    }

    // Search input validation
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderNews();
        renderPagination();
    });

    fetchNews();
});
