export async function logout() {

   await firebase.auth().signOut()
        .then(() => sessionStorage.clear());
}