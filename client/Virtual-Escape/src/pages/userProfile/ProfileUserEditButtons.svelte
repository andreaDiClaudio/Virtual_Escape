<script>
    /*allows a component to emit events that can be listened to by its parent or other components*/
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let isEditing = false;

    function toggleEditMode() {
        isEditing = true;
        dispatch("toggleEditMode");
    }

    function discardChanges() {
        dispatch("discardChanges");
    }

    function saveChanges() {
        dispatch("saveChanges");
    }
</script>

<div id="user-info-edit-button-wrapper">
    <div>
        <button class="button" on:click={toggleEditMode}>Edit</button>
    </div>
    {#if isEditing}
        <div id="user-info-edit-confirm-wrapper">
            <button class="button" on:click={discardChanges}>Discard</button>
            <button class="button" on:click={saveChanges}>Save</button>
        </div>
    {/if}
</div>
