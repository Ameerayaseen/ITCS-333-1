// marketplace.js

// Elements
const itemListContainer = document.querySelector('.item-list');
const searchInput = document.querySelector('input[placeholder="Search items..."]');
const searchButton = document.querySelector('button');
const postItemForm = document.getElementById('post-item-form');

// State
let allItems = [];
let filteredItems = [];
let currentPage = 1;
const itemsPerPage = 3;

// Fetch Data
async function fetchMarketplaceItems() {
    showLoading();
    try {
        const response = await fetch('https://64b64dfb0efb99d86269139c.mockapi.io/marketplace/items'); // مثال: من MockAPI
        if (!response.ok) throw new Error('Failed to fetch items');
        allItems = await response.json();
        filteredItems = allItems;
        renderItems();
    } catch (error) {
        showError('Error loading items. Please try again later.');
        console.error(error);
    } finally {
        hideLoading();
    }
}

// Show Loading
function showLoading() {
    itemListContainer.innerHTML = '<p class="text-center text-purple-700 font-semibold">Loading...</p>';
}

// Hide Loading
function hideLoading() {
    itemListContainer.innerHTML = '';
}

// Show Error
function showError(message) {
    itemListContainer.innerHTML = `<p class="text-center text-red-600 font-semibold">${message}</p>`;
}

// Render Items with Pagination
function renderItems() {
    hideLoading();
    itemListContainer.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(start, start + itemsPerPage);

    if (paginatedItems.length === 0) {
        itemListContainer.innerHTML = '<p class="text-center text-purple-700">No items found.</p>';
        return;
    }

    paginatedItems.forEach(item => {
        const itemElement = document.createElement('article');
        itemElement.className = 'border p-4 rounded-lg shadow-md';
        itemElement.innerHTML = `
            <h3 class="text-lg font-semibold">${item.name}</h3>
            <p><strong>Price:</strong> ${item.price} BHD</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <a href="#marketplace-listing" class="text-purple-700 hover:underline">View Details</a>
        `;
        itemListContainer.appendChild(itemElement);
    });

    renderPagination();
}

// Render Pagination Buttons
function renderPagination() {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'flex justify-center space-x-2 mt-6';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-purple-700 text-white' : 'bg-gray-200'}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderItems();
        });
        paginationContainer.appendChild(pageBtn);
    }

    itemListContainer.appendChild(paginationContainer);
}

// Search Items
function searchItems() {
    const query = searchInput.value.trim().toLowerCase();
    filteredItems = allItems.filter(item =>
        item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderItems();
}

// Form Validation
postItemForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const inputs = postItemForm.querySelectorAll('input, textarea');
    let formValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            formValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });

    if (!formValid) {
        alert('Please fill in all fields correctly.');
        return;
    }

    alert('Item submitted successfully!');
    postItemForm.reset();
});

// Event Listeners
searchButton.addEventListener('click', searchItems);

// Initial Load
fetchMarketplaceItems();