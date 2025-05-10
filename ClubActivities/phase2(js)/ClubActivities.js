

// Fetching the data from a JSON source
const activitiesUrl = 'https://jsonplaceholder.typicode.com/'; 
const activitiesContainer = document.getElementById('activities');
const loadingIndicator = document.createElement('div');
loadingIndicator.textContent = 'Loading activities...';
activitiesContainer.appendChild(loadingIndicator);

fetch(activitiesUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed! to fetch activities');
    }
    return response.json();
  })
  .then(data => {
    loadingIndicator.remove();
    renderActivities(data);
  })
  .catch(error => {
    loadingIndicator.textContent = 'Failed! to load activities , Please try again later ';
    console.error(error);
  });

// Rendering activities dynamically
function renderActivities(activities) {
  activities.forEach(activity => {
    const article = document.createElement('article');
    article.classList.add('border', 'p-4', 'rounded-lg', 'shadow-md', 'mb-6');
    article.innerHTML = `
      <h3 class="text-lg font-semibold">${activity.title}</h3>
      <p><strong>Activity:</strong> ${activity.body}</p>
      <details><summary class="text-purple-700 hover:underline"><b>view more details</b></summary>
        <p><b>Details:</b> ${activity.body}</p>
      </details>
    `;
    activitiesContainer.appendChild(article);
  });
}

// Search functionality with filters
const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener('input', filterActivities);

function filterActivities() {
  const searchTerm = searchInput.value.toLowerCase();
  const articles = activitiesContainer.querySelectorAll('article');
  articles.forEach(article => {
    const title = article.querySelector('h3').textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      article.style.display = '';
    } else {
      article.style.display = 'none';
    }
  });
}

// Sorting capabilities for listed items
const sortSelect = document.getElementById('sort');
sortSelect.addEventListener('change', sortActivities);

function sortActivities() {
  const articles = Array.from(activitiesContainer.querySelectorAll('article'));
  const sortOrder = sortSelect.value;
  articles.sort((a, b) => {
    const titleA = a.querySelector('h3').textContent;
    const titleB = b.querySelector('h3').textContent;
    if (sortOrder === 'oldest') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });
  articles.forEach(article => activitiesContainer.appendChild(article));
}

// Pagination
let currentPage = 1;
const itemsPerPage = 5;

function paginateActivities() {
  const articles = Array.from(activitiesContainer.querySelectorAll('article'));
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  articles.forEach((article, index) => {
    if (index >= startIndex && index < endIndex) {
      article.style.display = '';
    } else {
      article.style.display = 'none';
    }
  });
  updatePaginationControls(totalPages);
}

function updatePaginationControls(totalPages) {
  const paginationControls = document.getElementById('pagination-controls');
  paginationControls.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.add('pagination-button');
    button.addEventListener('click', () => {
      currentPage = i;
      paginateActivities();
    });
    paginationControls.appendChild(button);
  }
}

// Form validation without submitting
const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  if (form.checkValidity()) {
    console.log('Form is valid');

// Proceed with form submission 
  } else {
    form.reportValidity();
  }
});

// Dynamic content rendering for club details
const clubDetails = document.getElementById('club-details');
activitiesContainer.addEventListener('click', function (event) {
  if (event.target.tagName === 'H3') {
    const activityTitle = event.target.textContent;
    const activity = activities.find(a => a.title === activityTitle);
    renderClubDetails(activity);
  }
});

function renderClubDetails(activity) {
  clubDetails.innerHTML = `
    <h3 class="text-xl font-semibold">${activity.title}</h3>
    <p><strong>Activity:</strong> ${activity.body}</p>
    <p><strong>Description:</strong> ${activity.body}</p>
    <p><strong>Date:</strong> 22/10/2025</p>
    <p><strong>Time:</strong> 9:00 AM - 11:30 AM</p>
    <p><strong>Location:</strong> To be announced</p>
    <p><strong>Contact:</strong> <a href="mailto:DrMohammed@gmail.com" class="hover:text-purple-500">Dr. Mohammed Ali</a></p>
  `;
}

// Loading state indicator
function showLoadingState() {
  loadingIndicator.style.display = 'block';
}

function hideLoadingState() {
  loadingIndicator.style.display = 'none';
}