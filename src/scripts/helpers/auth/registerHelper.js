import {clearInputFields, getFormData, isSomeDataEmpty} from "../base.js";

export default async function registerUser(formRef, inputNames) {

    const data = getFormData(formRef, inputNames);
    const {password, repeatPassword} = data;

    if (isSomeDataEmpty(data) || (password !== repeatPassword)){
        return false;
    }

    const email = data.email || data.username;

    let success = true;

   await firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => clearInputFields(formRef, inputNames))
        .catch(e => console.error(e));

    return success;
}