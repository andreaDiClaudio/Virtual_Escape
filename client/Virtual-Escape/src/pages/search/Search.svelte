<script>
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { navigate } from "svelte-navigator";
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
                    // Create the suggestion card
                    const card = document.createElement("div");
                    card.className = "suggestion-card";
                    card.addEventListener("click", () => {
                        console.log("clicked");
                        console.log(account);
                        localStorage.setItem(
                            "selectedAccount",
                            JSON.stringify(account)
                        );
                        navigate(`/search/@${account.nickname}`);
                    });

                    // User info profile image wrapper
                    const profileImageWrapper = document.createElement("div");
                    profileImageWrapper.id = "user-info-profile-image-wrapper";
                    const img = document.createElement("img");
                    img.id = "profile-image";
                    img.src =
                        `http://localhost:8080/${account.profile_img_url}` ||
                        "http://localhost:8080/public/defaultUserProfileImage/1684737647624-181908121___default_profile_image.jpg";
                    img.alt = "Image Preview";
                    profileImageWrapper.appendChild(img);
                    card.appendChild(profileImageWrapper);

                    // User info profile
                    const userInfoProfile = document.createElement("div");
                    userInfoProfile.id = "user-info-profile-search";

                    const nicknameInput = document.createElement("h3");
                    nicknameInput.id = "user-info-nickname-search";
                    nicknameInput.textContent = `@${account.nickname}`;
                    userInfoProfile.appendChild(nicknameInput);

                    const extraUserInfoWrapper = document.createElement("div");
                    extraUserInfoWrapper.id = "extra-user-info-wrapper";

                    const gamertagInput = document.createElement("h6");
                    gamertagInput.id = "user-info-gamertag";
                    gamertagInput.textContent = `${account.gamertag}`;
                    extraUserInfoWrapper.appendChild(gamertagInput);

                    const ageInput = document.createElement("h6");
                    ageInput.id = "user-info-age";
                    ageInput.textContent = `${account.age}`;
                    extraUserInfoWrapper.appendChild(ageInput);

                    const countryInput = document.createElement("h6");
                    countryInput.id = "user-info-country";
                    countryInput.textContent = `${account.country}`;
                    extraUserInfoWrapper.appendChild(countryInput);

                    const languageInput = document.createElement("h6");
                    languageInput.id = "user-info-language";
                    languageInput.textContent = `${account.language}`;
                    extraUserInfoWrapper.appendChild(languageInput);

                    userInfoProfile.appendChild(extraUserInfoWrapper);

                    const userInfoBioWrapper = document.createElement("div");
                    userInfoBioWrapper.id = "user-info-bio-wrapper";

                    const bioTextarea = document.createElement("h6");
                    bioTextarea.id = "user-info-bio";
                    bioTextarea.textContent = `Bio: ${account.bio}`;
                    userInfoBioWrapper.appendChild(bioTextarea);

                    userInfoProfile.appendChild(userInfoBioWrapper);
                    card.appendChild(userInfoProfile);

                    // Append the suggestion card to the container
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
