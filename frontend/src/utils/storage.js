export const Storage = {

    save(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    },

    load(key, defaultValue = null) {

        const value = localStorage.getItem(key);

        if (!value)
            return defaultValue;

        return JSON.parse(value);

    },

    remove(key) {

        localStorage.removeItem(key);

    },

    clear() {

        localStorage.clear();

    }

};