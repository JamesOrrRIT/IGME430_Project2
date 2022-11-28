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
            <div key = {message._id} className="message">
                <h2 className="username"> {message.postedBy} </h2>
                <h2 className="message"> {message.messageText} </h2>
                <h2 className="createdDate"> {message.createdDate} </h2>
            </div>
        );
    });

    return(
        <div className="messageList">
            {messageNodes}
        </div>
    );
}

const loadMessages = async () => {
    const response = await fetch('/getMessages');
    const data = await response.json();
    ReactDOM.render(
        <MessageList messages={data.messages} />,
        document.getElementById('messages')
    );
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