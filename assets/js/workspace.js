let template = {};

window.menuItemClick = menuItemClick;
window.workspace = {render: render, loadTemplate: loadTemplate, require: require, leavePage: leavePage, init: init};
window.showLoadingIndicator = showLoadingIndicator;
window.hideLoadingIndicator = hideLoadingIndicator;
window.showItemLoadIndicator = showItemLoadIndicator;
window.hideItemLoadIndicator = hideItemLoadIndicator;
window.selectHost = selectHost;
window.isProgress = isProgress;
window.setProgress = setProgress;
window.getHostUrl = getHostUrl;
window.notifyAction = notifyAction;
window.createNotification = createNotification;
window.showNotification = showNotification;
window.errorHandler = errorHandler;
window.initPromise = initPromise;
window.importModule = importModule;

window.onerror = function (message, url, lineNumber) {
    return errorHandler(arguments, message);
    /*alert("Поймана ошибка, выпавшая в глобальную область!\n" +
        "Сообщение: " + message + "\n(" + url + ":" + lineNumber + ")");*/
};

export function init() {
    if (!pms.workspace) pms.workspace = {};
    if (!pms.onLeavePage) pms.onLeavePage = [];
    if (!pms.appearance) pms.appearance = {};
    if (!pms.appearance.loadIndicators) pms.appearance.loadIndicators = {};
    if (!pms.progressState) pms.progressState = {};

    window.addEventListener('touchstart', function onFirstTouch() {
        document.body.classList.toggle('touchscreen', true);
        window.removeEventListener('touchstart', onFirstTouch, false);
    }, false);

    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        pms.workspace.iOS = true;
        if (("standalone" in window.navigator) && window.navigator.standalone) document.body.classList.toggle('ios-standalone', true);
    } else if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
        pms.workspace.macOs = true;
    } else {
        document.body.classList.toggle('material', true);
    }
}

export function require(script) {
    return io(false, false, false, './assets/js/' + script + '.js', true)
        .then(function (response) {
            if (!response) return false;
            try {
                eval.apply(window, [response]);
            } catch (e) {
                console.error(e);
                return false;
            }
            return true;
        })
}

export function prepare() {
    init();
    showLoadingIndicator();
    if (!template.wrapper) return loadTemplate('wrapper')
        .then(function (response) {
            if (!response) {
                alert('Не удалось загрузить страницу');
                return false;
            }
            return template.wrapper = response;
        })
        // .then(prepareWrapper)
        .then(updateHostsData).then(function () {
            return render(template.wrapper);
        })
        .then(loadHost)
        .then(renderHostsSelectMenu).then(loadNotifications)
        .then(hideLoadingIndicator);
    else
        return updateHostsData().then(function () {
            return render(template.wrapper);
        })
            .then(loadHost)
            .then(renderHostsSelectMenu).then(loadNotifications)
            .then(hideLoadingIndicator);
}

