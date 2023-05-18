<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";

    titleStore.setTitle("Upload | VE");

    onDestroy(() => {
        titleStore.resetTitle();
    });
</script>

<Navbar />
<div id="upload-page">
    <div id="upload-window">
        <form
            action="http://127.0.0.1:8080/api/images"
            method="POST"
            enctype="multipart/form-data"
            id="upload-form"
        >
            <div id="upload-form-image-input">
                <input type="file" name="file" accept="image/*" />
            </div>
            <div id="upload-form-right-panel">
                <label id="upload-description-label"
                    >Description
                    <textarea id="upload-description-textarea" />
                </label>
                <label id="upload-label"
                    >Game
                    <select />
                </label>
                <div id="upload-submit-button">
                    <input type="submit" />
                </div>
            </div>
        </form>
    </div>
</div>
