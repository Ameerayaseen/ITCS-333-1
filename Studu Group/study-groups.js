document.addEventListener("DOMContentLoaded", () => {
  const groupList = document.querySelector(".grid");
  const searchInput = document.querySelector("input[type='text']");
  const dateInput = document.querySelector("input[type='date']");
  const form = document.querySelector("form");
  const loadingIndicator = document.createElement("p");
  loadingIndicator.textContent = "Loading...";
  loadingIndicator.className = "text-center text-purple-700 font-bold";

  let studyGroups = [];
  let filteredGroups = [];

  // Fetch data from mock API
  async function fetchStudyGroups() {
      groupList.innerHTML = "";
      groupList.parentElement.prepend(loadingIndicator);

      try {
          const res = await fetch("https://mocki.io/v1/bf90e7d6-b8a6-41fc-8a52-930383a1a9f3"); // استبدل بالرابط المناسب
          if (!res.ok) throw new Error("Failed to fetch study groups.");
          studyGroups = await res.json();
          filteredGroups = [...studyGroups];
          renderGroups(filteredGroups);
      } catch (err) {
          groupList.innerHTML = `<p class="text-red-500">${err.message}</p>`;
      } finally {
          loadingIndicator.remove();
      }
  }

  function renderGroups(groups) {
      groupList.innerHTML = "";
      if (groups.length === 0) {
          groupList.innerHTML = `<p class="col-span-3 text-center text-gray-500">No study groups found.</p>`;
          return;
      }
      groups.forEach(group => {
          const card = document.createElement("div");
          card.className = "bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition";
          card.innerHTML = `
              <h2 class="text-xl font-semibold text-purple-700">${group.name}</h2>
              <p class="text-gray-600">Meeting: ${group.meeting}</p>
              <button class="bg-purple-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-purple-700">View Details</button>
              <button class="bg-purple-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-purple-700">Join</button>
          `;
          groupList.appendChild(card);
      });
  }

  // Filter logic
  function applyFilters() {
      const search = searchInput.value.toLowerCase();
      const date = dateInput.value;
      filteredGroups = studyGroups.filter(group =>
          group.name.toLowerCase().includes(search) &&
          (!date || group.date === date)
      );
      renderGroups(filteredGroups);
  }

  // Form validation
  form.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = form.querySelectorAll("input, textarea");
      let valid = true;

      inputs.forEach(input => {
          if (!input.value.trim()) {
              input.classList.add("border-red-500");
              valid = false;
          } else {
              input.classList.remove("border-red-500");
          }
      });

      if (!valid) {
          alert("Please fill in all fields correctly.");
      } else {
          alert("Study group created successfully!");
          form.reset();
      }
  });

  // Events
  searchInput.addEventListener("input", applyFilters);
  dateInput.addEventListener("change", applyFilters);

  fetchStudyGroups();
});