function prepareWrapper() {
    if (pms.selectedHost) {
        if (pms.selectedHost.title && document.getElementById('host-name'))
            document.getElementById('host-name').innerText = pms.selectedHost.title;
        if (pms.selectedHost.logo && document.getElementById('host-logo'))
            document.getElementById('host-logo').src = pms.selectedHost.logo;
        if (pms.selectedHost.homePage && document.getElementById('home-page'))
            document.getElementById('home-page').href = pms.selectedHost.homePage;
    } else if (pms.currentHost) {
        if (pms.currentHost.title && document.getElementById('host-name'))
            document.getElementById('host-name').innerText = pms.currentHost.title;
        if (pms.currentHost.logo && document.getElementById('host-logo'))
            document.getElementById('host-logo').src = pms.currentHost.logo;
        if (pms.currentHost.homePage && document.getElementById('home-page'))
            document.getElementById('home-page').href = pms.currentHost.homePage;
    }
    if (document.getElementById('select-hosts-menu')) document.getElementById('select-hosts-menu').addEventListener('change', function () {
        selectHost(this.value);
    });
    if (document.getElementById('header-menu-button')) document.getElementById('header-menu-button').addEventListener('click', toggleMobileMenu);
    let userName = pms.userData.firstname ? pms.userData.firstname + (pms.userData.lastname ? ' ' + pms.userData.lastname : '') : (pms.userData.login ? pms.userData.login : 'Любимый пользователь');
    if (document.getElementById('user-name')) document.getElementById('user-name').innerText = userName;
    if (pms.userData.avamoji && document.getElementById('user-avamoji')) document.getElementById('user-avamoji').innerText = pms.userData.avamoji;
    if (document.getElementById('workspace-menu'))
        pms.workspace.menu = document.getElementById('workspace-menu');
    if (document.getElementById('workspace-wrapper'))
        pms.workspace.wrapper = document.getElementById('workspace-wrapper');
    if (document.getElementById('notificationsWrapper')) {
        pms.workspace.notificationsWrapper = document.getElementById('notificationsWrapper');
    }
    return true;
}

export function loadTemplate(id) {
    return io(false, false, false, './' + id + '.html', true)
        .then(function (response) {
            if (typeof response !== 'string') return false;
            else return response;
        });
}

export function render(html, node = document.body) {
    init();
    leavePage(); /// FUUUCK!!!!
    return new Promise(function (resolve, reject) {
        if (!html) return false;
        node.innerHTML = html;
        return resolve(node);
    });
}

export function updateHostsData() {
    return io('console/getHosts').then(function (response) {
        if (!response.status) return false;
        if (response.hostsData) {
            if (!pms.hostsData) pms.hostsData = {};
            if (!pms.domainsHost) pms.domainsHost = {};
            for (let i in response.hostsData) {
                pms.hostsData[response.hostsData[i].id] = response.hostsData[i];
                pms.domainsHost[response.hostsData[i].domain] = response.hostsData[i];
            }
        }
        return true;
    })
}

export function renderHostsSelectMenu() {
    let outputSource = '<option selected disabled>🌐 Выбрать Сайт</option>';
    let hostsDataKeys = Object.keys(pms.hostsData);
    for (let i in hostsDataKeys) {
        let host = pms.hostsData[hostsDataKeys[i]];
        let title = host.title ? host.title : host.domain;
        //let active = pms.selectedHost ? (pms.selectedHost.id === host.id ? 'selected' : '') : '';
        outputSource += '<option value="' + host.id + '" ' + '>' + title + '</option>';
    }
    let menuNode = document.getElementById('select-hosts-menu');
    menuNode.innerHTML = outputSource;
    if (hostsDataKeys.length > 1) menuNode.parentNode.style.display = 'initial';
    else menuNode.parentNode.style.display = 'none';
    return true;
}

export function loadHost(id) {
    leavePage();
    return new Promise(function (resolve, reject) {
        if (!pms.hostsData) return resolve(false);
        if (!id || !(typeof id === "string" || typeof id === "number")) {
            id = false;
            if (pms.currentHost && pms.currentHost.domain)
                if (pms.domainsHost[pms.currentHost.domain]) id = pms.domainsHost[pms.currentHost.domain].id;
            id = id ? id : Object.keys(pms.hostsData)[0];
        }
        let host = pms.selectedHost = pms.hostsData[id];
        if (!host.modules) return resolve(getHostModules(host.id).then(function (response) {
            if (!response) return response;
            return host;
        }).then(prepareWrapper).then(loadMenu));
        return resolve(new Promise(function (resolve, reject) {
            return resolve(prepareWrapper());
        }).then(loadMenu));
    });
}

