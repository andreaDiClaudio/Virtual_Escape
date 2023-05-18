<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { user } from "../../stores/users/users.js";
    import { navigate } from "svelte-navigator";
    titleStore.setTitle("Upload | VE");

    onDestroy(() => {
        titleStore.resetTitle();
    });

    function handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const file = document.getElementById("image");

        fetch("http://localhost:8080/api/images", {
            method: "POST",
            body: formData,
            credentials: "include"
        }).then((response) => {
            if (response.status == 200) {
                window.location.href = "/home";
            }
        });
    }
</script>

<Navbar />
<h1>Welcome, {$user.nickname}!</h1>
<div id="upload-page">
    <div id="upload-window">
        <form
            id="upload-form"
            on:submit|preventDefault={(event) => handleSubmit(event)}
        >
            <div id="upload-form-image-input">
                <input
                    id="image"
                    type="file"
                    name="file"
                    accept="image/*"
                    required
                />
            </div>
            <div id="upload-form-right-panel">
                <label id="upload-description-label"
                    >Description
                    <textarea
                        id="upload-description-textarea"
                        name="description"
                    />
                </label>
                <label id="upload-label"
                    >Game
                    <select name="game">
                        <option>Game 1</option>
                    </select>
                </label>
                <div id="upload-submit-button">
                    <button type="submit"> Upload </button>
                </div>
            </div>
        </form>
    </div>
</div>
