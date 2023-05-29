<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import toastr from "toastr";

    titleStore.setTitle("Upload | VE");

    onMount(() => {
        document.getElementById("upload-icon").style.color = "#e7793e";
    });

    onDestroy(() => {
        titleStore.resetTitle();
    });

    function handleSubmit(event) {
        const fileInput = document.getElementById("image-input");

        // Check if a file is selected
        // @ts-ignore
        if (!fileInput.files || fileInput.files.length === 0) {
            toastr.options = {
                closeButton: false,
                debug: false,
                newestOnTop: false,
                progressBar: false,
                positionClass: "toast-top-center",
                preventDuplicates: true,
                onclick: null,
                hideDuration: 500,
                timeOut: 3000,
                extendedTimeOut: 1000,
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
                showDuration: 300,
            };
            toastr["warning"](
                "Please select an image to upload in the left side of the window."
            );
        }

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
        // Hide the image input button
        document.getElementById("image-input").style.display = "none";
        document.getElementById("upload-upload-icon").style.display = "none";

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
                    on:change={previewImage}
                    style="display: none;"
                />
                <label
                    for="image-input"
                    class="fas fa-upload"
                    id="upload-upload-icon"
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
                    <button class="button" type="submit"> Upload </button>
                </div>
            </div>
        </form>
    </div>
</div>
