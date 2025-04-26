const API_URL = 'https://mockapi.io/projects/6645c24cb8925626f8909a70/groups'; // Mock URL
const groupsContainer = document.getElementById('groups-container');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const searchInput = document.getElementById('searchInput');
const dateFilter = document.getElementById('dateFilter');

let allGroups = [];

const fallbackData = [
  { id: 1, name: "Math Club", date: "2025-09-02", time: "14:00", description: "Math lovers unite!" },
  { id: 2, name: "Computer Science Club", date: "2025-10-25", time: "08:00-10:30", description: "Coding sessions weekly." },
  { id: 3, name: "Physics Club", date: "2025-10-30", time: "11:00-12:30", description: "Explore the mysteries of the universe." },
  { id: 4, name: "Biology Club", date: "2025-11-01", time: "20:30-22:30", description: "Dive into the study of life and organisms." },
  { id: 5, name: "History Club", date: "2025-11-11", time: "13:30-15:30", description: "Discuss ancient to modern history." },
  { id: 6, name: "Chemistry Club", date: "2025-11-18", time: "14:00-16:30", description: "Discover the magic of chemical reactions." }
];

async function fetchStudyGroups() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    allGroups = data;
    renderGroups(allGroups);
  } catch (err) {
    console.error(err);
    error.classList.remove('hidden');
    allGroups = fallbackData;
    renderGroups(allGroups);
  } finally {
    loading.classList.add('hidden');
  }
}

function renderGroups(groups) {
  groupsContainer.innerHTML = '';
  if (groups.length === 0) {
    groupsContainer.innerHTML = `<p class="text-center col-span-3 text-purple-700 font-semibold">No study groups found.</p>`;
    return;
  }

  groups.forEach(group => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition';
    div.innerHTML = `
      <h3 class="text-lg font-bold text-purple-700 mb-1">${group.name}</h3>
      <p class="text-gray-600">📅 ${group.date} ⏰ ${group.time}</p>
      <div class="mt-4 flex space-x-2">
        <button onclick="viewDetails('${group.id}')" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">View</button>
        <button class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Join</button>
      </div>
    `;
    groupsContainer.appendChild(div);
  });
}

function viewDetails(id) {
  const group = allGroups.find(g => g.id == id);
  if (group) {
    alert(`Group: ${group.name}\nDate: ${group.date} ${group.time}\nDescription: ${group.description}`);
  }
}

function filterGroups() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedDate = dateFilter.value;

  const filtered = allGroups.filter(group => {
    const matchName = group.name.toLowerCase().includes(searchTerm);
    const matchDate = selectedDate ? group.date === selectedDate : true;
    return matchName && matchDate;
  });

  renderGroups(filtered);
}

searchInput.addEventListener('input', filterGroups);
dateFilter.addEventListener('change', filterGroups);


const form = document.querySelector('#form form');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('groupName').value.trim();
  const time = document.getElementById('meetingTime').value.trim();
  const desc = document.getElementById('description').value.trim();

  if (!name || !time || !desc) {
    alert('Please fill in all fields.');
    return;
  }

  alert('Study group created successfully!');
  form.reset();
});

window.onload = fetchStudyGroups;
