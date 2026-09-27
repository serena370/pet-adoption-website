document.addEventListener("DOMContentLoaded", () => {
  const petsContainer = document.getElementById("myPetsContainer");
  const token = localStorage.getItem("token");

  if (!petsContainer) {
    console.error("Error: #myPetsContainer element not found in the DOM.");
    return;
  }

  const fetchMyPets = async () => {
    try {
      // Fetch only the logged-in adopter's pets
      const response = await fetch("http://localhost:5000/api/adoptions/my/adopted", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("My adopted pets:", data);

      petsContainer.innerHTML = ""; // clear existing content

      const pets = Array.isArray(data.data) ? data.data : [];

      if (pets.length === 0) {
        petsContainer.innerHTML = "<p>You haven't adopted any pets yet.</p>";
        return;
      }

      pets.forEach((pet) => {
        const card = document.createElement("div");
        card.classList.add("pet-card");

        // Add a class if the pet is adopted (all should be adopted here)
        //card.classList.add("adopted-pet");

        card.innerHTML = `
       <img src="${pet.photo_url ? (pet.photo_url.startsWith('http') ? pet.photo_url : `http://localhost:5000${pet.photo_url}`) : 'https://placekitten.com/300/200'}" 
       alt="${pet.pet_name}">
       <h3>${pet.pet_name}</h3>
       `;

        petsContainer.appendChild(card);
      });
    } catch (err) {
      console.error("Error fetching my pets:", err);
      petsContainer.innerHTML = "<p>Failed to load your pets. Please try again later.</p>";
    }
  };

  fetchMyPets();

  // Logout
  document.querySelector(".btn-logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
});
