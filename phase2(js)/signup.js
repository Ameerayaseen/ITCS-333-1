document.addEventListener("DOMContentLoaded", () => {
    // ===== Root Container =====
    const body = document.body;
    body.style.fontFamily = "sans-serif";
    body.style.background = "#f3f4f6";
    body.className = "text-gray-900";
  
    // ===== Header =====
    const header = document.createElement("header");
    header.className =
      "bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 text-center text-2xl font-bold shadow-lg";
    header.textContent = "SIGNUP";
    body.appendChild(header);
  
    // ===== Form Container =====
    const main = document.createElement("main");
    main.className = "max-w-xl mx-auto p-6";
    body.appendChild(main);
  
    const formSection = document.createElement("section");
    formSection.className = "bg-white p-6 rounded-lg shadow-md";
    main.appendChild(formSection);
  
    const title = document.createElement("h2");
    title.className = "text-xl font-bold text-purple-700";
    title.textContent = "Signup";
    formSection.appendChild(title);
  
    const form = document.createElement("form");
    form.className = "space-y-4 mt-4";
    formSection.appendChild(form);
  
    const emailLabel = document.createElement("label");
    emailLabel.className = "block";
    emailLabel.innerHTML = `Email:<input type="email" id="email" class="border p-2 rounded w-full" placeholder="Enter your email" required>`;
    form.appendChild(emailLabel);
  
    const passLabel = document.createElement("label");
    passLabel.className = "block";
    passLabel.innerHTML = `Password:<input type="password" id="password" class="border p-2 rounded w-full" placeholder="Create a password" required>`;
    form.appendChild(passLabel);
  
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className =
      "bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-500";
    submitBtn.textContent = "Signup";
    form.appendChild(submitBtn);
  
    const loginLink = document.createElement("p");
    loginLink.className = "mt-4 text-center";
    loginLink.innerHTML =
      'Already have an account? <a href="#" class="text-purple-700 hover:underline">Login here</a>';
    formSection.appendChild(loginLink);
  
    // ===== Validate Form =====
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      let valid = true;
  
      if (!email.value.includes("@")) {
        email.classList.add("border-red-500");
        valid = false;
      } else {
        email.classList.remove("border-red-500");
      }
  
      if (password.value.length < 6) {
        password.classList.add("border-red-500");
        valid = false;
      } else {
        password.classList.remove("border-red-500");
      }
  
      if (valid) {
        alert("Signup validated successfully!");
      }
    });
  
    // ===== Data Section =====
    const dataSection = document.createElement("section");
    dataSection.className = "mt-8";
    main.appendChild(dataSection);
  
    const loading = document.createElement("div");
    loading.id = "loading";
    loading.className = "text-purple-700 text-center my-4";
    loading.textContent = "Loading...";
    dataSection.appendChild(loading);
  
    const search = document.createElement("input");
    search.className = "border p-2 rounded w-full my-4";
    search.placeholder = "Search posts...";
    dataSection.appendChild(search);
  
    const list = document.createElement("ul");
    list.id = "data-list";
    list.className = "space-y-4";
    dataSection.appendChild(list);
  
    const pagination = document.createElement("div");
    pagination.id = "pagination";
    pagination.className = "flex justify-center space-x-2 mt-4";
    dataSection.appendChild(pagination);
  
    // ===== Fetch & Render Data =====
    let posts = [];
    let currentPage = 1;
    const itemsPerPage = 5;
  
    fetch('https://jsonplaceholder.typicode.com/')
      .then((res) => res.json())
      .then((data) => {
        posts = data;
        renderList();
      })
      .catch(() => {
        loading.textContent = "Failed to load data.";
      });
  
    function renderList() {
      loading.style.display = "none";
      const query = search.value.toLowerCase();
      const filtered = posts.filter((p) =>
        p.title.toLowerCase().includes(query)
      );
      const totalPages = Math.ceil(filtered.length / itemsPerPage);
      const start = (currentPage - 1) * itemsPerPage;
      const visible = filtered.slice(start, start + itemsPerPage);
  
      list.innerHTML = "";
      visible.forEach((post) => {
        const li = document.createElement("li");
        li.className = "bg-white p-4 rounded shadow cursor-pointer";
        li.innerHTML = `<strong>${post.title}</strong><p>${post.body}</p>`;
        li.onclick = () =>
          alert(`Title: ${post.title}\n\nBody: ${post.body}`);
        list.appendChild(li);
      });
  
      pagination.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `px-3 py-1 rounded ${
          i === currentPage ? "bg-purple-700 text-white" : "bg-gray-300"
        }`;
        btn.onclick = () => {
          currentPage = i;
          renderList();
        };
        pagination.appendChild(btn);
      }
    }
  
    search.addEventListener("input", () => {
      currentPage = 1;
      renderList();
    });
  });
  