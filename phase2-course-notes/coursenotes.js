// 4course-notes.js

// === Variables ===
const notesListContainer = document.createElement('div');
notesListContainer.className = "mt-6 grid gap-4";
document.querySelector('main').appendChild(notesListContainer);

let notesData = [];
let currentPage = 1;
const notesPerPage = 5;
let currentSort = 'default';
let searchTerm = '';

// === Helper Functions ===
async function fetchNotes() {
    showLoading();
    try {
        const response = await fetch('https://mockapi.io/projects/65f2fb3cc56f8e409230a5a9/notes'); // Replace with your real API URL
        if (!response.ok) throw new Error('Failed to fetch notes');
        const data = await response.json();
        notesData = data;
        renderNotes();
    } catch (error) {
        showError(error.message);
    }
}

function showLoading() {
    notesListContainer.innerHTML = `<div class="text-center text-purple-700">Loading notes...</div>`;
}

function showError(message) {
    notesListContainer.innerHTML = `<div class="text-center text-red-600">Error: ${message}</div>`;
}

function renderNotes() {
    let filteredNotes = notesData.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (currentSort === 'alphabetical') {
        filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
    }

    const start = (currentPage - 1) * notesPerPage;
    const end = start + notesPerPage;
    const paginatedNotes = filteredNotes.slice(start, end);

    notesListContainer.innerHTML = paginatedNotes.map(note => `
        <div class="bg-white p-4 rounded shadow">
            <h3 class="text-lg font-bold text-purple-700">${note.title}</h3>
            <p class="text-gray-600">Course: ${note.course}</p>
            <p class="text-gray-500 mt-2">${note.description}</p>
            <button onclick="viewNoteDetail('${note.id}')" class="mt-2 text-purple-500 hover:underline">View Details</button>
        </div>
    `).join('') + renderPagination(filteredNotes.length);
}

function renderPagination(totalNotes) {
    const totalPages = Math.ceil(totalNotes / notesPerPage);
    let buttons = '';

    for (let i = 1; i <= totalPages; i++) {
        buttons += `<button onclick="goToPage(${i})" class="px-2 py-1 m-1 rounded ${i === currentPage ? 'bg-purple-700 text-white' : 'bg-gray-200'}">${i}</button>`;
    }

    return `<div class="text-center mt-4">${buttons}</div>`;
}

function goToPage(page) {
    currentPage = page;
    renderNotes();
}

function viewNoteDetail(noteId) {
    const note = notesData.find(n => n.id === noteId);
    if (note) {
        alert(`Title: ${note.title}\nCourse: ${note.course}\nDescription: ${note.description}`);
    }
}

// === Event Listeners for Search and Sort ===
const searchInput = document.createElement('input');
searchInput.placeholder = "Search notes...";
searchInput.className = "mt-6 w-full p-2 border rounded";
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    currentPage = 1;
    renderNotes();
});
document.querySelector('main').insertBefore(searchInput, notesListContainer);

const sortSelect = document.createElement('select');
sortSelect.className = "mt-4 w-full p-2 border rounded";
sortSelect.innerHTML = `
    <option value="default">Sort By: Default</option>
    <option value="alphabetical">Sort By: Alphabetical</option>
`;
sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderNotes();
});
document.querySelector('main').insertBefore(sortSelect, notesListContainer);

// === Form Validation ===
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });
        if (!isValid) {
            e.preventDefault();
            alert('Please fill all required fields correctly.');
        }
    });
});

// === Initial Fetch ===
fetchNotes();