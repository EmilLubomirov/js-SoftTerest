import {logout} from "../helpers/auth/logoutHelper.js";
import {isUserOrganizer, userHasNotLiked, getUserUsername} from "../helpers/user/userHelper.js";
import {getIdea, deleteIdea, updateIdea, getIdeasByUsername, getAllIdeasSorted} from "../helpers/ideas/ideasHelper.js";
import {loginHandler, registerUserHandler, createHandler, submitChanges} from "./eventHandlers.js";
import PATHS from "../paths.js";
import {showMessage} from "../helpers/base.js";

const redirect = (url) =>{

    location.href = url;
};

async function loadCommon() {

    return {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    };
}

function getState() {

    return {
        loggedIn: sessionStorage.getItem('hasLoggedIn'),
        username: sessionStorage.getItem('username'),
    }
}

const STORAGE = {
    GET_ITEM: (item) => sessionStorage.getItem(item),
    REMOVE_ITEM: (item) => sessionStorage.removeItem(item),
    SET_ITEM: (item, val) => sessionStorage.setItem(item, val)
};


export async function homeViewHandler() {

    this.partials = await loadCommon.call(this);
    const state = getState();

    if (state.loggedIn){

        state.ideas = await getAllIdeasSorted();
        this.partials.idea = await this.load('./templates/idea/idea.hbs');
        this.partials.ideas = await this.load('./templates/idea/ideas.hbs');
    }

    await this.partial('./templates/home/home.hbs', state);

    const TIMEOUT = 3000;

    if (STORAGE.GET_ITEM('isLoggingIn')){

        showMessage('Successfully logged user!', 'success', TIMEOUT);
        STORAGE.REMOVE_ITEM('isLoggingIn');
    }

    else if (STORAGE.GET_ITEM('isClosingTrek')){

        showMessage('Idea deleted successfully!', 'success', TIMEOUT);
        STORAGE.REMOVE_ITEM('isClosingTrek');
    }

    else if (STORAGE.GET_ITEM('commented')){

        showMessage('Idea commented successfully!', 'success', TIMEOUT);
        STORAGE.REMOVE_ITEM('commented');
    }

    else if (STORAGE.GET_ITEM('ideaCreated')){

        showMessage('Trek created successfully!', 'success', TIMEOUT);
        STORAGE.REMOVE_ITEM('ideaCreated');
    }

}

export async function aboutViewHandler() {

    this.partials = await loadCommon.call(this);
    this.partial('./templates/about/about.hbs', getState())
}

export async function loginViewHandler() {

    this.partials = await loadCommon.call(this);
    this.partials.loginForm = await this.load('./templates/login/loginForm.hbs');
    await this.partial('./templates/login/loginPage.hbs', getState());

    const loginBtn = document.querySelector('form#login button');
    loginBtn.addEventListener('click', loginHandler);

    if (STORAGE.GET_ITEM('loggingOut')){

        showMessage('Logout successfully!', 'success', 3000);
        STORAGE.REMOVE_ITEM('loggingOut');
    }

    if (STORAGE.GET_ITEM('isRegisteredLately')){

        showMessage('Registered successfully!', 'success', 3000);
        STORAGE.REMOVE_ITEM('isRegisteredLately');
    }
}

export async function registerViewHandler() {

    this.partials = await loadCommon.call(this);
    this.partials.registerForm = await this.load('./templates/register/registerForm.hbs');
    await this.partial('./templates/register/registerPage.hbs', getState());

    const registerBtn = document.querySelector('form button');
    registerBtn.addEventListener('click', registerUserHandler);
}

export async function logoutHandler() {

    await logout();
    STORAGE.SET_ITEM('loggingOut', 'true');
    redirect(PATHS.LOGIN);
}

export async function createViewHandler() {

    this.partials = await loadCommon.call(this);
    this.partials.createForm = await this.load('./templates/create/createForm.hbs');

    await this.partial('./templates/create/createPage.hbs', getState());

    const form = document.querySelector('form#create');
    const createBtn = form.querySelector('button');

    createBtn.addEventListener('click', await createHandler(form));
}

