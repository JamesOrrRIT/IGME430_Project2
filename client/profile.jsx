const helper = require('./helper.js');

const handleUserContent = () => {
    const profileForm = document.getElementById('profileForm');
    const nicknameBox = document.getElementById('nickname');
    const bioBox = document.getElementById('bio');
    const colorSelect = document.getElementById('colorSelect');
    const profileMessage = document.getElementById('profileChange');

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if(nicknameBox.value == '' && bioBox.value == '') 
        {
            profileMessage.innerHTML = 'No changes to submit.';
            return;
        }

        helper.sendPost(e.target.action, {nickname: nicknameBox.value, bio: bioBox.value, colorPicker: colorSelect.value, _csrf}, (err) => {
            nicknameBox.value = '';
            bioBox.value = '';
            profileMessage.innerHTML = 'User settings changed.';    
        });
    })
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    handleUserContent();
}

window.onload = init;