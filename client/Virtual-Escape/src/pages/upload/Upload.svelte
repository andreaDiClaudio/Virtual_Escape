<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    titleStore.setTitle("Upload | VE");

    onDestroy(() => {
        titleStore.resetTitle();
    });

    function handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const file = document.getElementById("image");

        formData.append("is_profile_img", "0");

        fetch("http://localhost:8080/api/images", {
            method: "POST",
            body: formData,
            credentials: "include",
        }).then((response) => {
            if (response.status == 200) {
                window.location.href = "/profile";
            }
        });
    }

    let previewSrc = "";
    // Function to handle the preview of an image
    function previewImage(event) {
        const imageInputButton = document.getElementById("image-input");

        // Hide the image input button
        imageInputButton.style.display = "none";

        // Get the image input from the event target
        const imageInput = event.target;

        // Check if there are files and if the first file is an image
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            // Set the onload function for the reader
            reader.onload = (e) => {
                // @ts-ignore
                // Set the preview source to the result of the file read
                previewSrc = e.target.result;
            };

            // Read the image file as a data URL
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            // If no image file, set the preview source to an empty string
            previewSrc = "";
        }
    }
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
                    alt="Image to upload"
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
                    <input type="text" name="game" />
                </label>
                <div id="upload-submit-button">
                    <button type="submit"> Upload </button>
                </div>
            </div>
        </form>
    </div>
</div>