export function getHostModules(hostId) {
    return io('console/getModules', {hostId: hostId}).then(function (response) {
        if (!response.status) return false;
        let host = pms.hostsData[hostId];
        host.menuStructure = [];
        if (!host.modules) host.modules = {};
        for (let i in response.modulesData) {
            let moduleData = response.modulesData[i];
            if (!pms.module) pms.module = {};
            if (!pms.module[moduleData.id]) pms.module[moduleData.id] = moduleData;
            host.modules[moduleData.id] = pms.module[moduleData.id];
            host.menuStructure.push(host.modules[moduleData.id]);
        }
        return true;
    })
}

export function getModuleData(moduleId, hostId = false) {
    hostId = hostId ? hostId : pms.selectedHost.id;
    // console.debug('getModuleData', moduleId, hostId);
    return new Promise(function (resolve, reject) {
        if (pms.hostsData[hostId].modules[moduleId].init) return resolve(moduleId);
        else return resolve(io('console/getModuleData', {
            moduleId: moduleId,
            hostId: hostId
        }).then(function (response) {
            if (!response.status || !response.init) return false;
            let host = pms.hostsData[hostId];
            host.modules[moduleId].init = response.init;
            return moduleId;
        }));
    });
}

export function loadModule(moduleId) {
    return new Promise(function (resolve, reject) {
        if (!pms.module[moduleId] || !pms.module[moduleId].init) return resolve(false);
        if (pms.module[moduleId].loaded) return resolve(true);
        try {
            eval(pms.module[moduleId].init);
        } catch (e) {
            reject(e);
        }
        pms.module[moduleId].loaded = true;
        return resolve(true);
    });
}

export function loadMenu() {
    if (!pms.selectedHost || !pms.selectedHost.modules) return false;
    let modules = pms.selectedHost.menuStructure ? pms.selectedHost.menuStructure : pms.selectedHost.modules;
    let menuSource = '<h2>Меню:</h2><ul>';
    for (let i in modules) {
        let module = pms.module[modules[i].id];
        let title = module.menu_item_title ? module.menu_item_title : (module.title ? module.title : module.id);
        let description = module.description ? ('<p>' + module.description + '</p>') : '';
        menuSource += '<li data-menu-item="' + module.id + '" onclick="menuItemClick(\'' + module.id + '\')"><a href="javascript:void(0);"><span>' + title + '</span>' + description + '</a>' + '</li><ul data-menu-item-container="' + module.id + '"></ul>';
    }
    menuSource += '</ul>';
    if (pms.workspace.menu) pms.workspace.menu.innerHTML = menuSource;
    return true;
}

