export const getUserUsername = () => sessionStorage.getItem('username');

export function isUserOrganizer(trek) {

    const loggedInUser = sessionStorage.getItem('username');
    return trek.organizer === loggedInUser;
}


export function userHasNotLiked(trek) {

    const peopleWhoLikedIt = trek.peopleWhoLikedIt;

    if (!peopleWhoLikedIt){
        return true;
    }

    const username = sessionStorage.getItem('username');
    return !(peopleWhoLikedIt.some(u => u === username));
}