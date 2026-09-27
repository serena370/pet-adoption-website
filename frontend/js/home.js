document.addEventListener("DOMContentLoaded", () => {
  const petsContainer = document.getElementById("petsContainer");
  const dashboardLink = document.getElementById("dashboardLink");
  const signUpLink = document.querySelector('ul.nav-links li a[href="register.html"]');
  const loadMoreBtn = document.getElementById("loadMoreBtn"); // homepage "Load More" button

  const modal = document.getElementById("adoptionModal"); // adoption modal
  const closeModal = document.getElementById("closeModal");
  const adoptionForm = document.getElementById("adoptionForm");
  const petIdInput = document.getElementById("petId");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  let allPets = [];
  let previewIndex = 0;
  const petsPerLoad = 3;

  // Show dashboard if logged in
  if (user) {
    dashboardLink.style.display = "inline";

    signUpLink.textContent = "Logout";
    signUpLink.href = "#";
    signUpLink.classList.add("btn-logout");
    signUpLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });

    dashboardLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (user.role === "adopter") {
        window.location.href = "adopter-dashboard.html";
      } else if (user.role === "shelter") {
        window.location.href = "shelter-dashboard.html";
      }
    });
  }

  // Fetch pets
  const fetchPets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pets");
      const data = await response.json();

      if (!data.success || !Array.isArray(data.data)) {
        petsContainer.innerHTML = "<p>No pets available for adoption right now.</p>";
        return;
      }

      allPets = data.data;
      previewIndex = 0;
      displayPetsPreview();
    } catch (error) {
      console.error("Error fetching pets:", error);
      petsContainer.innerHTML = "<p>Failed to load pets. Please try again later.</p>";
    }
  };

  // Display pets preview
  const displayPetsPreview = () => {
    petsContainer.innerHTML = "";

    const petsToShow = allPets.slice(0, previewIndex + petsPerLoad);

    petsToShow.forEach((pet) => {
      const card = document.createElement("div");
      card.classList.add("pet-card");

      card.innerHTML = `
        <img src="${pet.photo_url || 'https://placekitten.com/300/200'}" alt="${pet.name}">
        <h3>${pet.name}</h3>
        <p><strong>Species:</strong> ${pet.species || 'N/A'}</p>
        <p><strong>Breed:</strong> ${pet.breed || 'N/A'}</p>
        <p><strong>Gender:</strong> ${pet.gender || 'N/A'}</p>
        <p><strong>Age:</strong> ${pet.age ? pet.age + ' years' : 'N/A'}</p>
        <button class="btn-primary adopt-btn" ${pet.status.toLowerCase() === 'adopted' ? 'disabled style="background-color:#ccc;cursor:not-allowed;"' : ''} data-id="${pet.pet_id}">
          Adopt Me
        </button>
      `;

      petsContainer.appendChild(card);
    });

    previewIndex += petsPerLoad;

    if (loadMoreBtn) {
      loadMoreBtn.style.display = previewIndex >= allPets.length ? "none" : "inline-block";
    }

    attachAdoptButtons();
  };

  // Attach adopt button functionality
  const attachAdoptButtons = () => {
    document.querySelectorAll(".adopt-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        const petId = e.target.dataset.id;

        if (!token) {
          alert("You need to log in to adopt a pet.");
          window.location.href = "login.html";
          return;
        }

        if (user.role === "shelter") {
          alert("Shelters cannot adopt pets.");
          return;
        }

        // Adopter: open modal like in pets.js
        if (user.role === "adopter") {
          petIdInput.value = petId;
          modal.style.display = "flex";
        }
      });
    });
  };

  // Load More button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", displayPetsPreview);
  }

  // Modal close
  if (closeModal) {
    closeModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
  }

  // Adoption form submission
  if (adoptionForm) {
    adoptionForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = {
        pet_id: petIdInput.value,
        fullName: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        message: document.getElementById("message").value
      };

      try {
        const res = await fetch("http://localhost:5000/api/adoptions", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify(formData)
        });

        const result = await res.json();
        if (res.ok) {
          alert("Adoption request submitted successfully!");
          modal.style.display = "none";
        } else {
          alert(result.message || "Failed to submit request.");
        }
      } catch (err) {
        console.error(err);
        alert("Server error. Please try again later.");
      }
    });
  }

  fetchPets();
});