export function menuItemClick(moduleId = false, itemId = false, parameters = false, type = false) {
    if (isProgress('menuItem')) return false;
    setProgress('menuItem');
    let module = pms.module[moduleId];
    if (!itemId) itemId = moduleId;
    showItemLoadIndicator(itemId, 'menu-item');
    showLoadingIndicator();
    if (!parameters) {
        if (module.menu_item_type && module.menu_item_type === 'item') {
            if (!module.loaded) getModuleData(moduleId).then(loadModule).catch(function (error) {
                return false;
            }).then(function (response) {
                if (!response || !module.loaded) alert('Раздел временно недоступен');
                if (module.workspaceGenerator) return module.workspaceGenerator();
                return {status: true};
            }).then(function (response) {
                if (typeof response !== 'object') return false;
                if (!response.status) console.debug(moduleId, response.statusText ? response.statusText : response);
                return true;
            }).then(function (result) {
                setProgress('menuItem', false);
                hideLoadingIndicator();
                hideItemLoadIndicator(itemId, 'menu-item');
                toggleMobileMenu(false);
                return result;
            });
            else if (module.workspaceGenerator)
                return module.workspaceGenerator()
                    .then(function (result) {
                        setProgress('menuItem', false);
                        hideLoadingIndicator();
                        hideItemLoadIndicator(itemId, 'menu-item');
                        toggleMobileMenu(false);
                        return result;
                    });
        } else if (module.menu_item_type && module.menu_item_type === 'group') {
            if (!module.loaded) getModuleData(moduleId).then(loadModule).catch(function (error) {
                return false;
            }).then(function (response) {
                if (!response || !module.loaded) alert('Раздел временно недоступен');
                if (module.menuItemsWorker) return module.menuItemsWorker();
                return {status: true};
            }).then(function (response) {
                // console.debug(response);
                if (typeof response !== 'object') return false;
                if (!response.status) console.debug(moduleId, response.statusText ? response.statusText : response);
                return response.menuItems ? renderMenuItems(moduleId, itemId, response.menuItems) : true;
            }).then(function (result) {
                setProgress('menuItem', false);
                hideLoadingIndicator();
                hideItemLoadIndicator(itemId, 'menu-item');
                return result;
            });
            else if (module.menuItemsWorker)
                return module.menuItemsWorker().then(function (response) {
                    console.debug(response);
                    if (typeof response !== 'object') return false;
                    if (!response.status) console.debug(moduleId, response.statusText ? response.statusText : response);
                    return response.menuItems ? renderMenuItems(moduleId, itemId, response.menuItems) : true;
                }).then(function (result) {
                    setProgress('menuItem', false);
                    hideLoadingIndicator();
                    hideItemLoadIndicator(itemId, 'menu-item');
                    return result;
                });
            setProgress('menuItem', false);
            hideLoadingIndicator();
            hideItemLoadIndicator(itemId, 'menu-item');
        }
    } else {
        if (!type) {

        } else {
            // console.debug(moduleId, parameters, type);
            if (type === 'item') {
                if (module.workspaceGenerator)
                    return module.workspaceGenerator(parameters)
                        .catch(errorHandler)
                        .then(function (result) {
                            setProgress('menuItem', false);
                            hideLoadingIndicator();
                            hideItemLoadIndicator(itemId, 'menu-item');
                            toggleMobileMenu(false);
                            return result;
                        });
            } else if (type === 'group') {
                if (module.menuItemsWorker)
                    return module.menuItemsWorker(parameters)
                        .catch(errorHandler)
                        .then(function (response) {
                            // console.debug('menuItemClick (ItemsWorker)', response);
                            setProgress('menuItem', false);
                            hideLoadingIndicator();
                            hideItemLoadIndicator(itemId, 'menu-item');
                            return response.menuItems ? renderMenuItems(moduleId, itemId, response.menuItems) : true;
                        });
            }
        }
    }
}

export function showItemLoadIndicator(id, attribute) {
    if (!pms.appearance) pms.appearance = {};
    if (!pms.appearance.loadIndicators) pms.appearance.loadIndicators = {};
    let item = document.querySelectorAll('[data-' + attribute + '="' + id + '"]');
    if (!item || item.length === 0) return false;
    if (pms.appearance.loadIndicators[attribute + '-' + id]) return false; //else console.debug('showItemLoadIndicator', 'indicator for ' + attribute + '-' + id + ' already active', pms.appearance.loadIndicators[attribute + '-' + id], pms.appearance);
    pms.appearance.loadIndicators[attribute + '-' + id] = 'initShow';
    item = item[0];
    let loader = item.querySelector('.loader-spinner-wrapper');
    if (!loader || loader.length === 0) {
        item.innerHTML += `<div class="loader-spinner-wrapper">
<div class="ispinner ispinner--gray ispinner--animating">
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
  <div class="ispinner__blade"></div>
</div></div>`
    }
    setTimeout(function () {
        item.classList.toggle('loader-spinner-active', true);
        pms.appearance.loadIndicators[attribute + '-' + id] = 'show';
    }, 100);
}

