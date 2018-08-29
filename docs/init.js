/******/
(function (modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/
        if (installedModules[moduleId]) {
            /******/
            return installedModules[moduleId].exports;
            /******/
        }
        /******/ 		// Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/            i: moduleId,
            /******/            l: false,
            /******/            exports: {}
            /******/
        };
        /******/
        /******/ 		// Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/
        module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/
        return module.exports;
        /******/
    }

    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/
    __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
            /******/
            Object.defineProperty(exports, name, {
                /******/                configurable: false,
                /******/                enumerable: true,
                /******/                get: getter
                /******/
            });
            /******/
        }
        /******/
    };
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
            /******/            function getDefault() {
                return module['default'];
            } :
            /******/            function getModuleExports() {
                return module;
            };
        /******/
        __webpack_require__.d(getter, 'a', getter);
        /******/
        return getter;
        /******/
    };
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ 	// __webpack_public_path__
    /******/
    __webpack_require__.p = "/pms-console/";
    /******/
    /******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = 1);
    /******/
})
/************************************************************************/
/******/([
    /* 0 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";


        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
            return typeof obj;
        } : function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };

        exports.init = init;
        exports.prepare = prepare;
        exports.loadTemplate = loadTemplate;
        exports.render = render;
        exports.updateHostsData = updateHostsData;
        exports.renderHostsSelectMenu = renderHostsSelectMenu;
        exports.loadHost = loadHost;
        exports.getHostModules = getHostModules;
        exports.getModuleData = getModuleData;
        exports.loadModule = loadModule;
        exports.loadMenu = loadMenu;
        exports.menuItemClick = menuItemClick;
        exports.showItemLoadIndicator = showItemLoadIndicator;
        exports.hideItemLoadIndicator = hideItemLoadIndicator;
        exports.showLoadingIndicator = showLoadingIndicator;
        exports.hideLoadingIndicator = hideLoadingIndicator;
        exports.leavePage = leavePage;
        exports.selectHost = selectHost;
        exports.isProgress = isProgress;
        exports.setProgress = setProgress;
        exports.renderMenuItems = renderMenuItems;
        exports.getHostUrl = getHostUrl;
        exports.loadNotifications = loadNotifications;
        exports.renderNotifications = renderNotifications;
        exports.notifyAction = notifyAction;
        exports.removeNotification = removeNotification;
        exports.createNotification = createNotification;
        exports.showNotification = showNotification;
        exports.errorHandler = errorHandler;
        exports.initPromise = initPromise;
        var template = {};

        window.menuItemClick = menuItemClick;
        window.workspace = {
            render: render,
            loadTemplate: loadTemplate,
            require: _require,
            leavePage: leavePage,
            init: init
        };
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

        window.onerror = function (message, url, lineNumber) {
            return errorHandler(arguments, message);
            /*alert("Поймана ошибка, выпавшая в глобальную область!\n" +
                "Сообщение: " + message + "\n(" + url + ":" + lineNumber + ")");*/
        };

        function init() {
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
                if ("standalone" in window.navigator && window.navigator.standalone) document.body.classList.toggle('ios-standalone', true);
            } else if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
                pms.workspace.macOs = true;
            } else {
                document.body.classList.toggle('material', true);
            }
        }

        function _require(script) {
            return io(false, false, false, './assets/js/' + script + '.js', true).then(function (response) {
                if (!response) return false;
                try {
                    eval.apply(window, [response]);
                } catch (e) {
                    console.error(e);
                    return false;
                }
                return true;
            });
        }

        exports.require = _require;

        function prepare() {
            init();
            showLoadingIndicator();
            if (!template.wrapper) return loadTemplate('wrapper').then(function (response) {
                if (!response) {
                    alert('Не удалось загрузить страницу');
                    return false;
                }
                return template.wrapper = response;
            })
            // .then(prepareWrapper)
                .then(updateHostsData).then(function () {
                    return render(template.wrapper);
                }).then(loadHost).then(renderHostsSelectMenu).then(loadNotifications).then(hideLoadingIndicator); else return updateHostsData().then(function () {
                return render(template.wrapper);
            }).then(loadHost).then(renderHostsSelectMenu).then(loadNotifications).then(hideLoadingIndicator);
        }

        function prepareWrapper() {
            if (pms.selectedHost) {
                if (pms.selectedHost.title && document.getElementById('host-name')) document.getElementById('host-name').innerText = pms.selectedHost.title;
                if (pms.selectedHost.logo && document.getElementById('host-logo')) document.getElementById('host-logo').src = pms.selectedHost.logo;
                if (pms.selectedHost.homePage && document.getElementById('home-page')) document.getElementById('home-page').href = pms.selectedHost.homePage;
            } else if (pms.currentHost) {
                if (pms.currentHost.title && document.getElementById('host-name')) document.getElementById('host-name').innerText = pms.currentHost.title;
                if (pms.currentHost.logo && document.getElementById('host-logo')) document.getElementById('host-logo').src = pms.currentHost.logo;
                if (pms.currentHost.homePage && document.getElementById('home-page')) document.getElementById('home-page').href = pms.currentHost.homePage;
            }
            if (document.getElementById('select-hosts-menu')) document.getElementById('select-hosts-menu').addEventListener('change', function () {
                selectHost(this.value);
            });
            if (document.getElementById('header-menu-button')) document.getElementById('header-menu-button').addEventListener('click', toggleMobileMenu);
            var userName = pms.userData.firstname ? pms.userData.firstname + (pms.userData.lastname ? ' ' + pms.userData.lastname : '') : pms.userData.login ? pms.userData.login : 'Любимый пользователь';
            if (document.getElementById('user-name')) document.getElementById('user-name').innerText = userName;
            if (pms.userData.avamoji && document.getElementById('user-avamoji')) document.getElementById('user-avamoji').innerText = pms.userData.avamoji;
            if (document.getElementById('workspace-menu')) pms.workspace.menu = document.getElementById('workspace-menu');
            if (document.getElementById('workspace-wrapper')) pms.workspace.wrapper = document.getElementById('workspace-wrapper');
            if (document.getElementById('notificationsWrapper')) {
                pms.workspace.notificationsWrapper = document.getElementById('notificationsWrapper');
            }
            return true;
        }

        function loadTemplate(id) {
            return io(false, false, false, './' + id + '.html', true).then(function (response) {
                if (typeof response !== 'string') return false; else return response;
            });
        }

        function render(html) {
            var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;

            init();
            leavePage(); /// FUUUCK!!!!
            return new Promise(function (resolve, reject) {
                if (!html) return false;
                node.innerHTML = html;
                return resolve(node);
            });
        }

        function updateHostsData() {
            return io('console/getHosts').then(function (response) {
                if (!response.status) return false;
                if (response.hostsData) {
                    if (!pms.hostsData) pms.hostsData = {};
                    if (!pms.domainsHost) pms.domainsHost = {};
                    for (var i in response.hostsData) {
                        pms.hostsData[response.hostsData[i].id] = response.hostsData[i];
                        pms.domainsHost[response.hostsData[i].domain] = response.hostsData[i];
                    }
                }
                return true;
            });
        }

        function renderHostsSelectMenu() {
            var outputSource = '<option selected disabled>🌐 Выбрать Сайт</option>';
            var hostsDataKeys = Object.keys(pms.hostsData);
            for (var i in hostsDataKeys) {
                var host = pms.hostsData[hostsDataKeys[i]];
                var title = host.title ? host.title : host.domain;
                //let active = pms.selectedHost ? (pms.selectedHost.id === host.id ? 'selected' : '') : '';
                outputSource += '<option value="' + host.id + '" ' + '>' + title + '</option>';
            }
            var menuNode = document.getElementById('select-hosts-menu');
            menuNode.innerHTML = outputSource;
            if (hostsDataKeys.length > 1) menuNode.parentNode.style.display = 'initial'; else menuNode.parentNode.style.display = 'none';
            return true;
        }

        function loadHost(id) {
            leavePage();
            return new Promise(function (resolve, reject) {
                if (!pms.hostsData) return resolve(false);
                if (!id || !(typeof id === "string" || typeof id === "number")) {
                    id = false;
                    if (pms.currentHost && pms.currentHost.domain) if (pms.domainsHost[pms.currentHost.domain]) id = pms.domainsHost[pms.currentHost.domain].id;
                    id = id ? id : Object.keys(pms.hostsData)[0];
                }
                var host = pms.selectedHost = pms.hostsData[id];
                if (!host.modules) return resolve(getHostModules(host.id).then(function (response) {
                    if (!response) return response;
                    return host;
                }).then(prepareWrapper).then(loadMenu));
                return resolve(new Promise(function (resolve, reject) {
                    return resolve(prepareWrapper());
                }).then(loadMenu));
            });
        }

        function getHostModules(hostId) {
            return io('console/getModules', {hostId: hostId}).then(function (response) {
                if (!response.status) return false;
                var host = pms.hostsData[hostId];
                host.menuStructure = [];
                if (!host.modules) host.modules = {};
                for (var i in response.modulesData) {
                    var moduleData = response.modulesData[i];
                    if (!pms.module) pms.module = {};
                    if (!pms.module[moduleData.id]) pms.module[moduleData.id] = moduleData;
                    host.modules[moduleData.id] = pms.module[moduleData.id];
                    host.menuStructure.push(host.modules[moduleData.id]);
                }
                return true;
            });
        }

        function getModuleData(moduleId) {
            var hostId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            hostId = hostId ? hostId : pms.selectedHost.id;
            // console.debug('getModuleData', moduleId, hostId);
            return new Promise(function (resolve, reject) {
                if (pms.hostsData[hostId].modules[moduleId].init) return resolve(moduleId); else return resolve(io('console/getModuleData', {
                    moduleId: moduleId,
                    hostId: hostId
                }).then(function (response) {
                    if (!response.status || !response.init) return false;
                    var host = pms.hostsData[hostId];
                    host.modules[moduleId].init = response.init;
                    return moduleId;
                }));
            });
        }

        function loadModule(moduleId) {
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

        function loadMenu() {
            if (!pms.selectedHost || !pms.selectedHost.modules) return false;
            var modules = pms.selectedHost.menuStructure ? pms.selectedHost.menuStructure : pms.selectedHost.modules;
            var menuSource = '<h2>Меню:</h2><ul>';
            for (var i in modules) {
                var module = pms.module[modules[i].id];
                var title = module.menu_item_title ? module.menu_item_title : module.title ? module.title : module.id;
                var description = module.description ? '<p>' + module.description + '</p>' : '';
                menuSource += '<li data-menu-item="' + module.id + '" onclick="menuItemClick(\'' + module.id + '\')"><a href="javascript:void(0);"><span>' + title + '</span>' + description + '</a>' + '</li><ul data-menu-item-container="' + module.id + '"></ul>';
            }
            menuSource += '</ul>';
            if (pms.workspace.menu) pms.workspace.menu.innerHTML = menuSource;
            return true;
        }

        function menuItemClick() {
            var moduleId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var itemId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            if (isProgress('menuItem')) return false;
            setProgress('menuItem');
            var module = pms.module[moduleId];
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
                        if ((typeof response === 'undefined' ? 'undefined' : _typeof(response)) !== 'object') return false;
                        if (!response.status) console.debug(moduleId, response.statusText ? response.statusText : response);
                        return true;
                    }).then(function (result) {
                        setProgress('menuItem', false);
                        hideLoadingIndicator();
                        hideItemLoadIndicator(itemId, 'menu-item');
                        toggleMobileMenu(false);
                        return result;
                    }); else if (module.workspaceGenerator) return module.workspaceGenerator().then(function (result) {
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
                        if ((typeof response === 'undefined' ? 'undefined' : _typeof(response)) !== 'object') return false;
                        if (!response.status) console.debug(moduleId, response.statusText ? response.statusText : response);
                        return response.menuItems ? renderMenuItems(moduleId, itemId, response.menuItems) : true;
                    }).then(function (result) {
                        setProgress('menuItem', false);
                        hideLoadingIndicator();
                        hideItemLoadIndicator(itemId, 'menu-item');
                        return result;
                    }); else if (module.menuItemsWorker) return module.menuItemsWorker().then(function (response) {
                        console.debug(response);
                        if ((typeof response === 'undefined' ? 'undefined' : _typeof(response)) !== 'object') return false;
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
                        if (module.workspaceGenerator) return module.workspaceGenerator(parameters).catch(errorHandler).then(function (result) {
                            setProgress('menuItem', false);
                            hideLoadingIndicator();
                            hideItemLoadIndicator(itemId, 'menu-item');
                            toggleMobileMenu(false);
                            return result;
                        });
                    } else if (type === 'group') {
                        if (module.menuItemsWorker) return module.menuItemsWorker(parameters).catch(errorHandler).then(function (response) {
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

        function showItemLoadIndicator(id, attribute) {
            if (!pms.appearance) pms.appearance = {};
            if (!pms.appearance.loadIndicators) pms.appearance.loadIndicators = {};
            var item = document.querySelectorAll('[data-' + attribute + '="' + id + '"]');
            if (!item || item.length === 0) return false;
            if (pms.appearance.loadIndicators[attribute + '-' + id]) return false; //else console.debug('showItemLoadIndicator', 'indicator for ' + attribute + '-' + id + ' already active', pms.appearance.loadIndicators[attribute + '-' + id], pms.appearance);
            pms.appearance.loadIndicators[attribute + '-' + id] = 'initShow';
            item = item[0];
            var loader = item.querySelector('.loader-spinner-wrapper');
            if (!loader || loader.length === 0) {
                item.innerHTML += '<div class="loader-spinner-wrapper">\n<div class="ispinner ispinner--gray ispinner--animating">\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n  <div class="ispinner__blade"></div>\n</div></div>';
            }
            setTimeout(function () {
                item.classList.toggle('loader-spinner-active', true);
                pms.appearance.loadIndicators[attribute + '-' + id] = 'show';
            }, 100);
        }

        function hideItemLoadIndicator(id, attribute, recursion) {
            if (pms.appearance.loadIndicators[attribute + '-' + id] && pms.appearance.loadIndicators[attribute + '-' + id] === 'initShow') {
                if (!recursion) setTimeout(function () {
                    hideItemLoadIndicator(id, attribute, true);
                }, 100);
                return false;
            }
            pms.appearance.loadIndicators[attribute + '-' + id] = 'initHide';
            var item = document.querySelector('[data-' + attribute + '="' + id + '"]');
            if (!item || item.length === 0) {
                pms.appearance.loadIndicators[attribute + '-' + id] = false;
                delete pms.appearance.loadIndicators[attribute + '-' + id];
                return false;
            }
            item.classList.toggle('loader-spinner-active', false);
            setTimeout(function () {
                var item = document.querySelector('[data-' + attribute + '="' + id + '"]');
                if (!item || item.length === 0) {
                    pms.appearance.loadIndicators[attribute + '-' + id] = false;
                    delete pms.appearance.loadIndicators[attribute + '-' + id];
                    return false;
                }
                var loader = item.querySelector('.loader-spinner-wrapper');
                if (loader && loader.length > 0) {
                    loader[0].parentNode.removeChild(loader[0]);
                }
                pms.appearance.loadIndicators[attribute + '-' + id] = false;
                delete pms.appearance.loadIndicators[attribute + '-' + id];
            }, 500);
        }

        function showLoadingIndicator() {
            var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            document.body.style.cursor = 'progress';
            return result;
        }

        function hideLoadingIndicator() {
            var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            document.body.style.cursor = 'default';
            return result;
        }

        function leavePage() {
            return new Promise(function (resolve, reject) {
                if (!pms.onLeavePage) pms.onLeavePage = [];
                for (var i in pms.onLeavePage) {
                    if (typeof pms.onLeavePage[i] === "function") try {
                        pms.onLeavePage[i]();
                    } catch (e) {
                        console.error(e);
                    }
                }
                pms.onLeavePage = [];
                resolve(true);
            });
        }

        function selectHost(id) {
            return render(template.wrapper)
            // .then(prepareWrapper)
                .then(function () {
                    return loadHost(id);
                }).then(renderHostsSelectMenu).then(hideLoadingIndicator);
        }

        function isProgress(id) {
            return pms.progressState[id];
        }

        function setProgress(id) {
            var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            pms.progressState[id] = state;
            if (!state) delete pms.progressState[id];
            return true;
        }

        function renderMenuItems(moduleId, menuId, items) {
            var container = document.querySelectorAll('[data-menu-item-container="' + menuId + '"]');
            if (!container || container.length === 0) return false;
            var menuSource = '';
            for (var i in items) {
                var item = items[i];
                var title = item.menu_item_title ? item.menu_item_title : item.title ? item.title : item.id;
                var description = item.description ? '<p>' + item.description + '</p>' : '';
                var parameters = item.parameters ? item.parameters : {};
                if (!item['type']) item['type'] = 'item';
                parameters['id'] = item.id;
                menuSource += '<li data-menu-item="' + item.id + '" onclick=\'menuItemClick("' + moduleId + '","' + item.id + '",' + JSON.stringify(parameters) + ',"' + item.type + '")\'><a href="javascript:void(0);"><span>' + title + '</span>' + description + '</a>' + '</li><ul data-menu-item-container="' + item.id + '"></ul>';
            }
            if (container[0]) container[0].innerHTML = menuSource;
            return true;
        }

        function getHostUrl(excludePath, hostId) {
            if (!hostId) hostId = pms.selectedHost.id;
            var hostData = pms.hostsData[hostId];
            return (hostData.https ? 'https://' : 'http://') + hostData.domain + (!excludePath && hostData.path ? hostData.path + '/' : '');
        }

        function loadNotifications(result) {
            if (!pms.userData.notifications) pms.userData.notifications = [];
            io('console/getUserNotifications').then(function (response) {
                if (!response.status || !response.notifications) return false;
                pms.notifications = response.notifications;
                if (!pms.notification) pms.notification = {};
                for (var i in pms.notifications) {
                    if (pms.notifications[i].id) pms.notification[pms.notifications[i].id] = pms.notifications[i];
                }
                return true;
            }).then(renderNotifications);
            return result;
        }

        function renderNotifications() {
            if (!pms.workspace.notificationsWrapper) return false;
            if (!pms.notifications || pms.notifications.length === 0) return true;
            var notificationsSource = '';
            for (var i in pms.notifications) {
                var notification = pms.notifications[i];
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
                    for (var _i in notification.actions) {
                        var action = notification.actions[_i];
                        notificationsSource += '<button class="notification-control-item" data-notification-action="' + notification.id + '_' + action.id + '" onclick="notifyAction(\'' + notification.id + '\',\'' + action.id + '\');">' + action.title + '</button>';
                    }
                } else notificationsSource += '<button class="notification-control-item" data-notification-action="' + notification.id + '_close" onclick="notifyAction(\'' + notification.id + '\',\'close\');">Закрыть</button>';
                notificationsSource += '</div></div>';
            }
            pms.workspace.notificationsWrapper.innerHTML = notificationsSource;
            return true;
        }

        function notifyAction(notificationId, actionId) {
            if (!notificationId || !pms.notification[notificationId]) return false;
            if (isProgress('notification_' + notificationId)) return false;
            setProgress('notification_' + notificationId);
            var notification = pms.notification[notificationId];
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
                    var action = notification.actions[actionId];
                    resolve(function () {
                        showItemLoadIndicator(notificationId + '_' + actionId, 'notification-action');
                        if (action.method) return action.method(action.parameters ? action.parameters : false);
                        return true;
                    }().then(function (result) {
                        if (!result) return result;
                        return action.closeAfter ? result : io('console/closeUserNotification', {'notification': notificationId}).then(function (response) {
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

        function removeNotification(notificationId) {
            if (!notificationId) return false;
            var notifications = document.querySelectorAll('[data-notification="' + notificationId + '"]');
            if (notifications && notifications.length > 0) /*for (let i in notifications) if (notifications[i]) notifications[i].parentNode.removeChild(notifications[i]);*/notifications[0].parentNode.removeChild(notifications[0]);
            if (pms.notification[notificationId]) {
                pms.notification[notificationId] = false;
                delete pms.notification[notificationId];
            }
            for (var i in pms.notifications) {
                if (parseInt(pms.notifications[i].id) === parseInt(notificationId)) {
                    pms.notifications.splice(i, 1);
                    break;
                }
            }
            return true;
        }

        function createNotification(title, body, icon, id, actions) {
            /*actions = [
                {
                    id: 'report',
                    title: 'Отчет',
                    method: reportPluginError,
                    parameters: {message: 'Error message', plugin: 12, time: new Date().getTime()}
                }
            ];*/
            id = id ? pms.notification[id] ? new Date().getTime() : id : new Date().getTime();
            var data = {
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

        function showNotification(data) {
            if (!pms.workspace.notificationsWrapper || !data) return false;
            var notificationSource = '';
            var notification = data;
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
                for (var i in notification.actions) {
                    var action = notification.actions[i];
                    notificationSource += '<button class="notification-control-item" data-notification-action="' + notification.id + '_' + i + '" onclick="notifyAction(\'' + notification.id + '\',\'' + i + '\');">' + action.title + '</button>';
                }
            } else notificationSource += '<button class="notification-control-item" data-notification-action="' + notification.id + '_close" onclick="notifyAction(\'' + notification.id + '\',\'close\');">Закрыть</button>';
            notificationSource += '</div></div>';
            pms.workspace.notificationsWrapper.innerHTML += notificationSource;
            return true;
        }

        function toggleMobileMenu(state) {
            if (typeof state === "boolean") document.body.classList.toggle('mobile-menu-show', state); else document.body.classList.toggle('mobile-menu-show');
        }

        function errorHandler(error, message, title, icon) {
            console.error(message, error);
            var actions = {
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
            createNotification(title ? title : 'Произошла ошибка!', message ? message : error.message, icon ? icon : pms.config.icon, false, actions);
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

        function initPromise(result) {
            return new Promise(function (resolve, reject) {
                return resolve(result);
            });
        }

        /***/
    }),
    /* 1 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";


        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
            return typeof obj;
        } : function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };

        var _workspace = __webpack_require__(0);

        var workspace = _interopRequireWildcard(_workspace);

        var _auth = __webpack_require__(2);

        var auth = _interopRequireWildcard(_auth);

        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            } else {
                var newObj = {};
                if (obj != null) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                    }
                }
                newObj.default = obj;
                return newObj;
            }
        }

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
                    if (_typeof(event.data) === 'object') window.pmsHostData = event.data;
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
                if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') data = Object.keys(data).map(function (k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
                }).join('&');
            }
            if (method) {
                var token = localStorage.getItem('token') ? localStorage.getItem('token') : false;
                /*(pms.currentHost ?
                    (pms.currentHost.token ? pms.currentHost.token : false) :
                    false);*/
                if (token) {
                    if (post) data['_token'] = token; else data += (data !== '' ? '&' : '') + '_token=' + token;
                }
            }
            if (data !== '' && !post) url += '?' + data;
            var parameters = {
                method: post ? 'POST' : 'GET',
                mode: 'cors',
                credentials: 'include'
            };
            if (post) parameters.body = JSON.stringify(data);
            return fetch(url, parameters).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    return plainData ? false : {'status': false, 'error': response.statusText};
                }
            }).then(function (response) {
                if (!response) return response;
                if (plainData) return response.text(); else return response.json();
            }).catch(function (response) {
                var debugData = ['Response parse error'];
                if (response.message) debugData.push(response.message);
                if (method) debugData.push(method);
                if (data !== '') debugData.push(method ? decodeURIComponent(data) : decodeURIComponent(url));
                console.debug.apply(this, debugData);
                return {'status': false, 'error': 'Response parse error'};
            }).then(function (response) {
                if (!response || response.error) return response;
                var debugData = [response.offline ? 'Offline mode' : 'Request successful'];
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
            if ((typeof getData === 'undefined' ? 'undefined' : _typeof(getData)) === 'object') getData = serialize(getData);
            postData = postData ? postData : false;
            if ((typeof postData === 'undefined' ? 'undefined' : _typeof(postData)) === 'object') postData = serialize(postData);
            if (method && !getCookie('token')) {
                var token = localStorage.getItem('token');
                if (token) {
                    getData += (getData !== '' ? '&' : '') + '_token=' + token;
                }
            }
            if (getData !== '') url += '?' + getData;
            var parameters = {
                method: postData ? 'POST' : 'GET',
                mode: 'cors',
                credentials: 'include'
            };
            if (postData) parameters.body = postData;
            return fetch(url, parameters).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    return plainData ? false : {'status': false, 'error': response.statusText};
                }
            }).then(function (response) {
                if (!response) return response;
                if (plainData) return response.text(); else return response.json();
            }).catch(function (response) {
                var debugData = ['Response parse error'];
                if (response.message) debugData.push(response.message);
                if (method) debugData.push(method);
                if (getData !== '') debugData.push(method ? decodeURIComponent(getData) : decodeURIComponent(url));
                if (postData && method) debugData.push(decodeURIComponent(postData));
                console.debug.apply(this, debugData);
                return {'status': false, 'error': 'Response parse error'};
            }).then(function (response) {
                if (!response || response.error) return response;
                var debugData = [response.offline ? 'Offline mode' : 'Request successful'];
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
            var str = [],
                p;
            for (p in obj) {
                if (obj.hasOwnProperty(p)) {
                    var k = prefix ? prefix + "[" + p + "]" : p,
                        v = obj[p];
                    str.push(v !== null && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        }

        function getCookie(name) {
            var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        function initOfflineMode() {
            if (pms.offline === true) return true;
            pms.offline = true;
            alert('Мы потеряли соединение с сервером, проверьте подключение и повторите');
            return true;
        }

        /***/
    }),
    /* 2 */
    /***/ (function (module, exports, __webpack_require__) {

        "use strict";


        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.check = check;
        exports.send = send;
        exports.showLogin = showLogin;

        var _workspace = __webpack_require__(0);

        var workspace = _interopRequireWildcard(_workspace);

        function _interopRequireWildcard(obj) {
            if (obj && obj.__esModule) {
                return obj;
            } else {
                var newObj = {};
                if (obj != null) {
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                    }
                }
                newObj.default = obj;
                return newObj;
            }
        }

        var template = {};

        window.auth = {logout: logout};

        function check() {
            return io('console/getUserData').then(function (response) {
                if (response.status) saveUserData(response);
                return response.status;
            });
        }

        function send(login, password) {
            // auth.loginSection.classList.toggle('incorrect-data', false);
            return new Promise(function (resolve, reject) {
                if (!login || login === '') return resolve(loginError('empty_login', 'login'));
                if (!login || password === '') return resolve(loginError('empty_password', 'password'));
                showItemLoadIndicator('auth', 'login-button');
                var data = {login: login, password: password};
                return resolve(io('console/auth', data));
            });
        }

        function loginError(message, type) {
            // return new Promise(function (resolve, reject) {
            var authLogin = document.getElementById('auth-login');
            var loginMessage = document.getElementById('auth-login-message');
            var authPassword = document.getElementById('auth-password');
            var passwordMessage = document.getElementById('auth-password-message');
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
            return false; // resolve(false);
            // });
        }

        function showLogin() {
            if (!template.login) return workspace.loadTemplate('login').then(function (response) {
                if (!response) return 'Не удалось загрузить страницу';
                return template.login = response;
            }).then(workspace.render).then(prepareLogin); else return workspace.render(template.login).then(prepareLogin);
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

            var OneSignal = window.OneSignal || [];
            OneSignal.push(["init", {
                appId: "d6d3da7e-593f-4b75-a598-a5d4b27e31e6",
                autoRegister: true,
                notifyButton: {
                    enable: false
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
            });
        }

        /***/
    })
    /******/]);
//# sourceMappingURL=init.js.map