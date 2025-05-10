const reviewList = document.querySelector('.review-list');
const detailsSection = document.getElementById('details');
const form = document.querySelector('form');
const titleInput = document.getElementById('course-title');
const reviewInput = document.getElementById('course-review');
const searchInput = document.querySelector('input[type="text"]');
const searchButton = document.getElementById('search-button');

let reviews = [];

function showLoading() {
    reviewList.innerHTML = '<p class="text-center">Loading reviews...</p>';
}

function showError() {
    reviewList.innerHTML = '<p class="text-center text-red-600">Failed to load reviews. Please try again later.</p>';
}

function renderReviews(data) {
    reviewList.innerHTML = '';
    if (data.length === 0) {
        reviewList.innerHTML = '<p class="text-center">No reviews found.</p>';
        return;
    }
    data.forEach((review, index) => {
        const article = document.createElement('article');
        article.className = 'border p-4 rounded-lg shadow-md';
        article.innerHTML = `
            <h3 class="text-lg font-semibold">Course Review</h3>
            <p><strong>Course Title:</strong> ${review.title}</p>
            <p><strong>Review:</strong> ${review.text}</p>
            <a href="#details" class="text-purple-700 hover:underline" data-index="${index}">View Details</a>
        `;
        reviewList.appendChild(article);
    });
}

function fetchReviews() {
    showLoading();
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
        .then(response => response.json())
        .then(data => {
            reviews = data.map(item => ({ title: item.title, text: item.body }));
            renderReviews(reviews);
        })
        .catch(() => showError());
}

function validateForm() {
    return titleInput.value.trim() !== '' && reviewInput.value.trim() !== '';
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateForm()) {
        const newReview = {
            title: titleInput.value,
            text: reviewInput.value
        };
        reviews.unshift(newReview);
        renderReviews(reviews);
        form.reset();
    }
});

reviewList.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && e.target.dataset.index) {
        const review = reviews[e.target.dataset.index];
        detailsSection.innerHTML = `
            <h2 class="text-xl font-bold text-purple-700">Review Details</h2>
            <p><strong>Course Title:</strong> ${review.title}</p>
            <p><strong>Review:</strong> ${review.text}</p>
            <div class="mt-4 flex space-x-4">
                <button class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400">Edit</button>
                <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">Delete</button>
            </div>
            <a href="#reviews" class="block text-center text-purple-700 mt-4 hover:underline">Back to Reviews</a>
        `;
    }
});

searchButton.addEventListener('click', function () {
    const keyword = searchInput.value.toLowerCase();
    const filtered = reviews.filter(r => r.title.toLowerCase().includes(keyword) || r.text.toLowerCase().includes(keyword));
    renderReviews(filtered);
});

fetchReviews();
