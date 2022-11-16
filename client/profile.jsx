const helper = require('./helper.js');

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();
}

window.onload = init;