<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { user } from "../../stores/users/users.js";

    titleStore.setTitle("Profile | VE");

    onDestroy(() => {
        titleStore.resetTitle();
    });

    //helper function to update user info in the webpage
    function updateUserInfoInput(elementId, value) {
        const element = document.getElementById(elementId);
        if (value !== null || value !== undefined) {
            if (elementId == "user-info-nickname") {
                // @ts-ignore
                element.value = "@" + value;
            } else {
                // @ts-ignore
                element.value = value;
            }
        } else {
            element.setAttribute("hidden", "true");
        }
    }

    /*LOAD USER INFO*/
    //Retrieve user info from db and displaythem
    onMount(() => {
        fetch(
            "http://localhost:8080/api/users?nickname=" +
                $user.nickname +
                "&email=" +
                $user.email,
            {
                method: "GET",
            }
        ).then((response) => {
            if (response.status == 200) {
                response.json().then((result) => {
                    const user = result.data[0];

                    updateUserInfoInput("user-info-nickname", user.nickname);
                    updateUserInfoInput("user-info-age", user.age);
                    updateUserInfoInput("user-info-country", user.country);
                    updateUserInfoInput("user-info-language", user.language);
                    updateUserInfoInput("user-info-gamertag", user.gamertag);
                    updateUserInfoInput("user-info-bio", user.bio);
                });
            }
        });
    });

    /*EDIT*/
    //shows buttons and modifies input to be not readonly
    function editUserInfo() {
        //TODO ask ai about rewriting thhis to make it more efficient

        //const profileImage TODO as last

        //save elements
        const gamertag = document.getElementById("user-info-gamertag");
        const age = document.getElementById("user-info-age");
        const country = document.getElementById("user-info-country");
        const language = document.getElementById("user-info-language");
        const bio = document.getElementById("user-info-bio");
        const editConfirmWrapper = document.getElementById(
            "user-info-edit-confirm-wrapper"
        );

        //style the input
        gamertag.className = "user-info-input";

        age.className = "user-info-input";
        age.style.width = "2rem";
        age.setAttribute("type", "number");

        country.className = "user-info-input";
        language.className = "user-info-input";
        bio.className = "user-info-input";

        //remove readonly attribute
        age.removeAttribute("readonly");
        country.removeAttribute("readonly");
        language.removeAttribute("readonly");
        gamertag.removeAttribute("readonly");
        bio.removeAttribute("readonly");
        //remove hidden attribute
        editConfirmWrapper.removeAttribute("hidden");
    }

    /*SAVE CHANGES*/
    function saveChanges() {
        //save attributes
        const age = document.getElementById("user-info-age");
        const country = document.getElementById("user-info-country");
        const language = document.getElementById("user-info-language");
        const gamertag = document.getElementById("user-info-gamertag");
        const bio = document.getElementById("user-info-bio");
        const editConfirmWrapper = document.getElementById(
            "user-info-edit-confirm-wrapper"
        );

        /*GET*/
        //Retrieve user logged in in the db and saves it in a variable
        const userFound = {};
        fetch(
            "http://localhost:8080/api/users?nickname=" +
                $user.nickname +
                "&email=" +
                $user.email,
            {
                method: "GET",
            }
        ).then((response) => {
            if (response.status == 200) {
                response.json().then((result) => {
                    const userFound = result.data[0];

                    /*PATCH*/
                    fetch("http://localhost:8080/api/users/" + userFound.id, {
                        method: "PATCH",
                        body: JSON.stringify({
                            // @ts-ignore
                            gamertag: gamertag.value,
                            // @ts-ignore
                            bio: bio.value,
                            // @ts-ignore
                            age: age.value,
                            // @ts-ignore
                            country: country.value,
                            // @ts-ignore
                            language: language.value,
                        }),
                        headers: {
                            "Content-type": "application/json; charset=UTF-8",
                        },
                    }).then((response) => {
                        if (response.status === 200) {
                            window.location.href = "/profile";
                        }
                    });
                });
            }
        });

        //Remove styling from inputs
        gamertag.className = "";
        age.className = "";
        country.className = "";
        language.className = "";
        bio.className = "";

        editConfirmWrapper.setAttribute("hidden", "true");
        editConfirmWrapper.setAttribute("hidden", "true");
        age.setAttribute("readonly", "true");
        country.setAttribute("readonly", "true");
        language.setAttribute("readonly", "true");
        gamertag.setAttribute("readonly", "true");
        bio.setAttribute("readonly", "true");
    }

    /*DISCARD CHANGES*/
    function discardChanges() {
        //sets the inputs to readonly
        const age = document
            .getElementById("user-info-age")
            .setAttribute("readonly", "true");
        const country = document
            .getElementById("user-info-country")
            .setAttribute("readonly", "true");
        const language = document
            .getElementById("user-info-language")
            .setAttribute("readonly", "true");
        const gamertag = document
            .getElementById("user-info-gamertag")
            .setAttribute("readonly", "true");
        const bio = document.getElementById("user-info-bio");
        const editConfirmWrapper = document.getElementById(
            "user-info-edit-confirm-wrapper"
        );
        editConfirmWrapper.setAttribute("hidden", "true");

        //refreshes the page
        window.location.href = "/profile";
    }

    //TODO Retreive photos and create the whole gallery section
</script>

<Navbar />

<div id="profile-page">
    <div id="left-panel">
        <h2>Folders</h2>
        <p>1. Horizon Forbidden West</p>
        <p>1. A very long title of a none existing gam, but just in case</p>
    </div>
    <div id="right-panel">
        <div id="user-info-wrapper">
            <div id="user-info-profile-image">
                <p>profile photo</p>
            </div>
            <div id="user-info-profile">
                <input id="user-info-nickname" readonly />
                <div id="extra-user-info-wrapper">
                    <input id="user-info-gamertag" value="Gamertag" readonly />
                    <input
                        id="user-info-age"
                        value="Age"
                        min="1"
                        max="100"
                        readonly
                    />
                    <input id="user-info-country" value="Country" readonly />
                    <input id="user-info-language" value="Languge" readonly />
                </div>
                <div id="user-info-bio-wrapper">
                    <textarea id="user-info-bio" readonly />
                </div>
            </div>
            <div id="user-info-edit-button-wrapper">
                <div id="user-info-edit-button">
                    <button on:click={editUserInfo}>Edit</button>
                </div>
                <div id="user-info-edit-confirm-wrapper" hidden>
                    <button on:click={discardChanges}>discard</button>
                    <button on:click={saveChanges}>save</button>
                </div>
            </div>
        </div>
    </div>
</div>
