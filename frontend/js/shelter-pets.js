document.addEventListener("DOMContentLoaded", () => {
  const petsContainer = document.getElementById("shelterPetsContainer");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // logged-in shelter

  if (!user || user.role !== "shelter") {
    alert("You must be logged in as a shelter to view this page.");
    window.location.href = "login.html";
    return;
  }

  // Fetch pets for this shelter
  const fetchShelterPets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pets/my-pets", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("Shelter pets data:", data);
      petsContainer.innerHTML = "";

      const pets = Array.isArray(data.data) ? data.data : [];
      if (pets.length === 0) {
        petsContainer.innerHTML = "<p>No pets listed in your shelter yet.</p>";
        return;
      }

      pets.forEach((pet) => {
        if (!pet.pet_id) {
          console.warn("Pet missing pet_id:", pet);
          return; // Skip any pet without an ID
        }

        const card = document.createElement("div");
        card.classList.add("pet-card");

        card.innerHTML = `
          <img src="${pet.photo_url || 'https://placekitten.com/300/200'}" alt="${pet.name}">
          <h3>${pet.name}</h3>
          <p><strong>Species:</strong> ${pet.species || 'N/A'}</p>
          <p><strong>Breed:</strong> ${pet.breed || 'N/A'}</p>
          <p><strong>Age:</strong> ${pet.age || 'N/A'}</p>
          <p><strong>Status:</strong> ${pet.status}</p>
          <div class="buttons">
            <button class="btn-primary btn-edit" data-id="${pet.pet_id}">Edit</button>
            <button class="btn-primary btn-delete" data-id="${pet.pet_id}">Delete</button>
          </div>
        `;

        petsContainer.appendChild(card);
      });

      // Add event listeners AFTER cards are added
      document.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", () => {
          const petId = btn.dataset.id;
          if (!petId) {
            alert("No pet selected for editing.");
            return;
          }
          localStorage.setItem("selectedPetId", petId);
          window.location.href = `edit-pet.html?id=${petId}`;
        });
      });

      document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const petId = btn.dataset.id;
          if (!petId) return;
          if (confirm("Are you sure you want to delete this pet?")) {
            try {
              const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                }
              });
              const result = await response.json();
              if (result.success) {
                alert("Pet deleted successfully!");
                fetchShelterPets(); // Refresh list
              } else {
                alert("Failed to delete pet: " + result.message);
              }
            } catch (err) {
              console.error("Error deleting pet:", err);
              alert("Server error. Please try again.");
            }
          }
        });
      });

    } catch (err) {
      console.error("Error fetching shelter pets:", err);
      petsContainer.innerHTML = "<p>Failed to load pets. Please try again later.</p>";
    }
  };

  // Logout
  document.querySelector(".btn-logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });

  // Initial fetch
  fetchShelterPets();
});
