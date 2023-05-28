<script>
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import Navbar from "../../components/Navbar.svelte";

    titleStore.setTitle("Search | VE");

    onMount(() => {
        document.getElementById("search-icon").style.color = "#e7793e";
    });

    function searchAccounts() {
        const searchInput = document.getElementById("search-input");
        const suggestionsContainer = document.getElementById(
            "suggestions-container"
        );
        // @ts-ignore
        const searchValue = searchInput.value.toLowerCase();

        suggestionsContainer.innerHTML = "";

        if (searchValue.length === 0) {
            return;
        }

        fetch("http://localhost:8080/api/search/users?search=" + searchValue, {
            method: "GET",
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch users");
                }
            })
            .then((result) => {
                const accounts = result.data;
                accounts.forEach((account) => {
                    const card = document.createElement("div");
                    card.className = "suggestion-card";
                    card.innerHTML = `
          <h3>@${account.nickname}</h3>
          <p>Gamertag: ${account.gamertag}</p>
          <p>Age: ${account.age}</p>
          <p>Country: ${account.country}</p>
          <p>Language: ${account.language}</p>
          <p>Bio: ${account.bio}</p>
          <img src="${
              "http://localhost:8080/" + account.profile_img_url ||
              "http://localhost:8080/public/defaultUserProfileImage/1684737647624-181908121___default_profile_image.jpg"
          }" alt="Profile image" style="width: 100px; height: 100px;">
        `;
                    suggestionsContainer.appendChild(card);
                });
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }
</script>

<Navbar />

<div class="search-container">
    <input
        type="text"
        id="search-input"
        placeholder="Search accounts..."
        on:input={searchAccounts}
    />
    <div id="suggestions-container" />
</div>
