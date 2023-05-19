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
            credentials: "include",
        }).then((response) => {
            if (response.status == 200) {
                window.location.href = "/home";
            }
        });
    }

    //TODO on chage to display the image preview
    let previewSrc = "";

    function previewImage(event) {
        const imageInputButton = document.getElementById("image-input");

        imageInputButton.style.display = "none";

        const imageInput = event.target;
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // @ts-ignore
                previewSrc = e.target.result;
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            previewSrc = "";
        }
    }

    //TODO polishing and commments
</script>

<Navbar />
<div id="upload-page">
    <div id="upload-window">
        <form
            id="upload-form"
            on:submit|preventDefault={(event) => handleSubmit(event)}
        >
            <div id="upload-form-image-input">
                <input
                    id="image-input"
                    type="file"
                    name="file"
                    accept="image/*"
                    required
                    on:change={previewImage}
                />
                {#if previewSrc}
                    <div id="image-preview-wrapper">
                        <!-- svelte-ignore a11y-img-redundant-alt -->
                        <img
                            id="image-preview"
                            src={previewSrc}
                            alt="Image Preview"
                        />
                    </div>
                {/if}
            </div>

            <div id="upload-form-right-panel">
                <h1 id="form-right-panel-title">Details</h1>
                <label id="upload-description-label"
                    >Description
                    <textarea
                        id="upload-description-textarea"
                        name="description"
                        maxlength="254"
                    />
                </label>
                <label id="upload-label"
                    >Game
                    <select name="game">
                        <option disabled>Choose game</option>
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