export function hideItemLoadIndicator(id, attribute, recursion) {
    if (pms.appearance.loadIndicators[attribute + '-' + id] && pms.appearance.loadIndicators[attribute + '-' + id] === 'initShow') {
        if (!recursion) setTimeout(function () {
            hideItemLoadIndicator(id, attribute, true)
        }, 100);
        return false;
    }
    pms.appearance.loadIndicators[attribute + '-' + id] = 'initHide';
    let item = document.querySelector('[data-' + attribute + '="' + id + '"]');
    if (!item || item.length === 0) {
        pms.appearance.loadIndicators[attribute + '-' + id] = false;
        delete pms.appearance.loadIndicators[attribute + '-' + id];
        return false;
    }
    item.classList.toggle('loader-spinner-active', false);
    setTimeout(function () {
        let item = document.querySelector('[data-' + attribute + '="' + id + '"]');
        if (!item || item.length === 0) {
            pms.appearance.loadIndicators[attribute + '-' + id] = false;
            delete pms.appearance.loadIndicators[attribute + '-' + id];
            return false;
        }
        let loader = item.querySelector('.loader-spinner-wrapper');
        if (loader && loader.length > 0) {
            loader[0].parentNode.removeChild(loader[0]);
        }
        pms.appearance.loadIndicators[attribute + '-' + id] = false;
        delete pms.appearance.loadIndicators[attribute + '-' + id];
    }, 500);
}

export function showLoadingIndicator(result = true) {
    document.body.style.cursor = 'progress';
    return result;
}

export function hideLoadingIndicator(result = true) {
    document.body.style.cursor = 'default';
    return result;
}

export function leavePage() {
    return new Promise(function (resolve, reject) {
        if (!pms.onLeavePage) pms.onLeavePage = [];
        for (let i in pms.onLeavePage) if (typeof pms.onLeavePage[i] === "function") try {
            pms.onLeavePage[i]();
        } catch (e) {
            console.error(e);
        }
        pms.onLeavePage = [];
        resolve(true);
    });
}

export function selectHost(id) {
    return render(template.wrapper)
    // .then(prepareWrapper)
        .then(function () {
            return loadHost(id);
        }).then(renderHostsSelectMenu)
        .then(hideLoadingIndicator);
}

export function isProgress(id) {
    return pms.progressState[id];
}

export function setProgress(id, state = true) {
    pms.progressState[id] = state;
    if (!state) delete pms.progressState[id];
    return true;
}

export function renderMenuItems(moduleId, menuId, items) {
    let container = document.querySelectorAll('[data-menu-item-container="' + menuId + '"]');
    if (!container || container.length === 0) return false;
    let menuSource = '';
    for (let i in items) {
        let item = items[i];
        let title = item.menu_item_title ? item.menu_item_title : (item.title ? item.title : item.id);
        let description = item.description ? ('<p>' + item.description + '</p>') : '';
        let parameters = item.parameters ? item.parameters : {};
        if (!item['type']) item['type'] = 'item';
        parameters['id'] = item.id;
        menuSource += '<li data-menu-item="' + item.id + '" onclick=\'menuItemClick("' + moduleId + '","' + item.id + '",' + JSON.stringify(parameters) + ',"' + item.type + '")\'><a href="javascript:void(0);"><span>' + title + '</span>' + description + '</a>' + '</li><ul data-menu-item-container="' + item.id + '"></ul>';
    }
    if (container[0]) container[0].innerHTML = menuSource;
    return true;
}

export function getHostUrl(excludePath, hostId) {
    if (!hostId) hostId = pms.selectedHost.id;
    let hostData = pms.hostsData[hostId];
    return (hostData.https ? 'https://' : 'http://') + hostData.domain + (!excludePath && hostData.path ? hostData.path + '/' : '');
}

export function loadNotifications(result) {
    if (!pms.userData.notifications) pms.userData.notifications = [];
    io('console/getUserNotifications').then(function (response) {
        if (!response.status || !response.notifications) return false;
        pms.notifications = response.notifications;
        if (!pms.notification) pms.notification = {};
        for (let i in pms.notifications) if (pms.notifications[i].id) pms.notification[pms.notifications[i].id] = pms.notifications[i];
        return true;
    }).then(renderNotifications);
    return result;
}

