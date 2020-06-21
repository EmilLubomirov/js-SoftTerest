import {getFormData, clearInputFields, isSomeDataEmpty} from "../base.js";

export async function signIn(formRef, inputNames) {

    const data = getFormData(formRef, inputNames);
    const {password} = data;

    if (isSomeDataEmpty(data)){
        return false;
    }

    const email = data.email || data.username;

    let success = false;

   await  firebase.auth().signInWithEmailAndPassword(email, password)
       .then(response =>{

           firebase.auth().currentUser.getIdToken().then(token =>{

               sessionStorage.setItem('token', token);
               sessionStorage.setItem('hasLoggedIn', 'true');
               sessionStorage.setItem('username', response.user.email);
               success = true;
           });
       })
        .then(() => clearInputFields(formRef, inputNames))
        .catch(e => console.error(e));

    return success;
}