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
                    <input id="user-info-age" value="Age" readonly />
                    <p>•</p>
                    <input id="user-info-country" value="Country" readonly />
                    <p>•</p>
                    <input id="user-info-language" value="Languge" readonly />
                    <p>•</p>
                    <input id="user-info-gamertag" value="Gamertag" readonly />
                </div>
                <div id="user-info-bio-wrapper">
                    <textarea id="user-info-bio" placeholder="bio" />
                </div>
            </div>
            <div id="user-info-edit-button">
                <button>Edit</button>
            </div>
        </div>
    </div>
</div>