export function renderNotifications() {
    if (!pms.workspace.notificationsWrapper) return false;
    if (!pms.notifications || pms.notifications.length === 0) return true;
    let notificationsSource = '';
    for (let i in pms.notifications) {
        let notification = pms.notifications[i];
        if (!notification.id) continue;
        notificationsSource += '<div class="notification background-blur" data-notification="' + notification.id + '"><div class="notification-data"><div class="notification-header"><div class="notification-header-side">';
        if (notification.icon) notificationsSource += '<figure style="background-image: url(' + notification.icon + ')"></figure>';
        if (notification.title) notificationsSource += '<span>' + notification.title + '</span>';
        notificationsSource += '</div>';
        if (notification.time) notificationsSource += '<div class="notification-header-side"><span>' + notification.time + '</span></div>';
        notificationsSource += '</div>';
        if (notification.body) notificationsSource += '<div class="notification-body">' + notification.body + '</div>';
        notificationsSource += '</div><div class="notification-control">';
        if (notification.actions) {
            for (let i in notification.actions) {
                let action = notification.actions[i];
                notificationsSource += '<button class="notification-control-item" data-notification-action="' + notification.id + '_' + action.id + '" onclick="notifyAction(\'' + notification.id + '\',\'' + action.id + '\');">' + action.title + '</button>';
            }
        } else notificationsSource += '<button class="notification-control-item" data-notification-action="' + notification.id + '_close" onclick="notifyAction(\'' + notification.id + '\',\'close\');">Закрыть</button>';
        notificationsSource += '</div></div>';
    }
    pms.workspace.notificationsWrapper.innerHTML = notificationsSource;
    return true;
}

export function notifyAction(notificationId, actionId) {
    if (!notificationId || !pms.notification[notificationId]) return false;
    if (isProgress('notification_' + notificationId)) return false;
    setProgress('notification_' + notificationId);
    let notification = pms.notification[notificationId];
    if (!actionId || actionId === 'close') {
        if (notification.local) {
            setProgress('notification_' + notificationId, false);
            return removeNotification(notification.id);
        }
        showItemLoadIndicator(notificationId + '_' + actionId, 'notification-action');
        return io('console/closeUserNotification', {'notification': notificationId}).then(function (response) {
            // if (!response) return false;
            hideItemLoadIndicator(notificationId + '_' + actionId, 'notification-action');
            setProgress('notification_' + notificationId, false);
            return removeNotification(notification.id);
        });
    } else if (notification.actions[actionId]) {
        // TODO: Notification actions Here
        return new Promise(function (resolve, reject) {
            let action = notification.actions[actionId];
            resolve(function () {
                showItemLoadIndicator(notificationId + '_' + actionId, 'notification-action');
                if (action.method) return action.method(action.parameters ? action.parameters : false);
                return true;
            }().then(function (result) {
                if (!result) return result;
                return action.closeAfter ? result : io('console/closeUserNotification', {'notification': notificationId})
                    .then(function (response) {
                        // hideItemLoadIndicator(notificationId + '_' + actionId, 'notification-action');
                        // setProgress('notification_' + notificationId, false);
                        return removeNotification(notification.id).then(function () {
                            return result;
                        });
                    });
            }).then(function () {
                hideItemLoadIndicator(notificationId + '_' + actionId, 'notification-action');
                setProgress('notification_' + notificationId, false);
            }));
        });

    } else {
        setProgress('notification_' + notificationId, false);
        return false;
    }
}

