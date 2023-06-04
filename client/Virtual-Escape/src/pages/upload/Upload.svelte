<script>
    import Navbar from "../../components/navbar/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import toastr from "toastr";
    import { navigate } from "svelte-navigator";

    /*Variables for binding values*/
    let imageInputDisplay = "none";
    let uploadIconDisplay = "initial";
    let previewSrc = "";
    let uploadIconColor = "";
    let imageInput;

    /*Set the tab title*/
    titleStore.setTitle("Upload | VE");

    onMount(() => {
        uploadIconColor = "#e7793e";
    });

    onDestroy(() => {
        titleStore.resetTitle();
    });

    /*Handle the submit*/
    function handleSubmit(event) {
        // Check if a file is selected
        // @ts-ignore
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        formData.append("is_profile_img", "0");
        if (!previewSrc || previewSrc === "") {
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

        /*Post*/
        fetch("http://localhost:8080/api/images", {
            method: "POST",
            body: formData,
            credentials: "include",
        }).then((response) => {
            if (response.status == 200) {
                navigate("/profile");
            }
        });
    }

    /*Preview Image*/
    //shows a preview of the uploaded image
    function previewImage(event) {
        imageInputDisplay = "none";
        uploadIconDisplay = "none";

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
</script>

<Navbar {uploadIconColor} />
<div id="upload-page">
    <div id="upload-window">
        <form
            id="upload-form"
            on:submit|preventDefault={(event) => handleSubmit(event)}
        >
            <div id="upload-form-image-input">
                <input
                    id="image-input"
                    bind:value={imageInput}
                    type="file"
                    name="file"
                    accept="image/*"
                    alt="Image to upload"
                    on:change={previewImage}
                    style="display: {imageInputDisplay};"
                />
                <label
                    for="image-input"
                    class="fas fa-upload"
                    id="upload-upload-icon"
                    style="display: {uploadIconDisplay};"
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
                <label id="upload-description-label">
                    Description
                    <textarea
                        id="upload-description-textarea"
                        name="description"
                        maxlength="254"
                    />
                </label>
                <label id="upload-label">
                    Game
                    <input type="text" name="game" />
                </label>
                <div id="upload-submit-button">
                    <button class="button" type="submit"> Upload </button>
                </div>
            </div>
        </form>
    </div>
</div>
