export function normalizeEmail(email) {

    return email.trim().toLowerCase();

}

export function randomId() {

    return crypto.randomUUID();

}

export function sleep(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

export function truncate(text, length = 60) {

    if (!text)
        return "";

    if (text.length <= length)
        return text;

    return text.slice(0, length) + "...";

}