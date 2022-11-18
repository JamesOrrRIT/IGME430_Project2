const helper = require('./helper.js');

const handleUserContent = (e) => {
    e.preventDefault();

    const nicknameBox = e.target.querySelector('#nickname').value;
    const bioBox = e.target.querySelector('#bio').value;
    const colorSelect = e.target.querySelector('#colorSelect').value;
    //const profileMessage = e.target.querySelector('#profileChange');

    const _csrf = e.target.querySelector('#_csrf').value;

    if(nicknameBox == '' && bioBox == '') 
    {
        return;
    }

    helper.sendPost(e.target.action, {nickname: nicknameBox.value, bio: bioBox.value, colorPicker: colorSelect.value, _csrf});
    console.log(nicknameBox, bioBox, colorSelect);

    return false;
}

const Profile = (props) => {
    console.log(props.csrf)
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

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(<Profile csrf={data.csrfToken} />,
        document.getElementById('content'));
}

window.onload = init;