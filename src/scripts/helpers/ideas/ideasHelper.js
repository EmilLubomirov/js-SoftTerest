import {doFetch, putRequest, deleteRequest} from "../requests/firebaseRequests.js";
import {getUserUsername} from "../user/userHelper.js";

const API_KEY = 'https://softunidemoproject.firebaseio.com/';

const getIdeasBaseURL = () =>{
    return API_KEY + `ideas.json?auth=${sessionStorage.getItem('token')}`;
};

const getIdeasFullURL = () =>{

    return API_KEY + `ideas/{id}.json?auth=${sessionStorage.getItem('token')}`;
};


export async function getAllIdeas() {

    let treks;

    await doFetch(getIdeasBaseURL())
        .then(response => response.json())
        .then(data =>{

            treks = data;
        });

    return treks;
}

export async function getAllIdeasSorted() {

    const ideas = await getAllIdeas();

    if (!ideas){
        return;
    }

    const sorted = {};

    Object.entries(ideas).sort((e1, e2) =>{

        return e2[1].likes - e1[1].likes;

    }).forEach(arr =>{

        const key = arr[0];
        sorted[key] = arr[1];
    });

    return sorted;
}

export async function getIdea(id) {

    const currentURL = getIdeasFullURL().replace('{id}', id);
    let idea;

    await doFetch(currentURL)
        .then(r => r.json())
        .then(data =>{

            idea = data;
        });

    return idea;
}

export async function updateIdea(ideaId, data) {

    const EDIT_URL = getIdeasFullURL().replace('{id}', ideaId);
    await putRequest(EDIT_URL, data).catch(e => console.error(e));
}

export async function deleteIdea(ideaId) {

    const DELETE_URL = getIdeasFullURL().replace('{id}', ideaId);
    await deleteRequest(DELETE_URL).catch(e => console.error(e));
}

export async function getIdeasByUsername(username) {

    const allIdeas = await getAllIdeas();
    let ideas = [];

    Object.values(allIdeas)
        .forEach(t => {

            if (t.organizer === username){

                ideas.push(t);
            }
        });

    return ideas;
}