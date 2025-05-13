//login 
// Constants
const API_URL = 'https://jsonplaceholder.typicode.com/';
const ITEMS_PER_PAGE = 5;

let allItems = [];
let currentPage = 1;
let filteredItems = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    setupLoginValidation();
});

// Fetch data
function fetchData() {
    showLoading(true);
    fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Network response failed');
            return res.json();
        })
        .then(data => {
            allItems = data;
            filteredItems = data;
            renderItems();
            renderPagination();
        })
        .catch(() => {
            showError(true);
        })
        .finally(() => {
            showLoading(false);
        });
}

// Loading & Error states
function showLoading(state) {
    let loading = document.getElementById('loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'loading';
        loading.className = 'text-center text-purple-700 my-4';
        loading.textContent = 'Loading...';
        document.querySelector('main').prepend(loading);
    }
    loading.style.display = state ? 'block' : 'none';
}

function showError(state) {
    let error = document.getElementById('error-message');
    if (!error) {
        error = document.createElement('div');
        error.id = 'error-message';
        error.className = 'text-center text-red-500 mt-4';
        error.textContent = 'Failed to load data. Please try again.';
        document.querySelector('main').prepend(error);
    }
    error.style.display = state ? 'block' : 'none';
}

// Render items
function renderItems() {
    const list = document.getElementById('data-list') || createDataList();
    list.innerHTML = '';
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filteredItems.slice(start, end);

    pageItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'border p-3 my-2 rounded bg-white shadow';
        li.innerHTML = `<strong>${item.title}</strong><p>${item.body}</p>`;
        li.addEventListener('click', () => showDetails(item));
        list.appendChild(li);
    });
}

// Create and inject the list container
function createDataList() {
    const list = document.createElement('ul');
    list.id = 'data-list';
    list.className = 'mt-4';
    document.querySelector('main').appendChild(list);

    // Add search box
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search...';
    searchBox.className = 'border p-2 rounded w-full mt-4';
    searchBox.addEventListener('input', e => {
        const query = e.target.value.toLowerCase();
        filteredItems = allItems.filter(item => item.title.toLowerCase().includes(query));
        currentPage = 1;
        renderItems();
        renderPagination();
    });
    document.querySelector('main').insertBefore(searchBox, list);

    return list;
}

// Render pagination buttons
function renderPagination() {
    const container = document.getElementById('pagination') || createPaginationContainer();
    container.innerHTML = '';
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `px-3 py-1 mx-1 rounded ${i === currentPage ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border'}`;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderItems();
        });
        container.appendChild(btn);
    }
}

function createPaginationContainer() {
    const div = document.createElement('div');
    div.id = 'pagination';
    div.className = 'flex justify-center mt-4';
    document.querySelector('main').appendChild(div);
    return div;
}

// Show item detail (optional)
function showDetails(item) {
    alert(`Title: ${item.title}\n\n${item.body}`);
}

// Form validation for login
function setupLoginValidation() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');
        let valid = true;

        if (!email.value.includes('@')) {
            email.classList.add('border-red-500');
            email.placeholder = 'Enter a valid email';
            valid = false;
        } else {
            email.classList.remove('border-red-500');
        }

        if (password.value.length < 6) {
            password.classList.add('border-red-500');
            password.placeholder = 'Password must be 6+ chars';
            valid = false;
        } else {
            password.classList.remove('border-red-500');
        }

       if (valid) {
    fetch("https://your-replit-username.repl.co/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            alert(data.message); // Login successful
            // You can save login state if needed
            // localStorage.setItem("user", JSON.stringify(data));
            // window.location.href = "dashboard.html"; // Optional redirect
        } else {
            alert(data.error || "Login failed.");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Server error. Please try again later.");
    });
}

    });
}
