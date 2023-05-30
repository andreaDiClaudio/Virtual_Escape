<script>
    export let isEditing = false;
    export let gamertagValue = "";
    export let ageValue = "";
    export let countryValue = "";
    export let languageValue = "";
    export let bioValue = "";
    export let user;
    export let ageId = "user-info-age";
    export let countryId = "user-info-country";
    export let languageId = "user-info-language";
    export let gamertagId = "user-info-gamertag";
    export let bioId = "user-info-bio";
</script>

<div id="user-info-profile">
    <input id="user-info-nickname" value="@{$user.nickname}" disabled />
    <div id="extra-user-info-wrapper">
        <input
            id={gamertagId}
            readonly={!isEditing}
            disabled={!isEditing}
            placeholder={!isEditing ? "" : "gamertag"}
            bind:value={gamertagValue}
        />
        <input
            id={ageId}
            min="1"
            max="100"
            readonly={!isEditing}
            disabled={!isEditing}
            placeholder={!isEditing ? "" : "age"}
            bind:value={ageValue}
        />
        <input
            id={countryId}
            bind:value={countryValue}
            readonly={!isEditing}
            disabled={!isEditing}
            placeholder={!isEditing ? "" : "country"}
        />
        <input
            id={languageId}
            bind:value={languageValue}
            readonly={!isEditing}
            disabled={!isEditing}
            placeholder={!isEditing ? "" : "language"}
        />
    </div>
    <div id="user-info-bio-wrapper">
        <textarea
            maxlength="255"
            id={bioId}
            bind:value={bioValue}
            readonly={!isEditing}
            disabled={!isEditing}
            placeholder={!isEditing ? "" : "bio"}
        />
    </div>
</div>
