import { writable } from 'svelte/store';

const defaultTitle = 'Virtual Escape';

//create a custom store for maniging the tabtitle
function createTitleStore() {
    const { subscribe, set } = writable(defaultTitle);

    return {
        subscribe,
        setTitle: (newTitle) => set(newTitle),
        resetTitle: () => set(defaultTitle),
    };
}

export const titleStore = createTitleStore();