export async function ideaDetailsViewHandler() {

    const isLikeBtnPressed = STORAGE.GET_ITEM('likeBtnPressed');
    const isCommentBtnPressed = STORAGE.GET_ITEM('commentBtnPressed');

    if (!isLikeBtnPressed && !isCommentBtnPressed){

        showMessage('Loading....', 'loading', 1000);
    }

    this.partials = await loadCommon.call(this);

    const ideaId = location.hash.split(':')[1];
    const idea = await getIdea(ideaId);

    const {imageURL, description, title, likes, comments} = idea;

    const isOrganizer = isUserOrganizer(idea);
    const hasNotLiked = userHasNotLiked(idea);

    const specificData = {title, imageURL, description,
                            likes, isOrganizer, ideaId, hasNotLiked, comments};

    if (comments){

        this.partials.comments = await this.load('./templates/idea/ideaComments.hbs');
    }

    const state = Object.assign(getState(), specificData);
    await this.partial('./templates/idea/ideaDetails.hbs', state);

    if (isLikeBtnPressed){

        showMessage('Liked', 'success', 2000);
        STORAGE.REMOVE_ITEM('likeBtnPressed');
    }

    else if (isCommentBtnPressed){

        showMessage('Commented', 'success', 2000);
        STORAGE.REMOVE_ITEM('commentBtnPressed');
    }

    const formElement = document.querySelector('form#edit');

    if (formElement){

        document.querySelector('form#edit').addEventListener('submit', commentIdeaHandler);
    }
}

export async function editIdeaHandler() {

    this.partials = await loadCommon.call(this);
    this.partials.editForm = await this.load('./templates/edit/editForm.hbs');

    const ideId = location.hash.split(':')[1];

    const idea = await getIdea(ideId);
    const {imageURL, description, organizer, likes} = idea;

    const specificData = {

        imageURL,
        description,
        organizer,
        likes
    };

    const state = Object.assign(specificData, getState());

    await this.partial('./templates/edit/editPage.hbs', state);

    document.querySelector('form#edit')
                    .addEventListener('submit', await submitChanges(ideId));
}

export async function deleteTrekHandler() {

    const ideaId = location.hash.split(':')[1];

    await deleteIdea(ideaId);

    STORAGE.SET_ITEM('isClosingTrek', 'true');
    redirect('#/home');
}

export async function likeIdeaHandler() {

    const ideaId = location.hash.split(':')[1];
    const idea = await getIdea(ideaId);

    idea.likes++;

    await updateIdea(ideaId, idea);
    STORAGE.SET_ITEM('likeBtnPressed', 'true');

    redirect(`#/ideas/:${ideaId}`);
}

export async function profileViewHandler() {

    showMessage('Loading...', 'loading', 1000);

   this.partials = await loadCommon.call(this);
   this.partials.ideasTitle = await this.load('./templates/idea/ideasTitle.hbs');

   const username = getUserUsername();

   const ideas = await getIdeasByUsername(username);

    const specificData = {

        username,
        count: ideas.length,
        noIdeas: ideas.length === 0,
        ideas
    };

   const state = Object.assign(specificData, getState());

   this.partial('./templates/profile/profile.hbs', state);
}

export async function commentIdeaHandler() {

    const comment = document.querySelector('form#edit textarea').value;
    const commentator = getUserUsername();

    if (!comment){
        return;
    }

    const ideaId = location.hash.split(':')[1];
    const idea = await getIdea(ideaId);

    let comments = idea.comments || [];
    comments.push(`${commentator}: ${comment}`);

    idea.comments = comments;

    await updateIdea(ideaId, idea);

    sessionStorage.setItem('commentBtnPressed', 'true');

    redirect(`#/ideas/:${ideaId}`);
}