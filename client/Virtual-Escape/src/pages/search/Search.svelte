<script>
    import { onMount } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { navigate } from "svelte-navigator";
    import Navbar from "../../components/Navbar.svelte";

    let accounts = [];
    let isFound = true;

    titleStore.setTitle("Search | VE");

    onMount(() => {
        document.getElementById("search-icon").style.color = "#e7793e";
    });

    function searchAccounts(event) {
        const searchValue = event.target.value.toLowerCase();

        if (searchValue.length === 0) {
            accounts = [];
            isFound = true;
            return;
        }

        fetch("http://localhost:8080/api/search/users?search=" + searchValue, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    isFound = false;
                }
            })
            .then((result) => {
                isFound = true;
                accounts = result.data;
            })
            .catch((error) => {
                isFound = false;
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
    <div id="suggestions-container">
        {#if !isFound}
            <h1>Sorry, couldn't find any user</h1>
        {/if}
        {#each accounts as account}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="suggestion-card"
                on:click={() => {
                    localStorage.setItem(
                        "selectedAccount",
                        JSON.stringify(account)
                    );
                    navigate(`/search/@${account.nickname}`);
                }}
            >
                <div id="user-info-profile-image-wrapper">
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    <img
                        id="profile-image"
                        src={account.profile_img_url
                            ? `http://localhost:8080/${account.profile_img_url}`
                            : "http://localhost:8080/public/defaultUserProfileImage/1684737647624-181908121___default_profile_image.jpg"}
                        alt="Image Preview"
                    />
                </div>
                <div id="user-info-profile-search">
                    <h3 id="user-info-nickname-search">@{account.nickname}</h3>
                    <div id="extra-user-info-wrapper">
                        {#if account.gamertag}
                            <h6 id="user-info-gamertag">{account.gamertag}</h6>
                        {/if}
                        {#if account.age}
                            <h6 id="user-info-age">{account.age}</h6>
                        {/if}
                        {#if account.country}
                            <h6 id="user-info-country">{account.country}</h6>
                        {/if}
                        {#if account.language}
                            <h6 id="user-info-language">{account.language}</h6>
                        {/if}
                    </div>
                    {#if account.bio}
                        <div id="user-info-bio-wrapper">
                            <textarea id="user-info-bio-search"
                                >{account.bio}</textarea
                            >
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>
