const helper = require('./helper.js');

const handleUserContent = (e) => {
    e.preventDefault();

    const nicknameBox = e.target.querySelector('#nickname').value;
    const bioBox = e.target.querySelector('#bio').value;
    const colorSelect = e.target.querySelector('#colorSelect').value;

    const _csrf = e.target.querySelector('#_csrf').value;

    if(nicknameBox == '' && bioBox == '') 
    {
        return;
    }

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
            <input id="nickname" type="text" placeholder="Nickname" />
            <input id="bio" type="text" placeholder="Bio" />
            <input id="colorSelect" type="color" />
            <input className="profileSubmit" type="submit" value="Save Changes"/>
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
            <input id="newPass" type="password" placeholder="New Password" />
            <input id="confirmPass" type="password" placeholder="Confirm Password"/>
            <input id="passwordUpdate" type="submit" value="Update"/>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf}/>
        </form>
    );
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

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