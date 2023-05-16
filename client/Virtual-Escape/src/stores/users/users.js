import { writable } from "svelte/store";

// Get the initial user data from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));

// Initialize the user store with the stored user data, if any
const user = writable(storedUser);

// Subscribe to the user store to save any changes to localStorage
user.subscribe((currentUser) => {
    if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
        localStorage.removeItem("user");
    }
});

export { user };