import * as workspace from './workspace.js';
import * as auth from './auth.js';

window.pms = {
    config: {
        apiUrl: 'https://cms.prakula.ru/api/v1/',
        name: 'PRakula CMS',
        icon: '/pms-console/assets/images/logo.small.png'
    }
};
window.io = io;
window.oldIo = oldIo;
window.initApp = initApp;
// require('../css/style.css');

window.addEventListener('load', function () {
    pms.config.isFramed = false;
    try {
        pms.config.isFramed = window != window.top || document != top.document || self.location != top.location;
    } catch (e) {
        pms.config.isFramed = true;
    }
    if (pms.config.isFramed) {
        window.addEventListener('message', function (event) {
            if (window.initTimeout) clearTimeout(window.initTimeout);
            delete window.initTimeout;
            if (typeof event.data === 'object') window.pmsHostData = event.data;
            initApp();
        });
        window.initTimeout = setTimeout(function () {
            initApp();
        }, 1000);
        window.parent.postMessage({status: true, get: 'pmsHostData'}, '*');
    } else initApp();
});

function initApp() {
    if (window.pmsHostData) pms.currentHost = window.pmsHostData;
    // console.debug(pms);
    return auth.check().then(function (response) {
        if (response) {
            return workspace.prepare();
        } else {
            return auth.showLogin();
        }
    });
}

function oldIo(method, data, post, url, plainData) {
    url = url ? url : (pms.config.apiUrl ? pms.config.apiUrl : '/api/') + method;
    if (!post) {
        data = data ? data : '';
        if (typeof data === 'object') data = Object.keys(data).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
        }).join('&');
    }
    if (method) {
        let token = localStorage.getItem('token') ?
            localStorage.getItem('token') : false;
        /*(pms.currentHost ?
            (pms.currentHost.token ? pms.currentHost.token : false) :
            false);*/
        if (token) {
            if (post) data['_token'] = token; else data += (data !== '' ? '&' : '') + '_token=' + token;
        }
    }
    if (data !== '' && !post) url += '?' + data;
    let parameters = {
        method: (post ? 'POST' : 'GET'),
        mode: 'cors',
        credentials: 'include'
    };
    if (post) parameters.body = JSON.stringify(data);
    return fetch(url, parameters).then(function (response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            return plainData ? false : {'status': false, 'error': response.statusText};
        }
    }).then(function (response) {
        if (!response) return response;
        if (plainData) return response.text(); else return response.json();
    }).catch(function (response) {
        let debugData = ['Response parse error'];
        if (response.message) debugData.push(response.message);
        if (method) debugData.push(method);
        if (data !== '') debugData.push(method ? decodeURIComponent(data) : decodeURIComponent(url));
        console.debug.apply(this, debugData);
        return {'status': false, 'error': 'Response parse error'};
    }).then(function (response) {
        if (!response || response.error) return response;
        let debugData = [response.offline ? 'Offline mode' : 'Request successful'];
        if (method) debugData.push(method);
        if (data !== '') debugData.push(method ? decodeURIComponent(data) : decodeURIComponent(url));
        debugData.push(response);
        console.debug.apply(this, debugData);
        if (response.offline) initOfflineMode(); else pms.offline = false;
        return response;
    }).catch(function (error) {
        console.error(error);
        return {'status': false};
    });
}

function io(method, getData, postData, url, plainData) {
    url = url ? url : (pms.config.apiUrl ? pms.config.apiUrl : '/api/') + method;
    getData = getData ? getData : '';
    if (typeof getData === 'object') getData = serialize(getData);
    postData = postData ? postData : false;
    if (typeof postData === 'object') postData = serialize(postData);
    if (method && !getCookie('token')) {
        let token = localStorage.getItem('token');
        if (token) {
            getData += (getData !== '' ? '&' : '') + '_token=' + token;
        }
    }
    if (getData !== '') url += '?' + getData;
    let parameters = {
        method: (postData ? 'POST' : 'GET'),
        mode: 'cors',
        credentials: 'include'
    };
    if (postData) parameters.body = postData;
    return fetch(url, parameters).then(function (response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            return plainData ? false : {'status': false, 'error': response.statusText};
        }
    }).then(function (response) {
        if (!response) return response;
        if (plainData) return response.text(); else return response.json();
    }).catch(function (response) {
        let debugData = ['Response parse error'];
        if (response.message) debugData.push(response.message);
        if (method) debugData.push(method);
        if (getData !== '') debugData.push(method ? decodeURIComponent(getData) : decodeURIComponent(url));
        if (postData && method) debugData.push(decodeURIComponent(postData));
        console.debug.apply(this, debugData);
        return {'status': false, 'error': 'Response parse error'};
    }).then(function (response) {
        if (!response || response.error) return response;
        let debugData = [response.offline ? 'Offline mode' : 'Request successful'];
        if (method) debugData.push(method);
        if (getData !== '') debugData.push(method ? decodeURIComponent(getData) : decodeURIComponent(url));
        if (postData && method) debugData.push(decodeURIComponent(postData));
        debugData.push(response);
        console.debug.apply(this, debugData);
        if (response.offline) initOfflineMode(); else pms.offline = false;
        return response;
    }).catch(function (error) {
        console.error(error);
        return {'status': false};
    });
}

function serialize(obj, prefix) {
    var str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function initOfflineMode() {
    if (pms.offline === true) return true;
    pms.offline = true;
    alert('Мы потеряли соединение с сервером, проверьте подключение и повторите');
    return true
}