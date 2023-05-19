<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { user } from "../../stores/users/users.js";

    titleStore.setTitle("Profile | VE");

    onDestroy(() => {
        titleStore.resetTitle();
    });
    //TODO make all the fields as input but style them as not making it read only. when the user press edit, the inputs become not readonly and have a styling similar to input.

    function editUserInfo() {
        //const profileImage TODO as last

        //show the button 'save changes'
        //show the button 'discard changes'

        //save elements
        const age = document.getElementById("user-info-age");
        const country = document.getElementById("user-info-country");
        const language = document.getElementById("user-info-language");
        const gamertag = document.getElementById("user-info-gamertag");
        const bio = document.getElementById("user-info-bio");
        const editConfirmWrapper = document.getElementById(
            "user-info-edit-confirm-wrapper"
        );

        //remove readonly attribute
        age.removeAttribute("readonly");
        country.removeAttribute("readonly");
        language.removeAttribute("readonly");
        gamertag.removeAttribute("readonly");
        bio.removeAttribute("readonly");
        //remove hidden attribute
        editConfirmWrapper.removeAttribute("hidden");
    }

    //Save Changes
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

        // TODO query attributes to db and refresh. at the moment like this for testing
        // @ts-ignore
        const newAge = age.value;
        // @ts-ignore
        const newCountry = country.value;
        // @ts-ignore
        const newLanguage = language.value;
        // @ts-ignore
        const newGamertag = gamertag.value;
        // @ts-ignore
        const newBio = bio.value;
        // @ts-ignore

        editConfirmWrapper.setAttribute("hidden", "true");
        editConfirmWrapper.setAttribute("hidden", "true");
        age.setAttribute("readonly", "true");
        country.setAttribute("readonly", "true");
        language.setAttribute("readonly", "true");
        gamertag.setAttribute("readonly", "true");
        bio.setAttribute("readonly", "true");
    }

    //Discard Changes
    function discardChanges() {
        //save attributes
        const age = document.getElementById("user-info-age");
        const country = document.getElementById("user-info-country");
        const language = document.getElementById("user-info-language");
        const gamertag = document.getElementById("user-info-gamertag");
        const bio = document.getElementById("user-info-bio");
        const editConfirmWrapper = document.getElementById(
            "user-info-edit-confirm-wrapper"
        );

        editConfirmWrapper.setAttribute("hidden", "true");
        age.setAttribute("readonly", "true");
        country.setAttribute("readonly", "true");
        language.setAttribute("readonly", "true");
        gamertag.setAttribute("readonly", "true");
        bio.setAttribute("readonly", "true");
    }
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
                <input
                    id="user-info-nickname"
                    value={$user.nickname}
                    readonly
                />
                <div id="extra-user-info-wrapper">
                    <input id="user-info-gamertag" value="Gamertag" readonly />
                    <p>•</p>
                    <input id="user-info-age" value="Age" readonly />
                    <p>•</p>
                    <input id="user-info-country" value="Country" readonly />
                    <p>•</p>
                    <input id="user-info-language" value="Languge" readonly />
                </div>
                <div id="user-info-bio-wrapper">
                    <textarea id="user-info-bio" placeholder="bio" readonly />
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
