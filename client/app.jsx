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
    messageDiv.id = 'messageElement';
    messageDiv.innerText = msg;
    //Set up div with the user name and message
    //
    document.getElementById('messages').appendChild(messageDiv);
};

const handleChannelSelect = () => {
    const channelSelect = document.getElementById('channelSelect');
    const messages = document.getElementById('newMessages');

    channelSelect.addEventListener('change', () => {
        messages.innerHTML = '';

        switch(channelSelect.value) {
            case 'memes':
                socket.off('general');
                socket.off('songs');
                socket.on('memes', displayMessage);
                loadMessages('memes');
                break;
            case 'general':
                socket.off('memes');
                socket.off('songs');
                socket.on('general', displayMessage);
                loadMessages('general');
                break;
            default:
                socket.off('general');
                socket.off('memes');
                socket.on('songs', displayMessage);
                loadMessages('songs');
                break;
        }
    });
}

const MessageList = (props) => {
    if(props.messages.length === 0)
    {
        return (
            <div className="messageList">
                <h3 className="empty">Nothing has been posted yet.</h3>
            </div>
        );
    }

    const messageNodes = props.messages.map(message => {
        return (
            <div key = {message._id} id="messageElement">
                <p className="postedBy"> {message.postedBy} </p>
                <p className="message"> {message.messageText} </p>
            </div>
        );
    });

    return(
        <div className="messageList">
            {messageNodes}
        </div>
    );
}

const loadMessages = async (channelName) => {
    const response = await fetch(`/getMessages?channel=${channelName}`);
    const data = await response.json();
    console.log(data);

    ReactDOM.render(
        <MessageList messages={data.messages} />,
        document.getElementById('oldMessages')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    handleEditBox();
    socket.on('general', displayMessage);
    handleChannelSelect();
    
    loadMessages('general');

    //Load random ad from folder
    let imageElem = document.createElement('img');
    const randomInt = Math.floor(Math.random() * 2) + 1;
    imageElem.setAttribute('src', `assets/img/ads/hubsworthParodyAd${randomInt}.png`);
    document.getElementById('adSpot').appendChild(imageElem);
}

window.onload = init;