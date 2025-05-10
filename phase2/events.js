// events.js

let allEvents = []; // Array to hold all events
const eventsContainer = document.querySelector('.event-list');
const loadingIndicator = document.createElement('div');
loadingIndicator.textContent = 'Loading...';
loadingIndicator.className = 'loading-indicator';


// Use the Fetch API 
async function fetchEvents() {
    showLoadingIndicator();
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Example API
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allEvents = await response.json();
        // Transforming data to match expected event structure
        allEvents = allEvents.map(event => ({
            id: event.id,
            title: event.title,
            date: new Date().toISOString().split('T')[0], // Placeholder date
            time: '10:00 AM', // Placeholder time
            description: event.body
        }));
        renderEvents(allEvents);
    } catch (error) {
        console.error('Error fetching events:', error);
        displayError('Failed to load events. Please try again later.');
    } finally {
        hideLoadingIndicator();
    }
}


function showLoadingIndicator() {
    eventsContainer.appendChild(loadingIndicator);
}

function hideLoadingIndicator() {
    if (loadingIndicator.parentNode) {
        loadingIndicator.parentNode.removeChild(loadingIndicator);
    }
}

/

function renderEvents(events) {
    eventsContainer.innerHTML = ''; // Clear previous events
    events.forEach(event => {
        const eventElement = document.createElement('article');
        eventElement.className = 'border p-4 rounded-lg shadow-md';
        eventElement.innerHTML = `
            <h3 class="text-lg font-semibold">${event.title}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <a href="#details" class="text-purple-700 hover:underline" onclick="showEventDetails(${event.id})">View Details</a>
        `;
        eventsContainer.appendChild(eventElement);
    });
}

// detail view when an item is selected.
function showEventDetails(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (event) {
        const detailView = document.getElementById('details');
        detailView.innerHTML = `
            <h2 class="text-xl font-bold text-purple-700">Event Details</h2>
            <p><strong>Event Title:</strong> ${event.title}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <div class="mt-4 flex space-x-4">
                <button class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400" onclick="editEvent(${event.id})">Edit</button>
                <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500" onclick="deleteEvent(${event.id})">Delete</button>
            </div>
            <a href="#events" class="block text-center text-purple-700 mt-4 hover:underline">Back to Events</a>
        `;
    }
}


// Implement search functionality with filters.
document.querySelector('input[placeholder="Search events..."]').addEventListener('input', event => {
    const query = event.target.value.toLowerCase();
    const filteredEvents = allEvents.filter(e => e.title.toLowerCase().includes(query));
    renderEvents(filteredEvents);
});

/
// Add sorting capabilities for listed items.
document.getElementById('sort').addEventListener('change', event => {
    const criteria = event.target.value;
    const sortedEvents = [...allEvents].sort((a, b) => {
        if (criteria === 'date') {
            return new Date(a.date) - new Date(b.date);
        } else {
            return a.title.localeCompare(b.title);
        }
    });
    renderEvents(sortedEvents);
});

// Requirement: Interactive Features
// Implement form validation without submitting the form.
document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const description = document.getElementById('event-description').value;

    if (!title || !date || !time || !description) {
        displayError('All fields are required.');
        return;
    }

    const newEvent = { id: Date.now(), title, date, time, description };
    allEvents.push(newEvent);
    renderEvents(allEvents);
    event.target.reset();
});


// Implement form validation with  error messages.
function displayError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}


document.addEventListener('DOMContentLoaded', fetchEvents);