export function removeNotification(notificationId) {
    if (!notificationId) return false;
    let notifications = document.querySelectorAll('[data-notification="' + notificationId + '"]');
    if (notifications && notifications.length > 0) /*for (let i in notifications) if (notifications[i]) notifications[i].parentNode.removeChild(notifications[i]);*/ notifications[0].parentNode.removeChild(notifications[0]);
    if (pms.notification[notificationId]) {
        pms.notification[notificationId] = false;
        delete pms.notification[notificationId];
    }
    for (let i in pms.notifications) if (parseInt(pms.notifications[i].id) === parseInt(notificationId)) {
        pms.notifications.splice(i, 1);
        break;
    }
    return true;
}

export function createNotification(title, body, icon, id, actions) {
    /*actions = [
        {
            id: 'report',
            title: 'Отчет',
            method: reportPluginError,
            parameters: {message: 'Error message', plugin: 12, time: new Date().getTime()}
        }
    ];*/
    id = id ? (pms.notification[id] ? new Date().getTime() : id) : new Date().getTime();
    let data = {
        id: id,
        title: title ? title : false,
        body: body ? body : false,
        icon: icon ? icon : false,
        actions: actions ? actions : false,
        // time: 'Сейчас',
        local: true
    };
    pms.notification[id] = data;
    return showNotification(data);
}

export function showNotification(data) {
    if (!pms.workspace.notificationsWrapper || !data) return false;
    let notificationSource = '';
    let notification = data;
    if (!notification.id) return false;
    notificationSource += '<div class="notification background-blur" data-notification="' + notification.id + '"><div class="notification-data"><div class="notification-header"><div class="notification-header-side">';
    if (notification.icon) notificationSource += '<figure style="background-image: url(' + notification.icon + ')"></figure>';
    if (notification.title) notificationSource += '<span>' + notification.title + '</span>';
    notificationSource += '</div>';
    if (notification.time) notificationSource += '<div class="notification-header-side"><span>' + notification.time + '</span></div>';
    notificationSource += '</div>';
    if (notification.body) notificationSource += '<div class="notification-body">' + notification.body + '</div>';
    notificationSource += '</div><div class="notification-control">';
    if (notification.actions) {
        for (let i in notification.actions) {
            let action = notification.actions[i];
            notificationSource += '<button class="notification-control-item" data-notification-action="' + notification.id + '_' + i + '" onclick="notifyAction(\'' + notification.id + '\',\'' + i + '\');">' + action.title + '</button>';
        }
    } else notificationSource += '<button class="notification-control-item" data-notification-action="' + notification.id + '_close" onclick="notifyAction(\'' + notification.id + '\',\'close\');">Закрыть</button>';
    notificationSource += '</div></div>';
    pms.workspace.notificationsWrapper.innerHTML += notificationSource;
    return true;
}

function toggleMobileMenu(state) {
    if (typeof state === "boolean") document.body.classList.toggle('mobile-menu-show', state);
    else document.body.classList.toggle('mobile-menu-show');
}

export function errorHandler(error, message, title, icon) {
    console.error(message, error);
    let actions = {
        close: {
            id: 'close',
            title: 'Закрыть'
        },
        report: {
            id: 'report',
            title: 'Отчет',
            method: errorReport,
            parameters: error,
            closeAfter: true
        }
    };
    createNotification(
        title ? title : 'Произошла ошибка!',
        message ? message : error.message,
        icon ? icon : pms.config.icon,
        false, actions);
    return true;
}

function errorReport(error) {
    error = {
        message: error.message,
        stack: error.stack,
        hostId: pms.selectedHost.id
    };
    return io('console/errorHandler', error).then(function (response) {
        return response.status;
    });
}

export function initPromise(result) {
    return new Promise(function (resolve, reject) {
        return resolve(result);
    });
}

export function importModule(moduleId) {
    return initPromise(moduleId).then(function (moduleId) {
        let module = pms.module[moduleId];
        if (!module || !module.loaded) return getModuleData(moduleId).then(loadModule).catch(function (error) {
            return false;
        }).then(function (response) {
            return true;
        });
        return true;
    });
}