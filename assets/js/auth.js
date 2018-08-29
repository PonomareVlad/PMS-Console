import * as workspace from './workspace.js';

let template = {};

window.auth = {logout: logout};

export function check() {
    return io('console/getUserData').then(function (response) {
        if (response.status) saveUserData(response);
        return response.status;
    });
}

export function send(login, password) {
    // auth.loginSection.classList.toggle('incorrect-data', false);
    return new Promise(function (resolve, reject) {
        if (!login || login === '') return resolve(loginError('empty_login', 'login'));
        if (!login || password === '') return resolve(loginError('empty_password', 'password'));
        showItemLoadIndicator('auth', 'login-button');
        let data = {login: login, password: password};
        return resolve(io('console/auth', data));
    });
}


function loginError(message, type) {
    // return new Promise(function (resolve, reject) {
    let authLogin = document.getElementById('auth-login');
    let loginMessage = document.getElementById('auth-login-message');
    let authPassword = document.getElementById('auth-password');
    let passwordMessage = document.getElementById('auth-password-message');
    if (type) switch (type) {
        case 'login':
            switch (message) {
                case 'empty_login':
                    loginMessage.innerText = 'Необходимо ввести ваш логин';
                    break;
            }
            authLogin.classList.toggle('highlight', true);
            break;
        case 'password':
            switch (message) {
                case 'empty_password':
                    passwordMessage.innerText = 'Необходимо ввести ваш пароль';
                    break;
                case 'incorrect_data':
                    passwordMessage.innerText = 'Указан неверный пароль';
                    break;
            }
            authPassword.classList.toggle('highlight', true);
            break;
        case 'all':
            switch (message) {
                case 'bad_parameters':
                    loginMessage.innerText = 'Необходимо ввести ваш логин';
                    passwordMessage.innerText = 'Необходимо ввести ваш пароль';
                    break;
            }
            authLogin.classList.toggle('highlight', true);
            authPassword.classList.toggle('highlight', true);

    }
    hideItemLoadIndicator('auth', 'login-button');
    setProgress('auth-button', false);
    auth.loginSection.classList.toggle('incorrect-data', true);
    setTimeout(function () {
        auth.loginSection.classList.toggle('incorrect-data', false);
    }, 500);
    console.log(message ? message : type);
    return false;// resolve(false);
    // });
}

export function showLogin() {
    if (!template.login) return workspace.loadTemplate('login')
        .then(function (response) {
            if (!response) return 'Не удалось загрузить страницу';
            return template.login = response;
        }).then(workspace.render).then(prepareLogin); else
        return workspace.render(template.login)
            .then(prepareLogin);
}

function prepareLogin() {
    if (pms.currentHost) {
        if (pms.currentHost.title && document.getElementById('host-name')) document.getElementById('host-name').innerText = pms.currentHost.title;
        if (pms.currentHost.logo && document.getElementById('host-logo')) document.getElementById('host-logo').src = pms.currentHost.logo;
        if (pms.currentHost.homePage && document.getElementById('home-page')) document.getElementById('home-page').href = pms.currentHost.homePage;
    }
    if (document.getElementById('login-section')) auth.loginSection = document.getElementById('login-section');
    if (document.getElementById('auth-button')) document.getElementById('auth-button').addEventListener('click', function () {
        if (isProgress('auth-button')) return false;
        if (!document.getElementById('auth-login') || !document.getElementById('auth-password')) return false;
        document.getElementById('auth-login').classList.toggle('highlight', false);
        document.getElementById('auth-login-message').innerText = '';
        document.getElementById('auth-password').classList.toggle('highlight', false);
        document.getElementById('auth-password-message').innerText = '';
        setProgress('auth-button');
        showLoadingIndicator();
        return send(document.getElementById('auth-login').value, document.getElementById('auth-password').value).then(function (response) {
            if (!response) return false;
            if (!response.status) return loginError('incorrect_data', 'password');
            if (response.token) {
                localStorage.setItem('token', response.token);
                /*if (pms.config.isFramed) window.parent.postMessage({
                    status: true,
                    set: 'token',
                    data: response.token
                }, '*');*/
            }
            pms.onLeavePage.push(function () {
                hideItemLoadIndicator('auth', 'login-button');
            });
            saveUserData(response);
            return workspace.prepare();
        }).then(hideLoadingIndicator).then(function () {
            return setProgress('auth-button', false);
        });
    });
    return true;
}

function saveUserData(response) {
    if (!response || !response.status) return false;
    pms.userData = {};
    if (response.userId) pms.userData.id = response.userId;
    if (response.login) pms.userData.login = response.login;
    if (response.email) pms.userData.email = response.email;
    if (response.firstname) pms.userData.firstname = response.firstname;
    if (response.lastname) pms.userData.lastname = response.lastname;
    if (response.avamoji) pms.userData.avamoji = response.avamoji;

    let OneSignal = window.OneSignal || [];
    OneSignal.push(["init", {
        appId: "d6d3da7e-593f-4b75-a598-a5d4b27e31e6",
        autoRegister: true,
        notifyButton: {
            enable: false,
        },
        promptOptions: {
            actionMessage: "Уведомим о важных событиях связанных с сайтом, продвижением страниц и других изменениях",
            acceptButtonText: "Получать",
            cancelButtonText: "Отказаться"
        }
    }]);
    return true;
}

function logout() {
    return io('console/logout').then(function (response) {
        if (response && response.status) {
            window.pms = {
                config: pms.config
            };
            localStorage.clear();
            return showLogin();
        } else alert('Произошла ошибка');
    })
}