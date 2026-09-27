document.addEventListener("DOMContentLoaded", () => {
  const requestsContainer = document.getElementById("myRequestsContainer");
  const token = localStorage.getItem("token");

  const fetchMyRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/adoptions/my", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("My requests data:", data);

      requestsContainer.innerHTML = ""; // Clear previous content

      if (!data.success || data.data.length === 0) {
        requestsContainer.innerHTML = "<p>You have no adoption requests yet.</p>";
        return;
      }

      data.data.forEach((request) => {
        const card = document.createElement("div");
        card.classList.add("request-card");

        card.innerHTML = `
          <img src="${request.pet_photo || "https://placekitten.com/300/200"}" alt="${request.pet_name}">
          <div class="request-info">
            <h3>${request.pet_name}</h3>
            <p><strong>Species:</strong> ${request.species || "N/A"}</p>
            <p><strong>Breed:</strong> ${request.breed || "N/A"}</p>
            <p><strong>Status:</strong> <span class="status ${request.status}">${request.status}</span></p>
          </div>
        `;

        requestsContainer.appendChild(card);
      });

    } catch (err) {
      console.error("Error fetching my requests:", err);
      requestsContainer.innerHTML = "<p>Failed to load your requests. Please try again later.</p>";
    }
  };

  // Logout
  document.querySelector(".btn-logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });

  fetchMyRequests();
});
