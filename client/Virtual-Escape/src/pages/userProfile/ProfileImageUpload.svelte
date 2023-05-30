<script>
    export let previewImageSrc = "";
    export let profileImgUrl = "";
    export let isEditing = false;
    export let previewImage = () => {};
</script>

<div id="user-info-profile-image-wrapper">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img
        id="profile-image"
        alt="Image Preview"
        src={previewImageSrc || profileImgUrl}
    />
    <div id="label-wrapper">
        <label
            for="profile-image-input"
            class="button"
            id="label-image-upload-input"
            hidden={!isEditing}
        >
            Upload Image
            <input
                id="profile-image-input"
                type="file"
                name="file"
                accept="image/*"
                alt="Profile image"
                on:change={previewImage}
                disabled={!isEditing}
                hidden={!isEditing}
            />
        </label>
    </div>
</div>
