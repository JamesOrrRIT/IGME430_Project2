const helper = require('./helper.js');

const handleUserContent = (e) => {
    e.preventDefault();

    const nicknameBox = e.target.querySelector('#nickname').value;
    const bioBox = e.target.querySelector('#bio').value;
    const colorSelect = e.target.querySelector('#colorSelect').value;

    const _csrf = e.target.querySelector('#_csrf').value;

    const data = {nickname: nicknameBox, bio: bioBox, colorPicker: colorSelect, _csrf};
    helper.sendPost(e.target.action, data);

    return false;
}

const updatePassword = (e) => {
    e.preventDefault();

    const newPass = e.target.querySelector('#newPass').value;
    const confirmPass = e.target.querySelector('#confirmPass').value;

    const _csrf = e.target.querySelector('#_csrf').value;

    const data = {password: newPass, confirm: confirmPass, _csrf};
    helper.sendPost(e.target.action, data);

    return false;
}

const Profile = (props) => {
    return (
        <form id="profileForm"
        name="profileForm"
        onSubmit={handleUserContent}
        action="/profile"
        method="POST"
        className="profileForm"
        >
            <p>Tell us a little bit about yourself. You can set yourself a custom nickname and write a little bio right here. You can even set a color for your text to be displayed in.</p>
            <div id="lineBreak">
                <input id="nickname" type="text" placeholder="Nickname" maxLength="32" />
            </div>
            <div id="lineBreak">
                <input id="bio" type="text" placeholder="Bio" />
            </div>
            <div id="lineBreak">
                <input id="colorSelect" type="color" />
                <input className="profileSubmit" type="submit" value="Save Changes"/>
            </div>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
        </form>
    );
};

const PasswordChange = (props) => {
    return (
        <form id="passwordChange"
        name="passwordChange"
        onSubmit={updatePassword}
        action="/update"
        method="POST"
        className="passwordUpdate"
        >
            <p>Use these boxes to reset your password. Make sure to have it written down somewhere and keep it secure.</p>
            <div id="lineBreak">
                <input id="newPass" type="password" placeholder="New Password" />
            </div>
            <div id="lineBreak">
                <input id="confirmPass" type="password" placeholder="Confirm Password"/>
            </div>
            <div id="lineBreak">
                <input id="passwordUpdate" type="submit" value="Update"/>
            </div>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
        </form>
    );
};

const AdSpot = () => {
    const randomInt = Math.floor(Math.random() * 2) + 1;

    return(
        <img src={`assets/img/ads/hubsworthParodyAd${randomInt}.png`}></img>
    )
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <AdSpot />,
        document.getElementById('adSpot')
    );

    ReactDOM.render(
        <Profile csrf={data.csrfToken} />,
        document.getElementById('profileChange')
    );

    ReactDOM.render(
        <PasswordChange csrf={data.csrfToken} />,
        document.getElementById('passwordChange')
    );
}

window.onload = init;