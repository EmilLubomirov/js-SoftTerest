import {getFormData, isSomeDataEmpty, clearInputFields} from "../base.js";
import {postRequest} from "../requests/firebaseRequests.js";

const API_KEY = 'https://softunidemoproject.firebaseio.com/';
let success = true;

const getIdeasBaseURL = () =>{

    return API_KEY + `ideas.json?auth=${sessionStorage.getItem('token')}`;
};


const consoleError = (e) => {
    success = false;
    console.error(e);
};

export async function createIdea(formRef, inputNames) {

    const data = getFormData(formRef, inputNames);

    if (isSomeDataEmpty(data)){
        return false;
    }

    success = true;

    const {description, imageURL, title} = data;
    const organizer = sessionStorage.getItem('username');

    const likes = 0;

    const idea = {
        title,
        description,
        imageURL,
        likes,
        organizer,
    };

    await postRequest(getIdeasBaseURL(), idea)
       .then(() => clearInputFields(formRef, inputNames))
        .catch(consoleError);

    return success;
}