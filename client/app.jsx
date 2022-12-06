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

        loadMessages(`${channelSelect.value}`);
    });
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
                socket.on('memes', loadMessages);
                loadMessages('memes');
                break;
            case 'general':
                socket.off('memes');
                socket.off('songs');
                socket.on('general', loadMessages);
                loadMessages('general');
                break;
            default:
                socket.off('general');
                socket.off('memes');
                socket.on('songs', loadMessages);
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
                <p className="postedBy">Posted by: {message.postedBy} </p>
                <p className="message"> {message.messageText} </p>
                <p className="postedDate"> Posted On: {message.createdDate} </p>
            </div>
        );
    });

    return(
        <div className="messageList">
            {messageNodes}
        </div>
    );
}

const AdSpot = () => {
    const randomInt = Math.floor(Math.random() * 2) + 1;

    return(
        <img src={`assets/img/ads/hubsworthParodyAd${randomInt}.png`}></img>
    )
}

const LoadLogo = () => {
    return(
        <img id="hubText" src="/assets/img/hubsworthText.png" alt="logoText"></img>
    )
}

const LoadInstructions = () => {
    return(
        <div id="instructText">
            <h3>Welcome to Hubsworth, your one stop shop for social media gatherings.</h3>
            <p>Start by selecting a channel to send a message to, and anyone viewing the channel will see what you posted once they load onto the app.</p>
        </div>
    )
}

const loadMessages = async (channelName) => {
    const response = await fetch(`/getMessages?channel=${channelName}`);
    const data = await response.json();

    ReactDOM.render(
        <MessageList messages={data.messages} />,
        document.getElementById('oldMessages')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <LoadLogo />,
        document.getElementById('logo')
    );

    ReactDOM.render(
        <LoadInstructions />,
        document.getElementById('instructions')
    );

    ReactDOM.render(
        <AdSpot />,
        document.getElementById('adSpot')
    );

    handleEditBox();
    socket.on('general', loadMessages('general'));
    handleChannelSelect();
    
    loadMessages('general');
}

window.onload = init;