// Select DOM elements to work with
const signInButton = document.getElementById('signIn');
const signOutButton = document.getElementById('signOut')
const editProfileButton = document.getElementById('editProfileButton');
const callApiButton = document.getElementById('callApiButton');

function welcomeUser(username) {
    signInButton.classList.add('d-none');
    signOutButton.classList.remove('d-none');
    editProfileButton.classList.remove('d-none');
    callApiButton.classList.remove('d-none');
}