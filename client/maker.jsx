const helper = require('./helper.js');
const socket = io();

const handleEditBox = () => {
    const editForm = document.getElementById('editForm');
    const editBox = document.getElementById('editBox');
    const channelSelect = document.getElementById('channelSelect');

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        helper.hideError();

        if(editBox.value == '') {
            helper.handleError('Fill in the field before submitting, please.');
            return false;
        }

        else {
            const data = {
                message: editBox.value,
                channel: channelSelect.value,
            }

            socket.emit('chat message', data);
            editBox.value = '';
        }
    });
};

const displayMessage = (msg) => {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = msg;
    //Set up div with the user name and message
    //
    document.getElementById('messages').appendChild(messageDiv);
};

const handleChannelSelect = () => {
    const channelSelect = document.getElementById('channelSelect');
    const messages = document.getElementById('messages');

    channelSelect.addEventListener('change', () => {
        messages.innerHTML = '';

        switch(channelSelect.value) {
            case 'memes':
                socket.off('general');
                socket.off('songs');
                socket.on('memes', displayMessage);
                break;
            case 'general':
                socket.off('memes');
                socket.off('songa');
                socket.on('general', displayMessage);
                break;
            default:
                socket.off('general');
                socket.off('memes');
                socket.on('songs', displayMessage);
                break;
        }
    });
}

const loadMessages = async () => {
    //Will load the messages from the server based on the channel being submitted to
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    handleEditBox();
    socket.on('general', displayMessage);
    handleChannelSelect();
    
    loadMessages();
}

window.onload = init;