<script>
    import { user } from "../../stores/users/users.js";

    /*Log out*/
    function handleLogOut() {
        fetch("http://localhost:8080/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 200) {
                user.set(null);
                localStorage.removeItem("user");
                localStorage.removeItem("selectedAccount");
                window.location.href = "/";
            }
        });
    }

    /*Delete account*/
    function handleDeleteAccount() {
        if (
            !confirm(
                "Are you sure you want to delete this account? The operation is irreversible"
            )
        ) {
            return;
        }
        const user = JSON.parse(localStorage.getItem("user"));

        fetch("http://localhost:8080/api/users/" + user.email, {
            method: "DELETE",
            credentials: "include",
        }).then((resposnse) => {
            if (resposnse.status === 200) {
                localStorage.removeItem("user");
                localStorage.removeItem("selectedAccount");
                window.location.href = "/goodbye";
            }
        });
    }
</script>

<div id="background-overlay">
    <div class="settings-popup-window" style="display: flex;">
        <div id="buttons-container">
            <button class="settings-popup-button">Contact us</button>
            <button class="settings-popup-button" on:click={handleDeleteAccount}
                >Delete account</button
            >
            <button on:click={handleLogOut} class="settings-popup-button"
                >Log out</button
            >
        </div>
    </div>
</div>
