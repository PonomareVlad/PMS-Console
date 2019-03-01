(function () {

    if (!window.pms) return false;
    if (!window.pms.module) window.pms.module = {};
    if (!window.pms.module.installedPlugins) window.pms.module.installedPlugins = {};
    let installedPlugins = pms.module.installedPlugins;
    let template = installedPlugins.template = {};
    window.pluginIo = pluginIo;
    window.pluginInit = pluginInit;

    installedPlugins.workspaceGenerator = function (parameters = false) {
        return new Promise(function (resolve, reject) {
            // if (pms.workspace.wrapper) pms.workspace.wrapper.innerHTML = 'Идут технические работы';
            if (parameters && parameters.plugin) {
                return resolve(workspace.leavePage()
                    .then(function () {
                        pms.selectedPlugin = pms.selectedHost.plugin[parameters.plugin];
                        return execPluginMethod(parameters.plugin, 'workspaceGenerator', parameters);
                    })
                    .then(function (result) {
                        pms.onLeavePage.push(function () {
                            pms.selectedPlugin = false;
                            delete pms.selectedPlugin;
                        });
                        return resolve({status: result});
                    }));
            }
            return resolve({status: false});
        });
    };

    installedPlugins.menuItemsWorker = function (parameters = false) {
        return new Promise(function (resolve, reject) {

            // createNotification(pms.config.name, '<p>Раздел "Плагины" временно недоступен!</p><br><p>Идут работы по настройке новых функций для вашего сайта.</p>', pms.config.icon);
            if (parameters && parameters.plugin) {
                // console.debug('menuItemsWorker wait 5 secs...');setTimeout(function () {},5000);
                return resolve(genPluginsMenuItems(parameters.plugin, parameters).then(function (result) {
                    // console.debug('menuItemsWorker end with:', result);
                    return {status: true, menuItems: result};
                }));
            } else {
                if (!pms.selectedHost.plugins) return getInstalledPlugins().then(function (result) {
                    if (!result) return resolve({status: true, menuItems: []});
                    // console.debug(genPluginsMenuItems());
                    return resolve({status: true, menuItems: genPluginsMenuItems()});
                }); else return resolve({status: true, menuItems: genPluginsMenuItems()});
            }
            // return resolve({status: true, menuItems: []});
        });
    };

    /*function showPlugin(id) {
        console.debug(showPlugin, id);
    }*/

    function getInstalledPlugins() {
        return io('console/host/getInstalledPlugins', {hostId: pms.selectedHost.id}).then(function (response) {
            if (!response.status || !response.plugins) return false;
            return parsePluginsData(response.plugins);
        })
    }

    function parsePluginsData(pluginsData) {
        if (typeof pluginsData !== 'object') return false;
        if (!pms.selectedHost.plugins) pms.selectedHost.plugins = [];
        if (!pms.selectedHost.plugin) pms.selectedHost.plugin = [];
        for (let i in pluginsData) {
            let pluginData = pluginsData[i];
            pms.selectedHost.plugins.push(pms.selectedHost.plugin[pluginData.id] = pluginData);
        }
        return true;
    }

    function genPluginsMenuItems(pluginId = false, parameters = false) {
        let menuItems = [];
        if (!pms.selectedHost.plugins) return menuItems;
        if (pluginId) {
            if (pms.selectedHost.plugin[pluginId]) {
                return (pms.selectedHost.plugin[pluginId].init ? initPlugin(pluginId) :
                    getPluginConsoleScript(pluginId).then(initPlugin)).then(function (result) {
                    if (!result) return false;
                    result = execPluginMethod(pluginId, 'menuItemsWorker', parameters);
                    // console.debug('Result of execPluginMethod', result);
                    return result ? result : menuItems;
                });
            } else return menuItems;
        }
        for (let i in pms.selectedHost.plugins) menuItems.push({
            id: 'plugin_' + pms.selectedHost.plugins[i].id,
            title: pms.selectedHost.plugins[i].title,
            description: pms.selectedHost.plugins[i].description,
            type: 'group',
            parameters: {'plugin': pms.selectedHost.plugins[i].id}
        });
        return menuItems;
    }

    function getPluginConsoleScript(pluginId = false) {
        if (!pluginId) return false;
        return io('console/host/getPluginConsoleData', {
            hostId: pms.selectedHost.id,
            pluginId: pluginId
        }).then(function (response) {
            // console.debug('Response getPluginConsoleScript',response);
            if (!response.status || !response.data) return false;
            pms.selectedHost.plugin[pluginId].init = response.data.init ? response.data.init : true;
            pms.selectedHost.plugin[pluginId].parameters = response.data.parameters ? response.data.parameters : true;
            return pluginId;
        });
    }

    function initPlugin(pluginId = false) {
        return new Promise(function (resolve, reject) {
            if (!pluginId || !pms.selectedHost.plugin[pluginId].init || (typeof pms.selectedHost.plugin[pluginId].init === 'boolean' && pms.selectedHost.plugin[pluginId].init === false)) return resolve(false);
            eval(pms.selectedHost.plugin[pluginId].init);
            pms.selectedHost.plugin[pluginId].init = true;
            return resolve(pluginId);
        });
    }

    function execPluginMethod(pluginId = false, method = false, parameters = false) {
        if (!pluginId || !method) return false;
        if (!pms.selectedHost.plugin[pluginId]) return false;
        let installedPluginData = pms.selectedHost.plugin[pluginId];
        if (!installedPluginData.vendor_name || !installedPluginData.plugin_name) return false;
        if (!pms.plugin[installedPluginData.vendor_name][installedPluginData.plugin_name]) return false;
        let pluginData = pms.plugin[installedPluginData.vendor_name][installedPluginData.plugin_name];
        if (!pluginData[method]) return false;
        let targetPluginMethod = pluginData[method];
        return targetPluginMethod(parameters);
    }

    function pluginIo(method = false, getData = false, postData = false, plainData = false, requestPath = false) {
        if (!method || !pms.selectedPlugin) return new Promise(function (resolve, reject) {
            resolve(true)
        });
        let data = {
            hostId: pms.selectedHost.id,
            requestPath: requestPath ? requestPath : (pms.selectedPlugin.installPath + method),
        };
        if (getData) data.getData = getData;
        if (postData) data.mode = 'POST';
        return io('console/host/new_pluginRequest', data, postData, false, plainData);
    }

    function pluginInit(pluginData) {
        // console.debug('pluginInit',pluginData);
        pms.selectedPlugin = pluginData;//pms.selectedHost.plugin[pluginId];
        pms.onLeavePage.push(function () {
            pms.selectedPlugin = false;
            delete pms.selectedPlugin;
        });
        return true;
    }

    // getInstalledPlugins();

})();