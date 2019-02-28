(function () {

    if (!window.pms) return false;
    if (!window.pms.plugin) window.pms.plugin = {};
    if (!window.pms.plugin.SecArgonia) window.pms.plugin.SecArgonia = {};
    if (!window.pms.plugin.SecArgonia.cabinet) window.pms.plugin.SecArgonia.cabinet = {};
    let cabinet = pms.plugin.SecArgonia.cabinet;
    let template = cabinet.template = {};

    // TODO: Обработчик рабочего пространства, тут мы подготавливаем верстку и первичное наполенение в зависимости от полученных параметров
    cabinet.workspaceGenerator = function (parameters = false) {
        return new Promise(function (resolve, reject) {
            createNotification(pms.config.name, '<p>Плагин "Кабинет" временно недоступен!</p><br><p>Идет процесс обновления плагина на вашм сайте.</p>', pms.config.icon);
            return resolve({status: false});
        });
    };

    // TODO: Обработчик клика по элементу в меню, вызывается только при клике по элементу с типом "group" и отдает массив вложенных элементов
    cabinet.menuItemsWorker = function (parameters = false) {
        return new Promise(function (resolve, reject) {
            createNotification(pms.config.name, '<p>Плагин "Кабинет" временно недоступен!</p><br><p>Идет процесс обновления плагина на вашм сайте.</p>', pms.config.icon);
            return resolve({status: true, menuItems: []});
        });
    };

})();