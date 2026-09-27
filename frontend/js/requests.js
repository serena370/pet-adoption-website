document.addEventListener("DOMContentLoaded", () => {
  const requestsContainer = document.getElementById("allRequestsContainer");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || user.role !== "shelter") {
    alert("Access denied.");
    window.location.href = "login.html";
    return;
  }

  // Fetch all adoption requests (for shelter)
  async function fetchAdoptionRequests() {
    try {
      const response = await fetch("http://localhost:5000/api/adoptions", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("Fetched adoption requests:", data);

      requestsContainer.innerHTML = "";

      if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
        requestsContainer.innerHTML = "<p>No adoption requests yet.</p>";
        return;
      }

      data.data.forEach(request => {
        const {
          request_id,
          pet_name,
          species,
          breed,
          pet_photo,
          adopter_name,
          adopter_email,
          status
        } = request;

        const card = document.createElement("div");
        card.classList.add("request-card");

        card.innerHTML = `
          <img src="${pet_photo || "https://placekitten.com/300/200"}" alt="${pet_name}">
          <div class="request-info">
            <h3>${pet_name}</h3>
            <p><strong>Species:</strong> ${species}</p>
            <p><strong>Breed:</strong> ${breed}</p>
            <p><strong>Requested by:</strong> ${adopter_name}</p>
            <p><strong>Email:</strong> ${adopter_email}</p>
            <p><strong>Status:</strong> <span class="status ${status}">${status}</span></p>
           
            
            <button class="btn-primary btn-view-details">View Details</button>
            <div class="hidden-details" style="display:none; margin-top:10px;">
            <p><strong>Phone:</strong> ${request.phone || "N/A"}</p>
            <p><strong>Message:</strong> ${request.message || "N/A"}</p>
            </div>

            <div class="buttons">
              <button class="btn-approve" data-id="${request_id}" ${status !== "pending" ? "disabled" : ""}>Approve</button>
              <button class="btn-reject" data-id="${request_id}" ${status !== "pending" ? "disabled" : ""}>Reject</button>
            </div>
          </div>
        `;

        requestsContainer.appendChild(card);
      });

      // Add event listeners for buttons


      document.querySelectorAll(".btn-view-details").forEach(btn => {
      btn.addEventListener("click", () => {
      const detailsDiv = btn.nextElementSibling;
      if (detailsDiv.style.display === "none") {
      detailsDiv.style.display = "block";
      btn.textContent = "Hide Details";
      } else {
      detailsDiv.style.display = "none";
      btn.textContent = "View Details";
         }
      });
    });


      document.querySelectorAll(".btn-approve").forEach(btn =>
        btn.addEventListener("click", () => updateStatus(btn.dataset.id, "approved"))
      );
      document.querySelectorAll(".btn-reject").forEach(btn =>
        btn.addEventListener("click", () => updateStatus(btn.dataset.id, "rejected"))
      );

    } catch (err) {
      console.error("Error fetching adoption requests:", err);
      requestsContainer.innerHTML = "<p>Failed to load requests. Try again later.</p>";
    }
  }

  // Update request status
  async function updateStatus(id, status) {
    try {
      const response = await fetch(`http://localhost:5000/api/adoptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Request ${status} successfully!`);
        fetchAdoptionRequests();
      } else {
        alert("Failed to update request: " + data.message);
      }
    } catch (err) {
      console.error("Error updating request:", err);
      alert("Server error. Please try again later.");
    }
  }

  // Logout
  document.querySelector(".btn-logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  });

  // Initial fetch
  fetchAdoptionRequests();
});
