export async function doFetch(url, obj) {

    return fetch(url, obj);
}

export async function postRequest(url, dataObj) {

    const obj = {
        method: 'POST',
        body: JSON.stringify(dataObj)
    };

    return doFetch(url, obj);
}


export async function putRequest(url, dataObj) {

    const obj = {
        method: 'PUT',
        body: JSON.stringify(dataObj)
    };

    return doFetch(url, obj);
}

export async function deleteRequest(url) {

    const obj = {
        method: 'DELETE',
    };

    return doFetch(url, obj);
}