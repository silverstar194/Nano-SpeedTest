export const convertCoordsToString = (location) => {
    return `${location.latitude},${location.longitude}`;
};

export const fetchWrapper = (url, options) => {
    return fetch(url, {
        ...options
    }).catch((err) => { // This only occurs if there is a connection error
        console.error(err);
        throw err;
    }).then((response) => {
        if (response.ok) return response.json(); //proceed normally
        // !OK means that it is a 400 or 500 so we treat it as an error and throw it
        throw response;
    });
};