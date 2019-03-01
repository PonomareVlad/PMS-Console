(function () {

        if (!window.pms) return false;
        if (!window.pms.plugin) window.pms.plugin = {};
        if (!window.pms.plugin.PonomareVlad) window.pms.plugin.PonomareVlad = {};
        if (!window.pms.plugin.PonomareVlad.catalog) window.pms.plugin.PonomareVlad.catalog = {};
        let catalog = pms.plugin.PonomareVlad.catalog;
        let template = catalog.template = {};

        catalog.config = {
            parameterWorkers: {
                images: {
                    gen: genImagesParameter,
                    add: addImagesParameter,
                },
                hidden: {
                    gen: genHiddenParameter
                }
            }
        };

        // TODO: Обработчик рабочего пространства, тут мы подготавливаем верстку и первичное наполенение в зависимости от полученных параметров
        /*catalog.workspaceGenerator = function (parameters = false) {
            return new Promise(function (resolve, reject) {
                // createNotification(pms.config.name, '<p>Плагин "Каталог" временно недоступен!</p><br><p>Идет процесс обновления плагина на вашм сайте.</p>', pms.config.icon);
                // return resolve({status: false});
                console.debug('workspaceGenerator', parameters);
                if (parameters.id === 'items_catalog_plugin') {
                    pms.selectedHost.catalogItems = [];
                    return resolve(loadCatalogItems(true, 20).then(function (result) {
                        if (result) {
                            let workspaceSection = document.getElementById('workspaceSection');
                            workspaceSection.onscroll = function () { // TODO: Make AutoLoad more Items
                                if (workspaceSection.scrollTop > (workspaceSection.scrollHeight - (workspaceSection.clientHeight * 2))) {
                                    if (isProgress('dirItem')) return resolve(false);
                                    setProgress('dirItem');
                                    showLoadingIndicator();
                                    loadCatalogItems(false, 10).then(function () {
                                        setProgress('dirItem', false);
                                        hideLoadingIndicator();
                                    });
                                }
                            };
                        }
                        return resolve(result);
                    }));
                } else if (parameters.id === 'add_catalog_plugin') {
                    return resolve(loadCatalogParameters().then(function (result) {
                        if (!result) return alert('Не удалось загрузить параметры каталога');
                        return resolve(showAddCatalogItem());
                    }));
                } else {
                    // if (pms.workspace.wrapper) pms.workspace.wrapper.innerHTML = 'installedPlugins';
                    return resolve(testWorkspace());
                    // return resolve({status: false});
                }
            }).catch(errorHandler);
        };*/

        catalog.workspaceGenerator = function (parameters = []) {
            return new Promise(function (resolve, reject) {
                switch (parameters.id) {
                    case 'items_catalog_plugin':
                        resolve(showItemsListPage(null, parameters.disableHistory ? parameters.disableHistory : null));
                        break;
                    case 'categories_catalog_plugin':
                        resolve(showCategoriesListPage());
                        break;
                    case 'collections_catalog_plugin':
                        resolve(showCollectionsListPage());
                        break;
                    case 'add_catalog_plugin':
                        resolve(showItemParametersPage());
                        break;
                    case 'item_catalog_plugin':
                        resolve(showItemParametersPage(parameters.item, parameters.disableHistory ? parameters.disableHistory : null));
                        break;
                    default:
                        createNotification('Каталог', 'Раздел временно отключен', pms.config.icon);
                        resolve(false);
                        break;
                }
                resolve(false);
            });
        };

        // TODO: Обработчик клика по элементу в меню, вызывается только при клике по элементу с типом "group" и отдает массив вложенных элементов
        catalog.menuItemsWorker = function (parameters = false) {
            // return new Promise(function (resolve, reject) {
            // createNotification(pms.config.name, '<p>Плагин "Каталог" временно недоступен!</p><br><p>Идет процесс обновления плагина на вашм сайте.</p>', pms.config.icon);
            // return resolve({status: true, menuItems: []});
            // if (pms.selectedHost.id === '1') {
            //     if (!parameters) return resolve({menuItems: [{id: 'catalog_plugin', title: 'Каталог', type: 'group'}]});
            //     if (parameters.id && parameters.id === 'catalog_plugin')
            return [{
                id: 'add_catalog_plugin',
                title: 'Добавить новый товар',
                type: 'item',
                description: 'Создание товара с возможностью настроить все параметры',
                parameters: parameters,
            }, {
                id: 'items_catalog_plugin',
                title: 'Товары',
                type: 'item',
                description: 'Все товары в одном списке',
                parameters: parameters,
            }, {
                id: 'categories_catalog_plugin',
                title: 'Категории',
                type: 'item',
                description: 'Просмотр и управление структурой каталога',
                parameters: parameters,
            }, {
                id: 'collections_catalog_plugin',
                title: 'Коллекции',
                type: 'item',
                description: 'Список всех коллекций и создание новых',
                parameters: parameters,
            } /*{
                id: 'sections_catalog_plugin',
                title: 'Разделы',
                type: 'item',
                description: 'Управление динамическими разделами каталога',
                parameters: parameters,
            }, {
                id: 'settings_catalog_plugin',
                title: 'Настройки каталога',
                type: 'item',
                description: 'Управление параметрами каталога',
                parameters: parameters,
            }*/];
            // else return resolve({status: true, menuItems: []});
            // }
            // });
        };

        initHistoryHandler.bind(this)();

        window.showUpdateCatalogItem = showUpdateCatalogItem;
        window.saveCatalogItem = saveCatalogItem;
        window.moreItemArrayParameters = moreItemArrayParameters;
        window.moreImageItemParameters = moreImageItemParameters;
        window.imageUpload = imageUpload;
        window.removeImage = removeImage;
        window.loadCatalogItems = loadCatalogItems;
        window.testWorkspace = testWorkspace;
        window.viewItemPage = viewItemPage;
        window.listItemClick = listItemClick;
        window.fetchParameterChanges = fetchParameterChanges;
        window.addParameterVariant = addParameterVariant;
        window.removeParameterVariant = removeParameterVariant;
        window.saveItemParameters = saveItemParameters;
        window.menuButtonClick = menuButtonClick;
        window.searchItemsListPage = searchItemsListPage;
        window.showCategoriesListPage = showCategoriesListPage;
        window.viewCategoryPage = viewCategoryPage;
        window.listCategoryClick = listCategoryClick;
        window.saveCategoryParameters = saveCategoryParameters;
        window.newCategory = newCategory;
        window.saveCategory = saveCategory;
        window.deleteCategory = deleteCategory;

        window.showCollectionsListPage = showCollectionsListPage;
        window.newCollection = newCollection;
        window.saveCollection = saveCollection;
        window.deleteCollection = deleteCollection;


        function showAddCatalogItem_old(itemId) {
            if (!pms.selectedHost.catalogParameters) {
                alert('Не удалось загрузить пареметры каталога');
                return false;
            }
            let itemData = [];
            pms.selectedHost.selectedCatalogItem = false;
            delete pms.selectedHost.selectedCatalogItem;
            if (itemId && pms.selectedHost.catalogItems[itemId]) {
                pms.selectedHost.selectedCatalogItem = itemData = pms.selectedHost.catalogItems[itemId];
            } else itemId = false;
            pms.selectedHost.catalogItemEditorParameter = {};
            let source = '<h3>Укажите необходимые данные:</h3>';
            source += '<div style="display: flex;justify-content: space-between;margin: .5rem;"><label>Номер Объекта:</label><input id="catalogItemId" type="number" size="10" value="' + (itemId ? itemId : '') + '" placeholder="Автоматически" /></div>';
            for (let i in pms.selectedHost.catalogParameters) {
                let parameter = pms.selectedHost.catalogParameters[i];
                source += '<div style="display: flex;justify-content: space-between;margin: .5rem;"><label>' + parameter.title + ':</label>';
                switch (parameter.type) {
                    case 'array':
                        if (parameter.variants && parameter.variants.length > 0) {
                            source += '<div class="flex-vertical">';
                            for (let j in parameter.variants) {
                                let variant = parameter.variants[j];
                                // console.debug(parameter.parameter, variant.title);
                                // source += '<option value="' + variant.data + '" ' + (typeof itemData[parameter.parameter] === 'object' && ~itemData[parameter.parameter].indexOf(variant.title) ? 'selected' : '') + '>' + variant.title + '</option>';
                                source += '<label><input id="' + parameter.parameter + '_' + j + '" type="checkbox" value="' + variant.data + '" ' + (typeof itemData[parameter.parameter] === 'object' && ~itemData[parameter.parameter].indexOf(variant.data) ? 'checked' : '') + '> ' + variant.title + '</label>';
                            }
                            pms.selectedHost.catalogItemEditorParameter[parameter.parameter] = parameter.variants.length;
                            source += '</div>';
                        } else {
                            source += '<div class="flex-vertical"><div class="flex-vertical" id="' + parameter.parameter + '_container">';
                            for (let i in itemData[parameter.parameter]) {
                                source += '<div class="flex-right">';
                                if (parameter.parameter === 'images') source += '<a href="' + getHostUrl(true) + itemData[parameter.parameter][i] + '" target="_blank"><img src="' + getHostUrl(true) + itemData[parameter.parameter][i] + '" id="' + parameter.parameter + '_' + i + '" height="40px"/></a>';
                                else source += '<input size="30" id="' + parameter.parameter + '_' + i + '" value="' + itemData[parameter.parameter][i] + '" type="text"/>';
                                source += '<button style="margin-left: 1rem;" onclick="this.parentNode.parentNode.removeChild(this.parentNode);">Удалить</button></div>';
                            }
                            if (parameter.parameter === 'images') source += '</div><button onclick="moreImageItemParameters(\'' + parameter.parameter + '\'' + (itemData[parameter.parameter] ? (',' + itemData[parameter.parameter].length) : '') + ');">Добавить еще изображение</button></div>';
                            else source += '</div><button onclick="moreItemArrayParameters(\'' + parameter.parameter + '\'' + (itemData[parameter.parameter] ? (',' + itemData[parameter.parameter].length) : '') + ');">Добавить еще элемент</button></div>';
                            pms.selectedHost.catalogItemEditorParameter[parameter.parameter] = itemData[parameter.parameter] ? itemData[parameter.parameter].length : 0;
                        }
                        break;
                    case 'select':
                        source += '<select id="' + parameter.parameter + '">';
                        if (parameter.variants) {
                            source += '<option selected value="false">Не указано</option>';
                            for (let j in parameter.variants) {
                                let variant = parameter.variants[j];
                                source += '<option value="' + variant.data + '" ' + (itemData[parameter.parameter] && itemData[parameter.parameter] === variant.data ? 'selected' : '') + '>' + variant.title + '</option>';
                            }
                        } else source += itemData[parameter.parameter] ? '<option selected value="' + itemData[parameter.parameter][0] + '">' + itemData[parameter.parameter][0] + '</option>' : '<option selected value="false">Не указано</option>';
                        source += '</select>';
                        break;
                    case 'int':
                        source += '<input id="' + parameter.parameter + '" size="30" value="' + (itemData[parameter.parameter] ? itemData[parameter.parameter] : '') + '" placeholder="Не указано" type="number"/>';
                        break;
                    case 'bool':
                        source += '<select id="' + parameter.parameter + '"><option selected value="false">Не указано</option><option value="0" ' + (itemData[parameter.parameter] === '0' ? 'selected' : '') + '>Нет</option><option value="1" ' + (itemData[parameter.parameter] === '1' ? 'selected' : '') + '>Да</option></select>';
                        break;
                    case 'html':
                        source += '<textarea id="' + parameter.parameter + '" cols="30" rows="5" placeholder="Не указано">' + (itemData[parameter.parameter] ? itemData[parameter.parameter] : '') + '</textarea>';
                        break;
                    default:
                        source += '<input id="' + parameter.parameter + '" type="text" size="30" value="' + (itemData[parameter.parameter] ? itemData[parameter.parameter] : '') + '" placeholder="Не указано" />';
                        break;
                }
                source += '</div>';
            }
            pms.workspace.wrapper.innerHTML = '<div class="workspace-section scrollbox" id="workspaceSection">' + source + '<div class="horizontal-flex-menu flex-right"><div style="margin-right: 1rem;"><span id="uploadState"></span></div>' + (itemId && itemData['href'] ? '<div class="menu-button-section"><button onclick="window.open(\'' + getHostUrl() + itemData['href'] + '\',\'_blank\');">Посмотреть</button></div>' : '') + '<div class="menu-button-section"><button onclick="saveCatalogItem();">Сохранить</button></div></div></div>';
            return true;
        }

        function saveCatalogItem() {
            if (pms.selectedHost.catalogSelectedImages)
                for (let i in pms.selectedHost.catalogSelectedImages)
                    if (pms.selectedHost.catalogSelectedImages[i] && !pms.selectedHost.catalogSelectedImages[i].upload)
                        return alert('Необходимо дождаться завершения загрузки изображений');
            let newData = pms.selectedHost.selectedCatalogItem ? pms.selectedHost.selectedCatalogItem : {};
            for (let i in pms.selectedHost.catalogParameters) {
                let parameter = pms.selectedHost.catalogParameters[i];
                let parameterData = false;
                switch (parameter.type) {
                    case 'array':
                        if (pms.selectedHost.catalogItemEditorParameter[parameter.parameter] && pms.selectedHost.catalogItemEditorParameter[parameter.parameter] > 0) {
                            let value = [];
                            for (let i = 0; i < pms.selectedHost.catalogItemEditorParameter[parameter.parameter]; i++) {
                                if (parameter.parameter === 'images') {
                                    if (document.getElementById(parameter.parameter + '_' + i)) {
                                        if (newData[parameter.parameter][i]) value.push(newData[parameter.parameter][i]);
                                    } else if (pms.selectedHost.catalogSelectedImages[i]) {
                                        value.push(pms.selectedHost.catalogSelectedImages[i].path);
                                    }
                                } else {
                                    if (document.getElementById(parameter.parameter + '_' + i)) {
                                        let item = document.getElementById(parameter.parameter + '_' + i);
                                        if (item.checked) {
                                            value.push(item.value);
                                        }
                                    }
                                }
                            }
                            if (value.length > 0) parameterData = value;
                        }
                        break;
                    case 'select':
                        if (document.getElementById(parameter.parameter)) {
                            let value = document.getElementById(parameter.parameter).value;
                            if (value && value !== '' && value !== 'false') parameterData = value;
                        }
                        break;
                    case 'int':
                        if (document.getElementById(parameter.parameter)) {
                            let value = document.getElementById(parameter.parameter).value;
                            if (value && value !== '' && value !== 'false') parameterData = parseInt(value);
                        }
                        break;
                    case 'bool':
                        if (document.getElementById(parameter.parameter)) {
                            let value = document.getElementById(parameter.parameter).value;
                            if (value && value !== '' && value !== 'false') parameterData = parseInt(value) === 1;
                        }
                        break;
                    case 'html':
                        if (document.getElementById(parameter.parameter)) {
                            let value = document.getElementById(parameter.parameter).value;
                            if (value && value !== '') parameterData = value;
                        }
                        break;
                    default:
                        if (document.getElementById(parameter.parameter)) {
                            let value = document.getElementById(parameter.parameter).value;
                            if (value && value !== '') parameterData = value;
                        }
                        break;
                }
                newData[parameter.parameter] = parameterData;
            }
            if (document.getElementById('catalogItemId')) {
                newData['new_id'] = document.getElementById('catalogItemId').value;
            }
            return io('console/host/pluginRequest', {
                hostId: pms.selectedHost.id,
                requestPath: '/system/plugins/PonomareVlad/catalog/?console=saveItem',
                mode: 'POST'
            }, newData).then(function (response) {
                if (!response.status || !response.response) return alert('Произошла ошибка при сохранении');
                if (!response.response.status) return alert('Произошла ошибка при сохранении');
                return alert('Успешно сохранено');
            });
        }

        function moreItemArrayParameters(parameterId, number) {
            if (!pms.selectedHost.catalogParameter[parameterId]) return false;
            if (!pms.selectedHost.catalogItemEditorParameter) pms.selectedHost.catalogItemEditorParameter = {};
            let parameter = pms.selectedHost.catalogParameter[parameterId];
            number = pms.selectedHost.catalogItemEditorParameter[parameter.parameter] ? pms.selectedHost.catalogItemEditorParameter[parameter.parameter] : (number ? parseInt(number) : 0);
            let container = document.getElementById(parameter.parameter + '_container');
            if (!container) return false;
            container.innerHTML += '<div class="flex-right"><input size="30" id="' + parameter.parameter + '_' + number + '" value="" type="text"/><button style="margin-left: 1rem;" onclick="this.parentNode.parentNode.removeChild(this.parentNode);">Удалить</button></div></div>';
            pms.selectedHost.catalogItemEditorParameter[parameter.parameter] = ++number;
        }

        function loadCatalogParameters() {
            if (pms.selectedHost.catalogParameters) {
                return new Promise(function (resolve, reject) {
                    return resolve(true);
                });
            }
            return pluginIo('console/getParameters').then(function (response) {
                if (!response.status || !response.response.status || !response.response.parametersList) return false;
                pms.selectedHost.catalogParameters = response.response.parametersList;
                pms.selectedHost.catalogParameter = {};
                for (let i in pms.selectedHost.catalogParameters) {
                    pms.selectedHost.catalogParameter[pms.selectedHost.catalogParameters[i].parameter] = pms.selectedHost.catalogParameters[i];
                }
                return true;
            })
        }

        function showUpdateCatalogItem(itemId) {
            return prepareTemplate('item').then(function () {
                return workspace.require('macy');
            }).then(function (result) {
                if (!result) return result;
                var macy = Macy({
                    container: '.masonry',
                    trueOrder: false,
                    waitForImages: false,
                    mobileFirst: true,
                    margin: {
                        x: 60,
                        y: 20
                    },
                    columns: 1,
                    breakAt: {
                        1200: 3,
                        640: 2
                    }
                });
            });
            if (!pms.selectedHost.catalogParameters) return loadCatalogParameters().then(function (result) {
                if (!result) return alert('Не удалось загрузить параметры каталога');
                showAddCatalogItem(itemId);
            }); else return showAddCatalogItem(itemId);
        }

        function moreImageItemParameters(parameterId, number) {
            if (!pms.selectedHost.catalogParameter[parameterId]) return false;
            if (!pms.selectedHost.catalogItemEditorParameter) pms.selectedHost.catalogItemEditorParameter = {};
            let parameter = pms.selectedHost.catalogParameter[parameterId];
            number = pms.selectedHost.catalogItemEditorParameter[parameter.parameter] ? pms.selectedHost.catalogItemEditorParameter[parameter.parameter] : (number ? parseInt(number) : 0);
            let container = document.getElementById(parameter.parameter + '_container');
            if (!container) return false;
            container.innerHTML += '<div class="flex-right"><input size="30" data-parameter-item-id="' + number + '" id="' + parameter.parameter + '_' + number + '" value="" onchange="imageUpload(this);" type="file"/><button style="margin-left: 1rem;" onclick="this.parentNode.parentNode.removeChild(this.parentNode);">Удалить</button></div></div>';
            pms.selectedHost.catalogItemEditorParameter[parameter.parameter] = ++number;
            if (!pms.selectedHost.catalogSelectedImages) pms.selectedHost.catalogSelectedImages = [];
        }

        function imageUpload(input) { // TODO Fix this Uploader for 2.0
            if (isProgress('imageUpload')) return false;
            setProgress('imageUpload');
            setTimeout(function () {
                setProgress('imageUpload', false);
            }, 500);
            if (!input) return false;
            let files = input.files;
            if (files.length === 0) return false;
            console.debug('imageUpload', 'Браузер считывает изображения...');
            let images = [];
            for (let i in files) {
                if (files.hasOwnProperty(i)) {
                    images.push({
                        'name': files[i].name,
                        'parameter': input.dataset.parameter,
                        'reader': new FileReader()
                    });
                    (function () {
                        let j = images.length - 1;
                        images[i].reader.onloadend = function () {
                            images[j]['dataUrl'] = images[j].reader.result;
                            console.log('Image ready', j, images[j].name);
                            imageReady(images, images[j], input);
                        };
                    })();
                    images[images.length - 1].reader.readAsDataURL(files[i]);
                }
            }
        }

        function imageReady(images, image, input) { // Check ready state for all fetched files
            image.ready = true;
            for (let i in images) {
                if (!images[i].ready) return;
            }
            if (!pms.selectedHost.catalog.selectedImages) pms.selectedHost.catalog.selectedImages = [];
            let imageSectionSource = '';
            for (let i in images) {
                if (!pms.selectedHost.catalog.selectedItem.images) pms.selectedHost.catalog.selectedItem.images = [];
                images[i].index = pms.selectedHost.catalog.selectedItem.images.length;
                pms.selectedHost.catalog.selectedImages[images[i].id] = images[i];
                let targetImagePath = images[i].name;
                if (pms.selectedHost.catalog.imageUploadParameters && pms.selectedHost.catalog.imageUploadParameters.uploadPath)
                    targetImagePath = pms.selectedHost.catalog.imageUploadParameters.uploadPath + targetImagePath;
                pms.selectedHost.catalog.selectedItem.images.push(targetImagePath);
                imageSectionSource += '<figure><img src="' + image.reader.result + '"><button class="remove-image" onclick="removeParameterVariant(\'images\',' + (pms.selectedHost.catalog.selectedItem.images.length - 1) + ');">❌</button></figure>';
            }
            document.querySelector('[data-parameter-section="images"]').querySelector('.images-section').innerHTML += imageSectionSource;
            pms.selectedHost.catalog.macy.recalculate(true);
            // input.parentNode.innerHTML = '<a href="' + getHostUrl() + 'assets/images/' + image.name + '" target="_blank"><img src="' + image.reader.result + '" height="40px"><button style="margin-left: 1rem;" onclick="this.parentNode.parentNode.removeChild(this.parentNode);removeImage(' + image.id + ');">Удалить</button></div>';
            sendImage(image, input);
        }

        function removeImage(imageId) {
            if (!pms.selectedHost.catalogSelectedImages) return;
            pms.selectedHost.catalogSelectedImages[imageId] = false;
            delete pms.selectedHost.catalogSelectedImages[imageId];
        }

        function sendImage(image, input) {
            console.debug('sending', image);
            let imageData = {'name': image.name, 'base64': image.dataUrl || image.reader.result};
            let xhr = new XMLHttpRequest();
            xhr.upload.onprogress = function (event) {
                // document.getElementById('uploadState').innerHTML = event.loaded === event.total ? 'Сервер обрабатывает изображения...' : 'Переданно: ' + parseInt(event.loaded / event.total * 100) + '%';
                console.debug(event.loaded === event.total ? 'Сервер обрабатывает изображения...' : 'Переданно: ' + parseInt(event.loaded / event.total * 100) + '%');
            };
            xhr.onload = xhr.onerror = function () {
                if (this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    if (!response.status) return console.debug(response.statusText || 'Серверу не удалось обработать запрос');//document.getElementById('uploadState').innerHTML = response.statusText || 'Серверу не удалось обработать запрос';
                    // document.getElementById('uploadState').innerHTML = 'Все изображения загружены, можно сохранять';
                    console.debug('Все изображения загружены, можно сохранять');
                    image.path = response.path;
                    image.upload = true;
                    pms.selectedHost.catalog.selectedItem.images[image.index] = image.path;
                    input.value = '';
                    let parameter = Object.assign({}, pms.selectedHost.catalog.itemParameter.images);
                    parameter.data = pms.selectedHost.catalog.selectedItem.images;
                    document.querySelector('[data-parameter-section="images"]').innerHTML = genItemParameter(parameter, pms.selectedHost.catalog.selectedItem);
                    pms.selectedHost.catalog.macy.recalculate(true);
                } else {
                    // return document.getElementById('uploadState').innerHTML = 'Не удалось установить соединение';
                    return console.debug('Не удалось установить соединение');
                }
            };
            xhr.open("POST", pms.config.apiUrl + 'console/host/imageUpload?hostId=' + pms.selectedHost.id, true);
            xhr.send(JSON.stringify(imageData));
        }

        function loadCatalogItems(init, count) {
            return io('console/host/new_pluginRequest', {
                hostId: pms.selectedHost.id,
                requestPath: '/system/plugins/PonomareVlad/catalog/console/getItems',
                getData: {
                    limit: count ? count : 20,
                    offset: pms.selectedHost.catalogItems.length === 0 ? false : Object.keys(pms.selectedHost.catalogItems).length
                }
            }).then(function (response) {
                if (!response.status || !response.data) return false;
                let source = '';
                let items = Object.values(response.data);
                for (let i in items) {
                    let item = pms.selectedHost.catalogItems[items[i].id] = items[i];
                    source += '<li><a href="javascript:void(0);" onclick="showUpdateCatalogItem(\'' + item.id + '\');"><span style="font-weight: bolder;margin-left: 0;margin-right: .5rem;">' + item.id + '</span>' + item.title + '<span class="tree-item-path">' + item.href + '</span></a></li>';
                    // pms.selectedHost.catalogItems[i] = item;
                }
                if (init) pms.workspace.wrapper.innerHTML = '<div class="workspace-section scrollbox" id="workspaceSection"><h3>Последние добавленные объекты в каталоге:</h3><ul id="catalogItemsList">' + source + '</ul><div class="horizontal-flex-menu" style="justify-content: center"><div class="menu-button-section"><button onclick="loadCatalogItems();">Загрузить еще</button></div></div></div>';
                else if (document.getElementById('catalogItemsList')) document.getElementById('catalogItemsList').innerHTML += source;
                return true;
            });
        }

        function prepareTemplate(id, node = pms.workspace.wrapper) {
            return new Promise(function (resolve, reject) {
                resolve(template[id] ? template[id] : (workspace.loadTemplate('plugins/PonomareVlad/catalog/' + id)
                    .then(function (response) {
                        if (!response) return false;
                        return template[id] = response;
                    }))
                );
            }).then(function (template) {
                if (!template) return false;
                let currentPluginData = Object.assign({}, pms.selectedPlugin);
                return workspace.render(template, node).then(function () {
                    return pluginInit(currentPluginData);
                });
            });
        }

        function testWorkspace() {
            return prepareTemplate('list');
        }

        function viewItemPage(id) {
            let itemData = id ? pms.selectedHost.catalog.item[id] : pms.selectedHost.catalog.selectedItem;
            if (!itemData || !itemData.href) return false;
            return window.open(getHostUrl() + itemData.href, 'blank');
        }

        function viewCategoryPage(id) {
            let itemData = id ? pms.selectedHost.catalog.categories[1][id] : pms.selectedHost.catalog.selectedItem;
            if (!itemData || !itemData.href) return false;
            return window.open(getHostUrl() + itemData.href, 'blank');
        }

        function loadItems(parameters, limit, offset, search) {
            limit = limit ? limit : 20;
            offset = offset ? offset : false;
            let data = {};
            if (limit) data.limit = limit;
            if (offset) data.offset = offset;
            if (parameters) data.parameters = parameters;
            if (search) data._search = search;
            return pluginIo('console/getItems', data).then(function (response) {
                // console.debug(response);
                if (!response.status) return false;
                if (parameters || search) return response.data;
                if (!pms.selectedHost.catalog) pms.selectedHost.catalog = {};
                if (!pms.selectedHost.catalog.item) pms.selectedHost.catalog.item = {};
                if (!pms.selectedHost.catalog.items) pms.selectedHost.catalog.items = [];
                // pms.selectedHost.catalog.items.splice(offset, limit, Object.values(response.data));
                Array.prototype.splice.apply(pms.selectedHost.catalog.items, [offset, limit].concat(Object.values(response.data)));
                for (let i in pms.selectedHost.catalog.items) {  // TODO: replace this by for (offset; offset + limit; ++)
                    let item = pms.selectedHost.catalog.items[i];
                    pms.selectedHost.catalog.item[item.id] = item;
                }
                return true;
            });
        }


        function loadItemsCount(parameters, search) {
            let data = {};
            if (parameters) data.parameters = parameters;
            if (search) data._search = search;
            // parameters = parameters ? parameters : {};
            return pluginIo('console/getItemsCount', data).then(function (response) {
                if (!response.status) return false;
                if (parameters || search) return parseInt(response.data);
                if (!pms.selectedHost.catalog) pms.selectedHost.catalog = {};
                pms.selectedHost.catalog.itemsCount = parseInt(response.data);
                return true;
            });
        }

        function loadItemParameters() {
            return pluginIo('console/getParameters', false, {includeVariants: true}).then(function (response) {
                // console.debug(response);
                if (!response.status) return false;
                if (!pms.selectedHost.catalog) pms.selectedHost.catalog = {};
                if (!pms.selectedHost.catalog.itemParameter) pms.selectedHost.catalog.itemParameter = {};
                pms.selectedHost.catalog.itemParameters = response.data;
                for (let i in pms.selectedHost.catalog.itemParameters) {
                    let parameter = pms.selectedHost.catalog.itemParameters[i];
                    if (parameter.variants) {
                        parameter.variant = {};
                        for (let i in parameter.variants) {
                            let variant = parameter.variants[i];
                            parameter.variant[variant.data] = variant;
                        }
                    }
                    pms.selectedHost.catalog.itemParameter[parameter.parameter] = parameter;
                }
                return true;
            });
        }

        function loadCategoryParameters() {
            return pluginIo('console/getCategoryParameters', false, {includeVariants: true}).then(function (response) {
                // console.debug(response);
                if (!response.status) return false;
                if (!pms.selectedHost.catalog) pms.selectedHost.catalog = {};
                if (!pms.selectedHost.catalog.itemParameter) pms.selectedHost.catalog.itemParameter = {};
                pms.selectedHost.catalog.itemParameters = response.data;
                for (let i in pms.selectedHost.catalog.itemParameters) {
                    let parameter = pms.selectedHost.catalog.itemParameters[i];
                    if (parameter.variants) {
                        parameter.variant = {};
                        for (let i in parameter.variants) {
                            let variant = parameter.variants[i];
                            parameter.variant[variant.data] = variant;
                        }
                    }
                    pms.selectedHost.catalog.itemParameter[parameter.parameter] = parameter;
                }
                return true;
            });
        }

        function loadItemData(id) {
            if (!id) return false;
            return pluginIo('console/getItem', {id: id}).then(function (response) {
                // console.debug(response);
                if (!response.status) return false;
                if (!pms.selectedHost.catalog) pms.selectedHost.catalog = {};
                if (!pms.selectedHost.catalog.item) pms.selectedHost.catalog.item = {};
                let item = response.data[id];
                pms.selectedHost.catalog.item[item.id] = item;
                return item.id;
            });
        }

        function loadCategoryData(id) {
            if (!id) return false;
            return pluginIo('console/getCategory', {id: id}).then(function (response) {
                // console.debug(response);
                if (!response.status) return false;
                if (!pms.selectedHost.catalog) pms.selectedHost.catalog = {};
                if (!pms.selectedHost.catalog.item) pms.selectedHost.catalog.item = {};
                let category = response.data[id];
                pms.selectedHost.catalog.category[category.id] = category;
                return category.id;
            });
        }

        function showItemsList(targetNode, limit, offset, itemsList) {
            targetNode = targetNode && targetNode.innerHTML ? targetNode : (targetNode ? document.getElementById(targetNode) : document.getElementById('itemsList'));
            // console.debug('showItemsList init with: ', arguments);
            if (((!itemsList || typeof itemsList !== "object") && (!pms.selectedHost.catalog || !pms.selectedHost.catalog.items)) || !targetNode) return false;
            // console.debug('showItemsList preparing passed');
            let source = '';
            itemsList = (itemsList && typeof itemsList === "object") ? (itemsList instanceof Array ? itemsList : Object.values(itemsList)) : pms.selectedHost.catalog.items;
            limit = limit ? limit : itemsList.length;
            offset = offset ? offset : 0;
            // console.debug('showItemsList parameters: ', limit, offset, itemsList);
            // console.debug('showItemsList called!', limit, offset);
            // console.debug('showItemsList real items count', pms.selectedHost.catalog.items.length, pms.selectedHost.catalog.items);
            let itemsCount = 0;
            // for (let i in pms.selectedHost.catalog.items) {
            for (let i = offset; i < offset + limit; i++) {
                if (!itemsList[i]) continue;
                itemsCount++;
                let item = itemsList[i];
                let controlSection = '';
                if (item['href']) controlSection += '<button onclick="viewItemPage(' + item.id + ');event.stopPropagation();" title="Открыть на сайте">👁</button>';
                if (item['stats']) controlSection += '<button title="Статистика">📈</button>';
                // controlSection += '<button onclick="showItemParametersPage(' + item.id + ')" title="Редактировать">✏️</button>';
                controlSection += '<button title="Удалить" onclick="listItemClick(' + item.id + ',\'deleteItem\');event.stopPropagation();">❌</button>';
                let modifiersSection = '';
                for (let i in item.modifies) modifiersSection += item.modifies[i] + ' &nbsp; ';
                source += '<li onclick="listItemClick(' + item.id + ',\'showItemParametersPage\');" data-list-item="' + item.id + '"><div>' + item.article_ru + '</div><div>' + item.title + '</div><div class="hide-on-mobile">' + modifiersSection + '</div><div class="flex-right">' + controlSection + '</div></li>';
            }
            // console.debug('showItemsList fetched items:', itemsCount, source);
            if (offset) targetNode.innerHTML += source;
            else targetNode.innerHTML = source;
            return itemsCount;
        }

        function showItemParameters(id) {
            let targetNode = document.getElementById('parametersList');
            if (!pms.selectedHost.catalog || !pms.selectedHost.catalog.itemParameters || !targetNode) return false;
            // let item = pms.selectedHost.catalog.item[id];
            // let item = pms.selectedHost.catalog.selectedItem = {};
            if (id && pms.selectedHost.catalog.item && pms.selectedHost.catalog.item[id]) pms.selectedHost.catalog.selectedItem = Object.assign({}, pms.selectedHost.catalog.item[id]);
            else pms.selectedHost.catalog.selectedItem = {};
            pms.onLeavePage.push(function () {
                pms.selectedHost.catalog.selectedItem = false;
                delete pms.selectedHost.catalog.selectedItem;
                return true;
            });
            // console.debug('showItemParameters', pms.selectedHost.catalog.item[id], pms.selectedHost.catalog.selectedItem);
            let item = pms.selectedHost.catalog.selectedItem;
            let source = '';
            source += '<div class="material-box item"><h1>Название</h1><h2>Отображается в списках товаров, а так же в Title и H1 на странице товара</h2><div class="input-section"><input type="text" placeholder="Название" value="' + (item.title ? item.title : '') + '" data-parameter="title" onchange="fetchParameterChanges(\'title\');"></div></div>';
            source += '<div class="material-box item"><h1>Описание</h1><h2>Отображается на странице товара</h2><div class="input-section"><textarea placeholder="Описание" data-parameter="description" onchange="fetchParameterChanges(\'description\');">' + (item.description ? item.description : '') + '</textarea></div></div>';
            // source += '<div class="material-box item"><h1>Путь</h1><h2>Часть адреса страницы, выводиться сразу за адресом категории</h2><div class="input-section"><input type="text" placeholder="Путь" value="' + (item.path ? item.path : '') + '"></div></div>';
            for (let i in pms.selectedHost.catalog.itemParameters) {
                let parameter = pms.selectedHost.catalog.itemParameters[i];
                if (item[parameter.parameter]) parameter.data = item[parameter.parameter];
                let title = parameter.title ? parameter.title : parameter.parameter;
                let description = parameter.description ? parameter.description : false;
                let parameterSource = genItemParameter(parameter, item);
                if (!parameterSource || parameterSource === '') continue;
                source += '<div class="material-box item"><h1>' + title + '</h1>' + (description ? '<h2>' + description + '</h2>' : '');
                source += '<div data-parameter-section="' + parameter.parameter + '">' + parameterSource + '</div>';
                /*switch (parameter.type) {
                    case 'int':
                        source += '<div class="input-section">';
                        if (parameter.parameter === 'category') {
                            source += '<select><option value="' + parameter.data + '">' + parameter.data + '</option></select>';
                        } else if (parameter.parameter === 'collection') {
                            source += '<select><option value="' + parameter.data + '">' + parameter.data + '</option></select>';
                        } else {
                            source += '<input type="number" placeholder="' + title + '" value="' + parameter.data + '">';
                        }
                        source += '</div>';
                        break;
                    case 'array':
                        if (parameter.parameter === 'images') {
                            source += '<div class="images-section">';
                            if (parameter.data && parameter.data.length > 0) {
                                for (let i in parameter.data) {
                                    source += '<figure><img src="' + getHostUrl(true) + parameter.data[i] + '"><button class="remove-image">❌</button></figure>';
                                }
                            } else {
                                source += 'Нет изображений';
                            }
                            source += '</div><div class="input-section"><input type="file" placeholder="Добавить изображение"></div>';
                        } else {
                            source += '<ul class="list-section">';
                            if (parameter.data && parameter.data.length > 0) {
                                for (let i in parameter.data) {
                                    source += '<li>' + parameter.data + ' <button>❌</button></li>';
                                }
                            } else {
                                source += 'Нет элементов';
                            }
                            source += '</ul><div class="input-section"><input type="text" placeholder="Добавить элемент"></div>';
                        }
                        break;
                    case 'select':
                        if (parseInt(parameter.count) === 1) {
                            source += '<div class="input-section">';
                            source += '<select><option selected value="' + parameter.data + '">' + (parameter.data ? parameter.data : 'Не указано') + '</option></select>';
                            source += '</div>';
                        } else {
                            source += '<ul class="list-section">';
                            if (parameter.data && parameter.data.length > 0) {
                                for (let i in parameter.data) {
                                    if (parameter.parameter === 'modifies') source += '<li>' + parameter.data[i].title + ' <button>❌</button></li>';
                                    else source += '<li>' + parameter.data[i] + ' <button>❌</button></li>';
                                }
                            } else {
                                source += 'Нет элементов';
                            }
                            source += '</ul><div class="input-section"><select><option selected disabled>Добавить элемент</option></select></div>';
                        }
                        break;
                    default:
                        source += '<div class="input-section"><input type="text" placeholder="' + title + '" value="' + parameter.data + '"></div>';
                        break;
                }*/
                source += '</div>';
                // source += '<li><div>' + item.id + '</div><div>' + item.title + '</div><div class="hide-on-mobile">' + item.description + '</div><div class="flex-right">' + controlSection + '</div></li>';
            }
            targetNode.innerHTML = source;
            return true;
        }

        function showCategoryParameters(id) {
            let targetNode = document.getElementById('parametersList');
            if (!pms.selectedHost.catalog || !pms.selectedHost.catalog.itemParameters || !targetNode) return false;
            // let item = pms.selectedHost.catalog.item[id];
            // let item = pms.selectedHost.catalog.selectedItem = {};
            if (id && pms.selectedHost.catalog.item && pms.selectedHost.catalog.item[id]) pms.selectedHost.catalog.selectedItem = Object.assign({}, pms.selectedHost.catalog.item[id]);
            else pms.selectedHost.catalog.selectedItem = {};
            pms.onLeavePage.push(function () {
                pms.selectedHost.catalog.selectedItem = false;
                delete pms.selectedHost.catalog.selectedItem;
                return true;
            });
            // console.debug('showItemParameters', pms.selectedHost.catalog.item[id], pms.selectedHost.catalog.selectedItem);
            let item = pms.selectedHost.catalog.selectedItem;
            let source = '';
            source += '<div class="material-box item"><h1>Название</h1><h2>Отображается в списках товаров, а так же в Title и H1 на странице товара</h2><div class="input-section"><input type="text" placeholder="Название" value="' + (item.title ? item.title : '') + '" data-parameter="title" onchange="fetchParameterChanges(\'title\');"></div></div>';
            source += '<div class="material-box item"><h1>Описание</h1><h2>Отображается на странице товара</h2><div class="input-section"><textarea placeholder="Описание" data-parameter="description" onchange="fetchParameterChanges(\'description\');">' + (item.description ? item.description : '') + '</textarea></div></div>';
            // source += '<div class="material-box item"><h1>Путь</h1><h2>Часть адреса страницы, выводиться сразу за адресом категории</h2><div class="input-section"><input type="text" placeholder="Путь" value="' + (item.path ? item.path : '') + '"></div></div>';
            for (let i in pms.selectedHost.catalog.itemParameters) {
                let parameter = pms.selectedHost.catalog.itemParameters[i];
                if (item[parameter.parameter]) parameter.data = item[parameter.parameter];
                let title = parameter.title ? parameter.title : parameter.parameter;
                let description = parameter.description ? parameter.description : false;
                let parameterSource = genItemParameter(parameter, item);
                if (!parameterSource || parameterSource === '') continue;
                source += '<div class="material-box item"><h1>' + title + '</h1>' + (description ? '<h2>' + description + '</h2>' : '');
                source += '<div data-parameter-section="' + parameter.parameter + '">' + parameterSource + '</div>';
                /*switch (parameter.type) {
                    case 'int':
                        source += '<div class="input-section">';
                        if (parameter.parameter === 'category') {
                            source += '<select><option value="' + parameter.data + '">' + parameter.data + '</option></select>';
                        } else if (parameter.parameter === 'collection') {
                            source += '<select><option value="' + parameter.data + '">' + parameter.data + '</option></select>';
                        } else {
                            source += '<input type="number" placeholder="' + title + '" value="' + parameter.data + '">';
                        }
                        source += '</div>';
                        break;
                    case 'array':
                        if (parameter.parameter === 'images') {
                            source += '<div class="images-section">';
                            if (parameter.data && parameter.data.length > 0) {
                                for (let i in parameter.data) {
                                    source += '<figure><img src="' + getHostUrl(true) + parameter.data[i] + '"><button class="remove-image">❌</button></figure>';
                                }
                            } else {
                                source += 'Нет изображений';
                            }
                            source += '</div><div class="input-section"><input type="file" placeholder="Добавить изображение"></div>';
                        } else {
                            source += '<ul class="list-section">';
                            if (parameter.data && parameter.data.length > 0) {
                                for (let i in parameter.data) {
                                    source += '<li>' + parameter.data + ' <button>❌</button></li>';
                                }
                            } else {
                                source += 'Нет элементов';
                            }
                            source += '</ul><div class="input-section"><input type="text" placeholder="Добавить элемент"></div>';
                        }
                        break;
                    case 'select':
                        if (parseInt(parameter.count) === 1) {
                            source += '<div class="input-section">';
                            source += '<select><option selected value="' + parameter.data + '">' + (parameter.data ? parameter.data : 'Не указано') + '</option></select>';
                            source += '</div>';
                        } else {
                            source += '<ul class="list-section">';
                            if (parameter.data && parameter.data.length > 0) {
                                for (let i in parameter.data) {
                                    if (parameter.parameter === 'modifies') source += '<li>' + parameter.data[i].title + ' <button>❌</button></li>';
                                    else source += '<li>' + parameter.data[i] + ' <button>❌</button></li>';
                                }
                            } else {
                                source += 'Нет элементов';
                            }
                            source += '</ul><div class="input-section"><select><option selected disabled>Добавить элемент</option></select></div>';
                        }
                        break;
                    default:
                        source += '<div class="input-section"><input type="text" placeholder="' + title + '" value="' + parameter.data + '"></div>';
                        break;
                }*/
                source += '</div>';
                // source += '<li><div>' + item.id + '</div><div>' + item.title + '</div><div class="hide-on-mobile">' + item.description + '</div><div class="flex-right">' + controlSection + '</div></li>';
            }
            targetNode.innerHTML = source;
            return true;
        }

        function genItemParameter(parameterData, itemData) {
            if (!parameterData) return false;
            let parameterSource = false;
            if (parameterData.format) {
                let worker = parseURL(parameterData.format);
                let workerId = worker.pathname.split('/').pop();
                if (catalog.config.parameterWorkers[workerId] && catalog.config.parameterWorkers[workerId]['gen']) {
                    let workerParameters = parseQuery(worker.search);
                    return catalog.config.parameterWorkers[workerId]['gen'](workerParameters, parameterData, itemData);
                }
            }
            // if (!parameterSource) {
            let data = false;
            switch (parameterData.type) {
                case 'int':
                    data = parameterData.data ? parameterData.data : '';
                    parameterSource = '<div class="input-section"><input type="number" placeholder="' + parameterData.title + '" value="' + data + '" data-parameter="' + parameterData.parameter + '" onchange="fetchParameterChanges(\'' + parameterData.parameter + '\');"></div>';
                    break;
                case 'array':
                    parameterSource = '<ul class="list-section">';
                    if (parameterData.data && parameterData.data.length > 0) {
                        for (let i in parameterData.data) {
                            parameterSource += '<li>' + parameterData.data[i] + ' <button onclick="removeParameterVariant(\'' + parameterData.parameter + '\',' + i + ');">❌</button></li>';
                        }
                    } else {
                        parameterSource += 'Нет элементов';
                    }
                    parameterSource += '</ul><div class="input-section"><input type="text" placeholder="Добавить элемент" data-parameter="' + parameterData.parameter + '"> <button onclick="addParameterVariant(\'' + parameterData.parameter + '\');">Добавить</button></div>';
                    break;
                case 'select':
                    if (parameterData.count && (parseInt(parameterData.count) === 1)) {
                        parameterSource = '<div class="input-section"><select data-parameter="' + parameterData.parameter + '" onchange="fetchParameterChanges(\'' + parameterData.parameter + '\');">';
                        parameterSource += '<option value="false">Не указано</option>';
                        if (parameterData.variants) for (let i in parameterData.variants) {
                            let variant = parameterData.variants[i];
                            if (parameterData.data) variant.selected = parameterData.data == variant.data;
                            parameterSource += '<option value="' + variant.data + '" ' + (variant.selected ? 'selected' : '') + '>' + variant.title + '</option>';
                        } else if (parameterData.data) parameterSource += '<option value="' + parameterData.data + '" selected>' + parameterData.data + '</option>';
                        // if (parameterData.data) parameterSource += '<option selected value="' + parameterData.data + '">' + parameterData.data + '</option>';
                        parameterSource += '</select></div>';
                    } else {
                        parameterSource = '<ul class="list-section">';
                        if (parameterData.data && parameterData.data.length > 0) {
                            for (let i in parameterData.data) {
                                let data = parameterData.data[i];
                                let title = data;
                                if (parameterData.variant && parameterData.variant[data]) title = parameterData.variant[data].title;
                                parameterSource += '<li data-parameter-' + parameterData.parameter + '-item="' + i + '" data-parameter-' + parameterData.parameter + '-item-data="' + data + '">' + title + ' <button onclick="removeParameterVariant(\'' + parameterData.parameter + '\',' + i + ');">❌</button></li>';
                            }
                        } else {
                            parameterSource += 'Нет элементов';
                        }
                        parameterSource += '</ul><div class="input-section"><select data-parameter="' + parameterData.parameter + '">';
                        if (parameterData.variants) for (let i in parameterData.variants) {
                            let variant = parameterData.variants[i];
                            if (parameterData.data) variant.selected = parameterData.data === variant.data;
                            parameterSource += '<option value="' + variant.data + '" ' + (variant.selected ? 'disabled' : '') + '>' + variant.title + '</option>';
                        }
                        // parameterSource += '<option selected disabled>Добавить элемент</option>';
                        parameterSource += '</select> <button onclick="addParameterVariant(\'' + parameterData.parameter + '\');">Добавить</button></div>';
                    }
                    break;
                default:
                    data = parameterData.data ? parameterData.data : '';
                    parameterSource = '<div class="input-section"><input type="text" placeholder="' + parameterData.title + '" value="' + data + '" data-parameter="' + parameterData.parameter + '" onchange="fetchParameterChanges(\'' + parameterData.parameter + '\');"></div>';
                    break;
            }
            // }
            return parameterSource;
        }

        function genImagesParameter(parameters, parameterData, itemData) {
            let parameterSource = '<div class="images-section">';
            if (parameterData.data && parameterData.data.length > 0) {
                for (let i in parameterData.data) {
                    let imagePath = parameterData.data[i];
                    if (parameters.thumb) {
                        let tmpImage = imagePath.split('.');
                        let imageExtension = tmpImage.pop();
                        tmpImage.push('200', imageExtension);
                        imagePath = tmpImage.join('.');
                        imagePath = '/images/cache/thumb' + imagePath;
                    }
                    parameterSource += '<figure><img src="' + getHostUrl(true) + imagePath + '"><button class="remove-image" onclick="removeParameterVariant(\'' + parameterData.parameter + '\',' + i + ');">❌</button></figure>';
                }
            } else {
                parameterSource += 'Нет изображений';
            }
            parameterSource += '</div>';
            if (parameters.upload) parameterSource += '<div class="input-section"><input type="file" placeholder="Добавить изображение" data-parameter="' + parameterData.parameter + '" onchange="addParameterVariant(\'' + parameterData.parameter + '\');imageUpload(this);"></div>';
            return parameterSource;
        }

        function addImagesParameter(parameters, parameterData) {
            pms.selectedHost.catalog.imageUploadParameters = parameters;
            return imageUpload(document.querySelector('[data-parameter="' + parameterData.parameter + '"]'));
            // return true;
        }

        function removeImagesParameter(parameters, parameterData, index) {
            return true;
        }

        function genHiddenParameter(parameters, parameterData, itemData) {
            return false;
        }

        function intMashonary(container) {
            container = container ? container : '.masonry';
            return workspace.require('macy').then(function (result) {
                if (!result) return result;
                let macy = Macy({
                    container: container,
                    trueOrder: false,
                    waitForImages: false,
                    mobileFirst: true,
                    margin: {
                        x: 60,
                        y: 20
                    },
                    columns: 1,
                    breakAt: {
                        2200: 6,
                        1900: 5,
                        1600: 4,
                        1200: 3,
                        640: 2
                    }
                });
                return true;
            });
        }

        function infinityScroll(loadMethod, renderMethod, eventSection, targetSection, limit, offset, maxOffset, preloadScreeenCount, parameters, search) {
            if (!loadMethod || !targetSection) return false;
            let workspaceSection = document.getElementById(eventSection ? eventSection : 'workspaceSection');
            limit = limit ? limit : 20;
            offset = offset ? offset : false;
            preloadScreeenCount = preloadScreeenCount ? preloadScreeenCount : 4;
            // console.debug('infinityScroll ready!', targetSection, workspaceSection);
            workspaceSection.onscroll = function () { // TODO: Make AutoLoad more Items
                // console.debug('infinityScroll event called!');
                if (maxOffset && (offset > maxOffset)) return true;
                if (workspaceSection.scrollTop > (workspaceSection.scrollHeight - (workspaceSection.clientHeight * preloadScreeenCount))) {
                    if (isProgress(targetSection)) return false;
                    setProgress(targetSection);
                    showLoadingIndicator();
                    // console.debug('infinityScroll loading', targetSection, limit, offset);
                    return loadMethod(parameters, limit, offset, search).then(function (result) {
                        if (!result) return result;
                        // console.debug('infinityScroll beforeRender items count:', pms.selectedHost.catalog.items.length);
                        return renderMethod(targetSection, limit, offset, result);
                    }).then(function () {
                        offset += limit;
                        setProgress(targetSection, false);
                        hideLoadingIndicator();
                        // console.debug('infinityScroll loading complete', targetSection);
                        return true;
                    });
                }
            };
        }

        function showItemsListPage(parameters, disableHistory) {
            let listSectionId = 'itemsList';
            return loadItems(parameters, 120)
                .then(function (result) {
                    if (!result) return result;
                    if (!disableHistory) history.pushState({
                        type: 'plugin',
                        author: 'PonomareVlad',
                        plugin: 'catalog',
                        action: 'items_catalog_plugin'
                    }, "Товары");
                    return prepareTemplate('list');
                })
                .then(function (result) {
                    if (!result) return result;
                    // let listSection = document.getElementById(listSectionId);
                    let controlsMenuSource = '<div class="flex-left">';
                    controlsMenuSource += '</div><div class="flex-right">';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="addItemButton" onclick="menuButtonClick(\'addItemButton\',\'showItemParametersPage\');">Добавить товар</button></div>';
                    controlsMenuSource += '</div>';
                    document.getElementById('controls-menu').innerHTML = controlsMenuSource;
                    return showItemsList(listSectionId);
                })
                .then(function (result) {
                    if (!result) return result;
                    return loadItemsCount(parameters);
                })
                .then(function (result) {
                    if (!result) createNotification('Каталог', 'Не удалось загрузить количество товаров', pms.config.icon);
                    infinityScroll(loadItems, showItemsList, 'workspaceSection', listSectionId, 20, 120, pms.selectedHost.catalog.itemsCount, 4, parameters);
                    return true;
                });
        }

        function showCollectionsListPage(id = 0) {
            if (!pms.selectedHost.catalog) pms.selectedHost.catalog = {};
            pms.selectedHost.catalog.selectedCollection = {};
            pms.selectedHost.catalog.collections = [];
            let listSectionId = 'itemsList';
            return loadCollection(id)
                .then(function (result) {
                    if (!result) return result;
                    return prepareTemplate('categories');
                })
                .then(function (result) {
                    if (!result) return result;
                    //let listSection = document.getElementById(listSectionId);
                    let controlsMenuSource = '<div class="flex-left">';
                    controlsMenuSource += '</div><div class="flex-right">';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="addCollectionButton" onclick="newCollection();">Добавить коллекцию</button></div>';
                    controlsMenuSource += '</div>';
                    document.getElementById('controls-menu').innerHTML = controlsMenuSource;
                    return showCollectionsList(listSectionId, 120, 0);
                })
                .then(function (result) {
                    if (!result) return result;
                    return true;//loadItemsCount(parameters);
                })
                .then(function (result) {
                    //if (!result) createNotification('Каталог', 'Не удалось загрузить количество категорий', pms.config.icon);
                    //infinityScroll(loadItems, showItemsList, 'workspaceSection', listSectionId, 20, 120, pms.selectedHost.catalog.itemsCount, 4, parameters);
                    return true;
                });
        }


        function showCategoriesListPage(id = 0) {
            if (!pms.selectedHost.catalog) pms.selectedHost.catalog = {};
            pms.selectedHost.catalog.selectedCategory = {};
            pms.selectedHost.catalog.childCategories = [];
            let categorySectionId = 'itemShow';
            let listSectionId = 'itemsList';
            return loadCategory(id)
                .then(function (result) {
                    if (!result) return result;
                    return prepareTemplate('categories');
                })
                .then(function (result) {
                    if (!result) return result;
                    //let listSection = document.getElementById(listSectionId);
                    let controlsMenuSource = '<div class="flex-left">';
                    controlsMenuSource += '</div><div class="flex-right">';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="addCategoryButton" onclick="newCategory();">Добавить категорию</button></div>';
                    controlsMenuSource += '</div>';
                    document.getElementById('controls-menu').innerHTML = controlsMenuSource;
                    return showCategoriesList(listSectionId, 120, 0);
                })
                .then(function (result) {
                    if (!result) return result;
                    return true;//loadItemsCount(parameters);
                })
                .then(function (result) {
                    //if (!result) createNotification('Каталог', 'Не удалось загрузить количество категорий', pms.config.icon);
                    //infinityScroll(loadItems, showItemsList, 'workspaceSection', listSectionId, 20, 120, pms.selectedHost.catalog.itemsCount, 4, parameters);
                    return true;
                });
        }

        function loadCollection(id) {
            let data = {};
            if (id) data.id = id;

            return pluginIo('console/getCollection', data).then(function (response) {
                console.debug(response);
                if (!response.status) return false;
                if (response.data.collection) {
                    pms.selectedHost.catalog.selectedCollection = response.data.collection;
                    if (response.data.collection.description == null)
                        pms.selectedHost.catalog.selectedCollection.description = "";
                }
                if (response.data.collections)
                    pms.selectedHost.catalog.collections = response.data.collections;


                return true;
            });
        }

        function saveCollection() {
            let data = {};

            pms.selectedHost.catalog.selectedCollection.title = document.getElementById('collection-title').value;
            pms.selectedHost.catalog.selectedCollection.description = document.getElementById('collection-description').value;
            pms.selectedHost.catalog.selectedCollection.path = document.getElementById('collection-path').value;
            if (pms.selectedHost.catalog.selectedCollection.title == "") {
                alert("Поле Название обязательно для заполнения");
                return false;
            }
            return pluginIo('console/saveCollection', false, {parameters: pms.selectedHost.catalog.selectedCollection}).then(function (response) {
                if (!response) return false;//createNotification('Каталог', 'Произошла ошибка при сохранении', pms.config.icon);
                if (!response.status || !response.unique) {
                    createNotification('Каталог', 'Запись не уникальна, выберите другое название', pms.config.icon);
                    return false;
                }
                if (response.id && response.id !== true)
                    pms.selectedHost.catalog.selectedCollection.id = response.id;
                createNotification('Каталог', 'Коллекция сохранена', pms.config.icon);
                return true;
            }).then(function (result) {
                if (!result) return result;
                return showCollectionsListPage()
            });
        }

        function deleteCollection() {
            let data = {};
            return pluginIo('console/deleteCollection', false, {parameters: pms.selectedHost.catalog.selectedCollection}).then(function (response) {
                if (!response || !response.status) return false;//createNotification('Каталог', 'Произошла ошибка при сохранении', pms.config.icon);
                createNotification('Каталог', 'Коллекция удалена', pms.config.icon);
                return true;
            }).then(function (result) {
                if (!result) return result;
                return showCollectionsListPage()
            });
        }


        function newCollection() {
            let categoryTargetNode = document.getElementById('itemShow');


            let html = `
                <div id="controls-menu-itemShow" class="horizontal-flex-menu">
                    <div class="flex-left">
                        <div class="menu-button-section">
                            <button onclick="showCollectionsListPage();">Назад</button>
                        </div>
                    </div>
                    <div class="flex-right">
                        <div class="menu-button-section">
                            <button onclick="saveCollection()">Сохранить</button>
                        </div>
                        <!--<div class="menu-button-section">-->
                            <!--<button>Посмотреть</button>-->
                        <!--</div>-->
                        <!--<div class="menu-button-section">-->
                            <!--<button>Удалить</button>-->
                        <!--</div>-->
                    </div>
                </div>
                <div class="masonry" >
                     <div class="material-box item">
                        <h1>Название</h1>
                        <div class="input-section">
                            <input id="collection-title" type="text" placeholder="Название" value="">
                        </div>
                    </div>
                    <div class="material-box item">
                        <h1>Путь (латинскими буквами)</h1>
                        <div class="input-section">
                            <input id="collection-path" type="text" placeholder="Путь" value="">
                        </div>
                    </div>
                    <div class="material-box item">
                        <h1>Описание</h1>
                        <div class="input-section">
                            <textarea id="collection-description" placeholder="Описание"></textarea>
                        </div>
                    </div>
                </div>
            `;

            categoryTargetNode.innerHTML = html;
            categoryTargetNode.style.display = 'block';
        }

        function showCollectionsList(targetNode, limit, offset, collectionList) {

            let categoryTargetNode = document.getElementById('itemShow');
            //if((!pms.selectedHost.catalog || !pms.selectedHost.catalog.selectedCategory) || !categoryTargetNode) return false;
            if (pms.selectedHost.catalog.selectedCollection.length != 0) {
                let removeButton =
                    `<div class="menu-button-section">
                            <button onclick="deleteCollection()">Удалить</button>
                        </div>`;


                let collection = pms.selectedHost.catalog.selectedCollection;
                let html = `
                <div id="controls-menu-itemShow" class="horizontal-flex-menu">
                    <div class="flex-left">
                        <div class="menu-button-section">
                            <button onclick="showCollectionsListPage();">Назад</button>
                        </div>
                    </div>
                    <div class="flex-right">
                        <div class="menu-button-section">
                            <button onclick="saveCollection()">Сохранить</button>
                        </div>
                        ${removeButton}                        
                    </div>
                </div>
                <div class="masonry" >
                     <div class="material-box item">
                        <h1>Название</h1>
                        <div class="input-section">
                            <input id="collection-title" type="text" placeholder="Название" value="${collection.title}">
                        </div>
                    </div>
                     <div class="material-box item">
                        <h1>Путь (латинскими буквами)</h1>
                        <div class="input-section">
                            <input id="collection-path" type="text" placeholder="Путь" value="${collection.path}">
                        </div>
                    </div>
                    <div class="material-box item">
                        <h1>Описание</h1>
                        <div class="input-section">
                            <textarea id="collection-description" placeholder="Описание">${collection.description}</textarea>
                        </div>
                    </div>
                </div>
            `;

                categoryTargetNode.innerHTML = html;
                categoryTargetNode.style.display = 'block';
            } else categoryTargetNode.style.display = 'none';


            let itemsCount = 0;
            targetNode = targetNode && targetNode.innerHTML ? targetNode : (targetNode ? document.getElementById(targetNode) : document.getElementById('itemsList'));
            if (pms.selectedHost.catalog.collections.length != 0) {
                // console.debug('showItemsList init with: ', arguments);
                if (((!collectionList || typeof collectionList !== "object") && (!pms.selectedHost.catalog || !pms.selectedHost.catalog.collections)) || !targetNode) return false;
                // console.debug('showItemsList preparing passed');
                let source = '';
                collectionList = (collectionList && typeof collectionList === "object") ? (collectionList instanceof Array ? collectionList : Object.values(collectionList)) : pms.selectedHost.catalog.collections;
                limit = limit ? limit : collectionList.length;
                offset = offset ? offset : 0;
                // console.debug('showItemsList parameters: ', limit, offset, itemsList);
                // console.debug('showItemsList called!', limit, offset);
                // console.debug('showItemsList real items count', pms.selectedHost.catalog.items.length, pms.selectedHost.catalog.items);

                // for (let i in pms.selectedHost.catalog.items) {
                for (let i = offset; i < offset + limit; i++) {
                    if (!collectionList[i]) continue;
                    itemsCount++;
                    let item = collectionList[i];
                    let controlSection = '';
                    //if (item['href']) controlSection += '<button onclick="viewCategoryPage(' + item.id + ');event.stopPropagation();" title="Открыть на сайте">👁</button>';
                    // controlSection += '<button onclick="showItemParametersPage(' + item.id + ')" title="Редактировать">✏️</button>';
                    // controlSection += '<button title="Удалить" onclick="listCategoryClick(' + item.id + ',\'deleteCategory\');event.stopPropagation();">❌</button>';


                    source += '<li onclick="showCollectionsListPage(' + item.id + ');" data-list-item="' + item.id + '"><div>' + item.id + '</div><div>' + item.title + '</div><div class="flex-right">' + controlSection + '</div></li>';
                }
                // console.debug('showItemsList fetched items:', itemsCount, source);

                targetNode.innerHTML = source;
                targetNode.style.display = 'block';
            } else {
                targetNode.style.display = 'none';
            }
            return itemsCount;
        }


        function loadCategory(id) {
            let data = {};
            if (id) data.id = id;

            return pluginIo('console/getCategory', data).then(function (response) {
                console.debug(response);
                if (!response.status) return false;
                if (response.data.category) {
                    pms.selectedHost.catalog.selectedCategory = response.data.category;
                    if (response.data.category.description == null)
                        pms.selectedHost.catalog.selectedCategory.description = "";
                }
                if (response.data.categories)
                    pms.selectedHost.catalog.childCategories = response.data.categories;
                pms.selectedHost.catalog.canRemoveCategory = false;

                if (response.data.categories.length == 0)
                    pms.selectedHost.catalog.canRemoveCategory = true;
                else
                    pms.selectedHost.catalog.canRemoveCategory = false;

                return true;
            });
        }

        function saveCategory() {
            let data = {};
            if (pms.selectedHost.catalog.selectedCategory.parent_category == 0) {
                pms.selectedHost.catalog.selectedCategory.parent_category = null;
            }
            pms.selectedHost.catalog.selectedCategory.title = document.getElementById('category-title').value;
            pms.selectedHost.catalog.selectedCategory.description = document.getElementById('category-description').value;
            pms.selectedHost.catalog.selectedCategory.path = document.getElementById('category-path').value;
            if (pms.selectedHost.catalog.selectedCategory.title == "") {
                alert("Поле Название обязательно для заполнения");
                return false;
            }
            return pluginIo('console/saveCategory', false, {parameters: pms.selectedHost.catalog.selectedCategory}).then(function (response) {
                if (!response) return false;//createNotification('Каталог', 'Произошла ошибка при сохранении', pms.config.icon);
                if (!response.status || !response.unique) {
                    createNotification('Каталог', 'Запись не уникальна, выберите другое название', pms.config.icon);
                    return false;
                }
                if (response.id && response.id !== true)
                    pms.selectedHost.catalog.selectedCategory.id = response.id;
                createNotification('Каталог', 'Категория сохранена', pms.config.icon);
                return true;
            }).then(function (result) {
                if (!result) return result;
                return showCategoriesListPage(pms.selectedHost.catalog.selectedCategory.id)
            });
        }

        function deleteCategory() {
            let data = {};
            if (pms.selectedHost.catalog.selectedCategory.parent_category == 0) {
                pms.selectedHost.catalog.selectedCategory.parent_category = null;
            }
            return pluginIo('console/deleteCategory', false, {parameters: pms.selectedHost.catalog.selectedCategory}).then(function (response) {
                if (!response || !response.status) return false;//createNotification('Каталог', 'Произошла ошибка при сохранении', pms.config.icon);
                createNotification('Каталог', 'Категория удалена', pms.config.icon);
                return true;
            }).then(function (result) {
                if (!result) return result;
                return showCategoriesListPage(pms.selectedHost.catalog.selectedCategory.parent_category)
            });
        }


        function newCategory() {
            let categoryTargetNode = document.getElementById('itemShow');
            let parent_category = null;
            pms.selectedHost.catalog.canRemoveCategory = false;

            if (pms.selectedHost.catalog.selectedCategory.length != 0) {
                parent_category = pms.selectedHost.catalog.selectedCategory.parent_category;
                pms.selectedHost.catalog.selectedCategory.parent_category = pms.selectedHost.catalog.selectedCategory.id;
            }
            pms.selectedHost.catalog.selectedCategory.id = null;

            let html = `
                <div id="controls-menu-itemShow" class="horizontal-flex-menu">
                    <div class="flex-left">
                        <div class="menu-button-section">
                            <button onclick="showCategoriesListPage(${parent_category});">Назад</button>
                        </div>
                    </div>
                    <div class="flex-right">
                        <div class="menu-button-section">
                            <button onclick="saveCategory()">Сохранить</button>
                        </div>
                        <!--<div class="menu-button-section">-->
                            <!--<button>Посмотреть</button>-->
                        <!--</div>-->
                        <!--<div class="menu-button-section">-->
                            <!--<button>Удалить</button>-->
                        <!--</div>-->
                    </div>
                </div>
                <div class="masonry" >
                     <div class="material-box item">
                        <h1>Название</h1>
                        <div class="input-section">
                            <input id="category-title" type="text" placeholder="Название" value="">
                        </div>
                    </div>
                    <div class="material-box item">
                        <h1>Путь (латинскими буквами)</h1>
                        <div class="input-section">
                            <input id="category-path" type="text" placeholder="Путь" value="">
                        </div>
                    </div>
                    <div class="material-box item">
                        <h1>Описание</h1>
                        <div class="input-section">
                            <textarea id="category-description" placeholder="Описание"></textarea>
                        </div>
                    </div>
                </div>
            `;

            categoryTargetNode.innerHTML = html;
            categoryTargetNode.style.display = 'block';
        }

        function showCategoriesList(targetNode, limit, offset, categoriesList) {

            let categoryTargetNode = document.getElementById('itemShow');
            //if((!pms.selectedHost.catalog || !pms.selectedHost.catalog.selectedCategory) || !categoryTargetNode) return false;
            if (pms.selectedHost.catalog.selectedCategory.length != 0) {
                let removeButton = (pms.selectedHost.catalog.canRemoveCategory == true) ?
                    `<div class="menu-button-section">
                            <button onclick="deleteCategory()">Удалить</button>
                        </div>`
                    : "";

                let category = pms.selectedHost.catalog.selectedCategory;
                let html = `
                <div id="controls-menu-itemShow" class="horizontal-flex-menu">
                    <div class="flex-left">
                        <div class="menu-button-section">
                            <button onclick="showCategoriesListPage(${category.parent_category});">Назад</button>
                        </div>
                    </div>
                    <div class="flex-right">
                        <div class="menu-button-section">
                            <button onclick="saveCategory()">Сохранить</button>
                        </div>
                        ${removeButton}                        
                    </div>
                </div>
                <div class="masonry" >
                     <div class="material-box item">
                        <h1>Название</h1>
                        <div class="input-section">
                            <input id="category-title" type="text" placeholder="Название" value="${category.title}">
                        </div>
                    </div>
                     <div class="material-box item">
                        <h1>Путь (латинскими буквами)</h1>
                        <div class="input-section">
                            <input id="category-path" type="text" placeholder="Путь" value="${category.path}">
                        </div>
                    </div>
                    <div class="material-box item">
                        <h1>Описание</h1>
                        <div class="input-section">
                            <textarea id="category-description" placeholder="Описание">${category.description}</textarea>
                        </div>
                    </div>
                </div>
            `;

                categoryTargetNode.innerHTML = html;
                categoryTargetNode.style.display = 'block';
            } else categoryTargetNode.style.display = 'none';


            let itemsCount = 0;
            targetNode = targetNode && targetNode.innerHTML ? targetNode : (targetNode ? document.getElementById(targetNode) : document.getElementById('itemsList'));
            if (pms.selectedHost.catalog.childCategories.length != 0) {
                // console.debug('showItemsList init with: ', arguments);
                if (((!categoriesList || typeof categoriesList !== "object") && (!pms.selectedHost.catalog || !pms.selectedHost.catalog.childCategories)) || !targetNode) return false;
                // console.debug('showItemsList preparing passed');
                let source = '';
                categoriesList = (categoriesList && typeof categoriesList === "object") ? (categoriesList instanceof Array ? categoriesList : Object.values(categoriesList)) : pms.selectedHost.catalog.childCategories;
                limit = limit ? limit : categoriesList.length;
                offset = offset ? offset : 0;
                // console.debug('showItemsList parameters: ', limit, offset, itemsList);
                // console.debug('showItemsList called!', limit, offset);
                // console.debug('showItemsList real items count', pms.selectedHost.catalog.items.length, pms.selectedHost.catalog.items);

                // for (let i in pms.selectedHost.catalog.items) {
                for (let i = offset; i < offset + limit; i++) {
                    if (!categoriesList[i]) continue;
                    itemsCount++;
                    let item = categoriesList[i];
                    let controlSection = '';
                    //if (item['href']) controlSection += '<button onclick="viewCategoryPage(' + item.id + ');event.stopPropagation();" title="Открыть на сайте">👁</button>';
                    // controlSection += '<button onclick="showItemParametersPage(' + item.id + ')" title="Редактировать">✏️</button>';
                    // controlSection += '<button title="Удалить" onclick="listCategoryClick(' + item.id + ',\'deleteCategory\');event.stopPropagation();">❌</button>';


                    source += '<li onclick="showCategoriesListPage(' + item.id + ');" data-list-item="' + item.id + '"><div>' + item.id + '</div><div>' + item.title + '</div><div class="flex-right">' + controlSection + '</div></li>';
                }
                // console.debug('showItemsList fetched items:', itemsCount, source);

                targetNode.innerHTML = source;
                targetNode.style.display = 'block';
            } else {
                targetNode.style.display = 'none';
            }
            return itemsCount;
        }

        function listCategoryClick(id, method) {
            if (isProgress('openListItem')) return false;
            setProgress('openListItem');
            switch (method) {
                case 'showCategoryParametersPage':
                    method = showCategoryParametersPage;
                    break;
                case 'showCategoriesListPage':
                    method = showCategoriesListPage;
                    break;
                case 'deleteCategory':
                    method = deleteCategory;
                    break;
                default:
                    setProgress('openListItem', false);
                    return false;
                    break;
            }
            showLoadingIndicator();
            showItemLoadIndicator(id, 'list-item');
            return method(id).then(function () {
                hideLoadingIndicator();
                hideItemLoadIndicator(id, 'list-item');
                setProgress('openListItem', false);
                // console.debug('debug2', pms.selectedHost.catalog.selectedItem);
                return true;
            }).catch(errorHandler);
        }

        function showItemParametersPage(id, disableHistory) {
            return loadItemParameters()
                .then(function (result) {
                    if (!result || !id) return result;
                    return loadItemData(id);
                })
                .then(function (result) {
                    if (!result) return result;
                    if (!disableHistory) history.pushState({
                        type: 'plugin',
                        author: 'PonomareVlad',
                        plugin: 'catalog',
                        action: 'item_catalog_plugin',
                        parameter: id
                    }, id ? pms.selectedHost.catalog.item[id].title : 'Добавление товара');
                    return prepareTemplate('item');
                })
                .then(function (result) {
                    if (!result) return result;
                    let controlsMenuSource = '<div class="flex-left">';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="backButton" onclick="menuButtonClick(\'backButton\',\'showItemsListPage\');">Назад</button></div>';
                    controlsMenuSource += '</div><div class="flex-right">';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="saveButton" onclick="menuButtonClick(\'saveButton\',\'saveItemParameters\');">Сохранить</button></div>';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="viewButton" onclick="viewItemPage();">Посмотреть</button></div>';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="deleteButton" onclick="menuButtonClick(\'deleteButton\',\'deleteItem\');">Удалить</button></div>';
                    controlsMenuSource += '</div>';
                    document.getElementById('controls-menu').innerHTML = controlsMenuSource;
                    return showItemParameters(id);
                })
                .then(function (result) {
                    if (!result) return result;
                    return workspace.require('macy');
                })
                .then(function (result) {
                    if (!result) return result;
                    pms.selectedHost.catalog.macy = Macy({
                        container: '.masonry',
                        trueOrder: false,
                        waitForImages: false,
                        mobileFirst: true,
                        margin: {
                            x: 60,
                            y: 20
                        },
                        columns: 1,
                        breakAt: {
                            2200: 6,
                            1900: 5,
                            1600: 4,
                            1200: 3,
                            640: 2
                        }
                    });
                    // console.debug('debug1', pms.selectedHost.catalog.selectedItem);
                    return true;
                });
        }

        function showCategoryParametersPage(id) {
            return loadCategoryParameters()
                .then(function (result) {
                    if (!result || !id) return result;
                    return loadCategoryData(id);
                })
                .then(function (result) {
                    if (!result) return result;
                    return prepareTemplate('category');
                })
                .then(function (result) {
                    if (!result) return result;
                    let controlsMenuSource = '<div class="flex-left">';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="backButton" onclick="menuButtonClick(\'backButton\',\'showCategoriesListPage\');">Назад</button></div>';
                    controlsMenuSource += '</div><div class="flex-right">';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="saveButton" onclick="menuButtonClick(\'saveButton\',\'saveCategoryParameters\');">Сохранить</button></div>';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="viewButton" onclick="viewCategoryPage();">Посмотреть</button></div>';
                    controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="deleteButton" onclick="menuButtonClick(\'deleteButton\',\'deleteCategory\');">Удалить</button></div>';
                    controlsMenuSource += '</div>';
                    document.getElementById('controls-menu').innerHTML = controlsMenuSource;
                    return showCategoryParameters(id);
                })
                .then(function (result) {
                    if (!result) return result;
                    return workspace.require('macy');
                })
                .then(function (result) {
                    if (!result) return result;
                    pms.selectedHost.catalog.macy = Macy({
                        container: '.masonry',
                        trueOrder: false,
                        waitForImages: false,
                        mobileFirst: true,
                        margin: {
                            x: 60,
                            y: 20
                        },
                        columns: 1,
                        breakAt: {
                            2200: 6,
                            1900: 5,
                            1600: 4,
                            1200: 3,
                            640: 2
                        }
                    });
                    // console.debug('debug1', pms.selectedHost.catalog.selectedItem);
                    return true;
                });
        }


        function showAddCatalogItem() {
            return loadItemParameters()
                .then(function (result) {
                    if (!result) return result;
                    return prepareTemplate('item');
                })
                .then(function (result) {
                    if (!result) return result;
                    return showItemParameters();
                })
        }

        function listItemClick(id, method) {
            if (isProgress('openListItem')) return false;
            setProgress('openListItem');
            switch (method) {
                case 'showItemParametersPage':
                    method = showItemParametersPage;
                    break;
                case 'deleteItem':
                    method = deleteItem;
                    break;
                default:
                    setProgress('openListItem', false);
                    return false;
                    break;
            }
            showLoadingIndicator();
            showItemLoadIndicator(id, 'list-item');
            return method(id).then(function () {
                hideLoadingIndicator();
                hideItemLoadIndicator(id, 'list-item');
                setProgress('openListItem', false);
                // console.debug('debug2', pms.selectedHost.catalog.selectedItem);
                return true;
            }).catch(errorHandler);
        }

        function menuButtonClick(id, method) {
            if (isProgress('menuButton')) return false;
            setProgress('menuButton');
            switch (method) {
                case 'showItemsListPage':
                    method = showItemsListPage;
                    break;
                case 'saveItemParameters':
                    method = saveItemParameters;
                    break;
                case 'viewItemPage':
                    method = viewItemPage;
                    break;
                case 'showItemParametersPage':
                    method = showItemParametersPage;
                    break;
                case 'deleteItem':
                    method = deleteItem;
                    break;
                case 'showCategoriesListPage':
                    method = showCategoriesListPage;
                    break;
                case 'saveCategoryParameters':
                    method = saveCategoryParameters;
                    break;
                case 'showCategoryParametersPage':
                    method = showCategoryParametersPage;
                    break;
                case 'deleteCategory':
                    method = deleteCategory;
                    break;
                case 'viewCategoryPage':
                    method = viewCategoryPage;
                    break;
                default:
                    setProgress('menuButton', false);
                    return false;
                    break;
            }
            showLoadingIndicator();
            showItemLoadIndicator(id, 'menu-button');
            return method().then(function () {
                hideLoadingIndicator();
                hideItemLoadIndicator(id, 'menu-button');
                setProgress('menuButton', false);
                return true;
            }).catch(errorHandler);
        }

        function fetchParameterChanges(parameterId) {
            let data = document.querySelector('[data-parameter="' + parameterId + '"]').value;
            console.debug('fetchParameterChanges', data);
            pms.selectedHost.catalog.selectedItem[parameterId] = data;
            pms.selectedHost.catalog.macy.recalculate(true);
            return true;
        }

        function addParameterVariant(parameterId) {
            if (isProgress(parameterId + 'ParameterAdd')) return false;
            setProgress(parameterId + 'ParameterAdd');
            setTimeout(function () {
                setProgress(parameterId + 'ParameterAdd', false);
            }, 300);
            let parameter = Object.assign({}, pms.selectedHost.catalog.itemParameter[parameterId]);
            if (parameter.format) {
                let worker = parseURL(parameter.format);
                let workerId = worker.pathname.split('/').pop();
                if (catalog.config.parameterWorkers[workerId] && catalog.config.parameterWorkers[workerId]['add']) {
                    let workerParameters = parseQuery(worker.search);
                    return catalog.config.parameterWorkers[workerId]['add'](workerParameters, parameter);
                }
            }
            let data = document.querySelector('[data-parameter="' + parameterId + '"]').value;
            console.debug('addParameterVariant', data);
            if (!pms.selectedHost.catalog.selectedItem[parameterId]) pms.selectedHost.catalog.selectedItem[parameterId] = [];
            pms.selectedHost.catalog.selectedItem[parameterId].push(data);
            let parameterSection = document.querySelector('[data-parameter-section="' + parameterId + '"]');
            if (!parameterSection) return false;
            parameter.data = pms.selectedHost.catalog.selectedItem[parameterId];
            parameterSection.innerHTML = genItemParameter(parameter, pms.selectedHost.catalog.selectedItem);
            pms.selectedHost.catalog.macy.recalculate(true);
            return true;
        }

        function removeParameterVariant(parameterId, index) {
            if (isProgress(parameterId + 'ParameterRemove')) return false;
            setProgress(parameterId + 'ParameterRemove');
            setTimeout(function () {
                setProgress(parameterId + 'ParameterRemove', false);
            }, 300);
            let parameter = Object.assign({}, pms.selectedHost.catalog.itemParameter[parameterId]);
            if (parameter.format) {
                let worker = parseURL(parameter.format);
                let workerId = worker.pathname.split('/').pop();
                if (catalog.config.parameterWorkers[workerId] && catalog.config.parameterWorkers[workerId]['remove']) {
                    let workerParameters = parseQuery(worker.search);
                    return catalog.config.parameterWorkers[workerId]['remove'](workerParameters, parameter, index);
                }
            }
            // let data = document.querySelector('[data-parameter="' + parameterId + '"]').value;
            if (typeof index !== "number" || !pms.selectedHost.catalog.selectedItem[parameterId]) return false;
            console.debug('removeParameterVariant', pms.selectedHost.catalog.selectedItem[parameterId].splice(index, 1));
            console.debug('test', pms.selectedHost.catalog.selectedItem);
            let parameterSection = document.querySelector('[data-parameter-section="' + parameterId + '"]');
            if (!parameterSection) return false;
            // let parameter = Object.assign({}, pms.selectedHost.catalog.itemParameter[parameterId]);
            parameter.data = pms.selectedHost.catalog.selectedItem[parameterId];
            parameterSection.innerHTML = genItemParameter(parameter, pms.selectedHost.catalog.selectedItem);
            pms.selectedHost.catalog.macy.recalculate(true);
            return true;
        }

        function saveItemParameters() {
            console.debug('saving Item', pms.selectedHost.catalog.selectedItem);
            return pluginIo('console/saveItem', false, {parameters: pms.selectedHost.catalog.selectedItem}).then(function (response) {
                if (!response || !response.status || !response.itemId) return false;//createNotification('Каталог', 'Произошла ошибка при сохранении', pms.config.icon);
                pms.selectedHost.catalog.selectedItem.id = response.itemId;
                return true;
            }).then(function (result) {
                if (!result) return result;
                return showItemParametersPage(pms.selectedHost.catalog.selectedItem.id)
            });
        }

        function saveCategoryParameters() {
            /* return pluginIo('console/saveCategory', false, {parameters: pms.selectedHost.catalog.selectedCategory}).then(function (response) {
                 if (!response || !response.status || !response.categoryId) return false;//createNotification('Каталог', 'Произошла ошибка при сохранении', pms.config.icon);
                 pms.selectedHost.catalog.selectedCategory.id = response.categoryId;
                 return true;
             }).then(function (result) {
                 if (!result) return result;
                 return showCategoryParametersPage(pms.selectedHost.catalog.selectedCategory.id)
             });*/
        }

        function deleteItem(id) {
            if (!confirm('Для временного удаления, отмените эту операцию и измените параметр этого товара "В наличии"! Если вы хотите ПОЛНОСТЬЮ удалить товар с сайта (А так же из Поисковых систем), то нажмите ОК'))
                return initPromise(false);
            if (!id) {
                if (pms.selectedHost.catalog.selectedItem && pms.selectedHost.catalog.selectedItem.id) id = pms.selectedHost.catalog.selectedItem.id;
                else return initPromise(false);
            }
            return pluginIo('console/deleteItem', false, {id: id}).then(function (response) {
                if (!response.status) return createNotification('Каталог', 'При удалении товара, произошла ошибка!', pms.config.icon);
                return showItemsListPage();
            });
        }


        function searchItemsListPage(parameters, search) {
            if (pms.selectedHost.catalog.searchTimeout) clearTimeout(pms.selectedHost.catalog.searchTimeout);
            pms.selectedHost.catalog.searchTimeout = setTimeout(function () {
                if (search && pms.selectedHost.catalog.currentSearch && pms.selectedHost.catalog.currentSearch === search) return false;
                pms.selectedHost.catalog.currentSearch = search;
                let listSectionId = 'itemsList';
                showLoadingIndicator();
                showItemLoadIndicator('search', 'template-element');
                if (!search || search === '') return initPromise(listSectionId).then(showItemsList).then(function () {
                    hideLoadingIndicator();
                    hideItemLoadIndicator('search', 'template-element');
                    infinityScroll(loadItems, showItemsList, 'workspaceSection', listSectionId, 20, pms.selectedHost.catalog.items.length, pms.selectedHost.catalog.itemsCount, 4, parameters);
                });
                return loadItems(parameters, 120, false, search)
                /*.then(function (result) {
                    if (!result) return result;
                    return prepareTemplate('list');
                })*/
                    .then(function (result) {
                        if (!result) return result;
                        // let listSection = document.getElementById(listSectionId);
                        /*let controlsMenuSource = '<div class="flex-left">';
                        controlsMenuSource += '</div><div class="flex-right">';
                        controlsMenuSource += '<div class="menu-button-section"><button data-menu-button="addItemButton" onclick="menuButtonClick(\'addItemButton\',\'showItemParametersPage\');">Добавить товар</button></div>';
                        controlsMenuSource += '</div>';
                        document.getElementById('controls-menu').innerHTML = controlsMenuSource;*/
                        if (!result || result.length === 0) {
                            document.getElementById('itemsList').innerHTML = 'Ничего не найдено';
                            return 0;
                        }
                        return showItemsList(listSectionId, false, false, result);
                    })
                    /*.then(function (result) {
                        if (!result) return result;
                        return loadItemsCount(parameters, search);
                    })*/
                    .then(function (result) {
                        hideLoadingIndicator();
                        hideItemLoadIndicator('search', 'template-element');
                        infinityScroll(loadItems, showItemsList, 'workspaceSection', listSectionId, 20, 120, result, 4, parameters);
                        return true;
                    }).catch(function () {
                        hideLoadingIndicator();
                        hideItemLoadIndicator('search', 'template-element');
                    });
            }, 300);
        }

        function parseURL(url) {
            let link = document.createElement('a');
            link.href = url;
            return link;
        }

        function parseQuery(queryString) {
            var query = {};
            var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            return query;
        }

        function initHistoryHandler() {
            window.addEventListener('popstate', function (event) {
                console.debug('catalog handler', event.state);
                if (event.state && event.state.type === 'plugin' && event.state.author === 'PonomareVlad' && event.state.plugin === 'catalog' && event.state.action) {
                    let parameters = {
                        disableHistory: true,
                        "plugin": "2",
                        "id": event.state.action
                    };
                    if (event.state.parameter) parameters.item = event.state.parameter;
                    return menuItemClick("installedPlugins", "items_catalog_plugin", parameters, "item");
                }
            }.bind(this))
        }

    }

)();
