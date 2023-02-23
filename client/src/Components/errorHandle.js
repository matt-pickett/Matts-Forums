export async function handleArrayRequest(response) {
    if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return null;
     }

     const data = await response.json();
     if (!data[0] || !data[0]._id) {
       return null;
    }
    return data;
}

export async function handleRequest(response) {
    // Bad API request (ex. 404 error)
    if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return null;
    }

    // Good API request but bad data (ex. CastError)
    const data = await response.json();
    if (!data || !data._id) {
        return null;
    }
    return data;
}
