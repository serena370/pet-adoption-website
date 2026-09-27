document.addEventListener("DOMContentLoaded", () => {
  const petsContainer = document.getElementById("petsContainer");
  const token = localStorage.getItem("token");

  const searchInput = document.getElementById("searchName");
  const speciesFilter = document.getElementById("filterSpecies");
  const genderFilter = document.getElementById("filterGender");

  const modal = document.getElementById("adoptionModal");
  const closeModal = document.getElementById("closeModal");
  const adoptionForm = document.getElementById("adoptionForm");
  const petIdInput = document.getElementById("petId");
  const breedInput = document.getElementById("searchBreed");
  const sortSelect = document.getElementById("sortPets");

  const user = JSON.parse(localStorage.getItem("user")); // get logged in user

  let allPets = []; // store all pets for filtering

  // Fetch pets from backend
  const fetchPets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pets");
      const data = await response.json();
      const pets = Array.isArray(data.data) ? data.data : [];
      petsContainer.innerHTML = "";

      if (pets.length === 0) {
        petsContainer.innerHTML = "<p>No pets available.</p>";
        return;
      }

      allPets = pets; // save pets for filtering
      displayPets(allPets); // initial render
    } catch (err) {
      console.error("Error fetching pets:", err);
      petsContainer.innerHTML = "<p>Failed to load pets. Please try again later.</p>";
    }
  };

  // Render pets (reusable for filtering)
  const displayPets = (pets) => {
    petsContainer.innerHTML = "";

    if (pets.length === 0) {
      petsContainer.innerHTML = "<p>No matching pets found.</p>";
      return;
    }

    pets.forEach((pet) => {
      const card = document.createElement("div");
      card.classList.add("pet-card");

      card.innerHTML = `
        <img src="${pet.photo_url || 'https://placekitten.com/300/200'}" alt="${pet.name}">
        <h3>${pet.name}</h3>
        <p><strong>Species:</strong> ${pet.species || 'N/A'}</p>
        <p><strong>Breed:</strong> ${pet.breed || 'N/A'}</p>
        <p><strong>Age:</strong> ${pet.age || 'N/A'}</p>
        <p><strong>Status:</strong> ${pet.status}</p>
        <button class="btn-primary" ${pet.status.toLowerCase() === 'adopted' ? 'disabled style="background-color:#ccc;cursor:not-allowed;"' : ''} data-pet-id="${pet.pet_id}">
          Adopt Me
        </button>
      `;

      petsContainer.appendChild(card);

      const adoptBtn = card.querySelector(".btn-primary");
      if (!adoptBtn.disabled) {
        adoptBtn.addEventListener("click", () => {
          if (!token) {
            alert("You need to log in to adopt a pet.");
            window.location.href = "login.html";
            return;
          }

          if (user.role === "shelter") {
            alert("Shelters cannot adopt pets.");
            return;
          }

          petIdInput.value = adoptBtn.dataset.petId;
          modal.style.display = "flex";
        });
      }
    });
  };

  // Filter pets
  const filterPets = () => {
    const searchText = searchInput.value.toLowerCase();
    const breedText = breedInput ? breedInput.value.toLowerCase() : "";
    const selectedSpecies = speciesFilter.value.toLowerCase();
    const selectedGender = genderFilter.value.toLowerCase();

  const filteredPets = allPets.filter((pet) => {
  const name = (pet.name || "").toLowerCase();
  const breed = (pet.breed || "").toLowerCase();
  const species = (pet.species || "").toLowerCase();
  const gender = (pet.gender || "").toLowerCase();

  const matchesName = name.includes(searchText);
  const matchesBreed = breed.includes(breedText); 
  const matchesSpecies = !selectedSpecies || species === selectedSpecies;
  const matchesGender = !selectedGender || gender === selectedGender;

  return matchesName && matchesBreed && matchesSpecies && matchesGender;
});

 // Sorting logic
  const sortValue = sortSelect.value;
  if (sortValue) {
    const [key, order] = sortValue.split("-");
    filteredPets.sort((a, b) => {
      if (key === "name") {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return order === "asc" ? -1 : 1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return order === "asc" ? 1 : -1;
        return 0;
      } else if (key === "age") {
        return order === "asc" ? a.age - b.age : b.age - a.age;
      }
    });
  }

    displayPets(filteredPets);
  };

  // Event listeners for filtering
  if (searchInput) searchInput.addEventListener("input", filterPets);
  if (speciesFilter) speciesFilter.addEventListener("change", filterPets);
  if (genderFilter) genderFilter.addEventListener("change", filterPets);
  if (breedInput) breedInput.addEventListener("input", filterPets);
  if (sortSelect) sortSelect.addEventListener("change", filterPets);

  // Modal close
  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Handle adoption form submission
  adoptionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You need to log in to submit an adoption request.");
      return;
    }

    if (user.role === "shelter") {
      alert("Shelters cannot submit adoption requests.");
      return;
    }

    const formData = {
      pet_id: petIdInput.value,
      fullName: document.getElementById("fullName").value,
      phone: document.getElementById("phone").value,
      message: document.getElementById("message").value
    };

    try {
      const res = await fetch("http://localhost:5000/api/adoptions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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

  // Logout
  const logoutBtn = document.querySelector(".btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }

  fetchPets(); // Initial fetch
});
