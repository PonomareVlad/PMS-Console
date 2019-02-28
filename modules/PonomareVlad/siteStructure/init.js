(function () {

    if (!window.pms) return false;
    if (!window.pms.module) window.pms.module = {};
    if (!window.pms.module.siteStructure) window.pms.module.siteStructure = {};

    pms.module.siteStructure.workspaceGenerator = function (parameters = false) {
        workspace.leavePage();
        return new Promise(function (resolve, reject) {
            if (pms.workspace.wrapper) {
                showLoadingIndicator();
                return resolve(showDirItem('dir', 'root')
                    .then(hideLoadingIndicator));
            }
            hideLoadingIndicator();
            return resolve({status: false, statusText: 'Wrapper not Exist'});
        });
    };

    let template = pms.module.siteStructure.template = {};

    let siteStructure = pms.module.siteStructure;

    window.showDirItem = showDirItem;
    window.showPageElement = showPageElement;
    window.savePage = savePage;
    window.buildPage = buildPage;
    window.createPage = createPage;
    window.createDir = createDir;

    function showDirItem(type = false, id = false) {
        if (isProgress('dirItem')) return false;
        setProgress('dirItem');
        showLoadingIndicator();
        workspace.leavePage();
        return new Promise(function (resolve, reject) {
            if (!type || !id) return resolve({status: false, 'statusText': 'Bad parameters'});
            showItemLoadIndicator(type + '-' + id, 'dir-item');
            switch (type) {
                case 'dir':
                    if (pms.selectedHost.directories && pms.selectedHost.directories[id]) return resolve(renderDirTree(id)); else return resolve(getDir(id).then(renderDirTree));
                    break;
                case 'file':
                    if (pms.selectedHost.pages && pms.selectedHost.pages[id]) return resolve(renderPage(id)); else return resolve(getPage(id).then(renderPage));
                    break;
            }
            return resolve({status: true});
        }).then(function (response) {
            if (!response || !response.status) console.debug('showDirItem', response.statusText ? response.statusText : response);
            else console.debug('showDirItem', response);
        }).then(function (result) {
            setProgress('dirItem', false);
            hideLoadingIndicator();
            hideItemLoadIndicator(type + '-' + id, 'dir-item');
            return result;
        });
    }

    function renderDirTree(id = 'root') {
        let outputSource = '';
        if (!pms.selectedHost.directories[id]) return {
            status: false,
            'statusText': 'Dir ' + id + ' not found in pms.selectedHost.directories'
        };
        let fromFile = pms.selectedPage || false;
        pms.selectedPage = false;
        delete pms.selectedPage;
        let dir = pms.selectedHost.directories[id];
        if (dir.plugin_init) outputSource += '<div>(Не создавайте страницы в этом разделе, он используется вашими плагинами для отображения динамических страниц)</div><br>';
        if (dir.contents.dirs) for (let i in dir.contents.dirs) {
            let childDir = dir.contents.dirs[i];
            let title = childDir.title ? childDir.title + ' <span class="tree-item-path">' + childDir.path + '</span>' : childDir.path;
            let icon = childDir.plugin_init ? '🗂️' : '📁';
            outputSource += '<li data-dir-item="dir-' + childDir.id + '" onclick="showDirItem(\'dir\',\'' + childDir.id + '\')"><div class="flex-left"><span class="item-icon">' + icon + '</span> <a href="javascript:void(0);">' + title + '</a></div></li><div class="menu-button-section" data-dir-item-controls="' + childDir.id + '"></div><ul data-dir-item-container="' + childDir.id + '"></ul>';
        }
        if (dir.contents.files) for (let i in dir.contents.files) {
            let childFile = dir.contents.files[i];
            let title = childFile.title ? childFile.title + '<span class="tree-item-path">' + childFile.path + '</span>' : childFile.path;
            let icon = '📄';
            outputSource += '<li data-dir-item="file-' + childFile.id + '" onclick="showDirItem(\'file\',\'' + childFile.id + '\')"><div class="flex-left"><span class="item-icon">' + icon + '</span> <a href="javascript:void(0);">' + title + '</a></div><div class="dir-item-icons flex-right"><figure class="amp-icon"></figure><figure class="ya-turbo-icon"></figure></div></li><ul></ul>';
        }
        if (outputSource === '') outputSource = '<div>(Пусто)</div><br>';

        let controls = '<button class="button" onclick="createDir(' + dir.id + ');" style="margin-bottom: 1rem;margin-right: 1rem;">Новая папка</button>';
        if (dir.default_template) controls += '<button class="button" onclick="createPage(' + dir.id + ',' + dir.default_template + ');" style="margin-bottom: 1rem;">Добавить страницу</button>';

        // outputSource = '<div class="menu-button-section" data-dir-item-controls="' + dir.id + '">' + controls + '</div>' + outputSource;

        if (id === 'root') {
            pms.workspace.wrapper.innerHTML = '<div class="tree-section scrollbox"><h3>Структура вашего сайта:</h3><ul>' + outputSource + '</ul></div>';
            return {status: true, dir: id};
        } else {
            let container = document.querySelectorAll('[data-dir-item-container="' + id + '"]');
            let controlsSection = document.querySelectorAll('[data-dir-item-controls="' + id + '"]');
            if (!container || container.length === 0) if (fromFile) return renderDirTree('root'); else return {
                status: false,
                'statusText': 'Container not Found'
            };
            container[0].innerHTML = outputSource;
            controlsSection[0].innerHTML = controls;
            return {status: true, dir: dir.title ? dir.title : dir.path};
        }
    }

    function getDir(id = false) {
        let data = {hostId: pms.selectedHost.id};
        if (id && id !== 'root') data.dirId = id;
        return io('console/host/getDir', data).then(function (response) {
            if (!response.status || !response.dirData) {
                alert('Не удалось отобразить папку');
                return false;
            }
            let dirData = response.dirData;
            if (!pms.selectedHost.directories) pms.selectedHost.directories = {};
            let directories = pms.selectedHost.directories;
            directories[dirData.id] = dirData;
            if (dirData.id === 'root') pms.selectedHost.siteStructure = dirData;
            dirData.parent_dir = dirData.parent_dir ? dirData.parent_dir : 'root';
            if (directories[dirData.parent_dir])
                for (let i in directories[dirData.parent_dir].contents.dirs) {
                    let dir = directories[dirData.parent_dir].contents.dirs[i];
                    if (dir.id === dirData.id) {
                        dir = directories[dirData.id];
                        break;
                    }
                }
            return dirData.id;
        });
    }

    function getPage(id) {
        let data = {hostId: pms.selectedHost.id};
        if (id) data.pageId = id;
        return io('console/page/getPageData', data).then(function (response) {
            if (!response.status || !response.pageData) {
                alert('Не удалось отобразить страницу');
                return false;
            }
            let pageData = response.pageData;
            if (pageData.elements && pageData.elements.length > 0) {
                pageData.element = {};
                for (let i in pageData.elements) pageData.element[pageData.elements[i].container] = pageData.elements[i];
            }
            if (!pms.selectedHost.pages) pms.selectedHost.pages = {};
            let directories = pms.selectedHost.directories;
            let pages = pms.selectedHost.pages;
            pages[pageData.id] = pageData;
            pageData.parent_dir = pageData.parent_dirs.length > 0 ? pageData.parent_dirs[0].id : 'root';
            if (directories[pageData.parent_dir])
                for (let i in directories[pageData.parent_dir].contents.files) {
                    let file = directories[pageData.parent_dir].contents.files[i];
                    if (file.id === pageData.id) {
                        file = pages[pageData.id];
                        break;
                    }
                }
            return pageData.id;
        });
    }

    function renderPage(id) {
        if (!id) return false;
        return new Promise(function (resolve, reject) {
            if (!template.file) return resolve(workspace.loadTemplate('modules/PonomareVlad/siteStructure/file')
                .then(function (response) {
                    if (!response) return false;
                    return template.file = response;
                }));
            return resolve(template.file);
        }).then(function (template) {
            if (!template) return false;
            return workspace.render(template, pms.workspace.wrapper).then(function (result) {
                if (result) {
                    if (document.getElementById('elements-menu')) siteStructure.elementsMenu = document.getElementById('elements-menu');
                    if (document.getElementById('element-wrapper')) siteStructure.elementWrapper = document.getElementById('element-wrapper');
                    if (document.getElementById('seo-menu')) siteStructure.seoMenu = document.getElementById('seo-menu');
                    if (document.getElementById('controls-menu')) siteStructure.controlsMenu = document.getElementById('controls-menu');
                }
                return result;
            });
        }).then(function (result) {
            if (!result) {
                alert('Не удалось открыть просмотр страницы');
                return false;
            }
            let page = pms.selectedPage = pms.selectedHost.pages[id];
            genControlMenu();
            return loadPageElementsMenu();
        }).then(function (result) {
            if (!result) return {status: false, result};
            return {status: true, page: pms.selectedPage.title ? pms.selectedPage.title : pms.selectedPage.path};
        });
    }

    function loadPageElementsMenu(id = false) {
        id = id ? id : pms.selectedPage.id;
        if ((!id && !pms.selectedPage) || !siteStructure.elementsMenu || !pms.selectedHost.pages[id]) return false;
        let elements = pms.selectedHost.pages[id].elements ? pms.selectedHost.pages[id].elements : [];
        let menuSource = '<h3>Параметры страницы:</h3><ul>';
        if (elements.length === 0) menuSource += '<div>(Нет элементов)</div>';
        else for (let i in elements) {
            let element = elements[i];
            element.title = element.title ? element.title : element.container;
            menuSource += '<li onclick="showPageElement(\'' + element.container + '\');" data-element-item="' + element.container + '"><a href="javascript:void(0);">' + element.title + '</a></li>';
        }
        menuSource += '</ul>';
        siteStructure.elementsMenu.innerHTML = menuSource;
        return true;
    }

    function showPageElement(id) {
        if (isProgress('elementItem')) return false;
        setProgress('elementItem');
        console.log('showPageElement', id);
        return new Promise(function (resolve, reject) {
            showItemLoadIndicator(id, 'element-item');
            showLoadingIndicator();
            if (pms.selectedPage.element[id] && pms.selectedPage.element[id].content) return resolve(renderElement(id));
            else return resolve(getPageElement(id).then(renderElement));
        });
    }

    function getPageElement(id = false) {
        if (!id) return false;
        let data = {
            hostId: pms.selectedHost.id,
            pageId: pms.selectedPage.id,
            containerId: id
        };
        return io('console/page/getPageElement', data).then(function (response) {
            if (!response.status || !response.elementData) {
                alert('Не удалось отобразить элемент');
                return false;
            }
            pms.selectedPage.element[id] = response.elementData;
            return response.elementData.container;
        });
    }

    function renderElement(id) {
        let element = pms.selectedPage.element[id];
        return new Promise(function (resolve, reject) {
            //let outputSource = '';
            switch (element.type) {
                case 'plugin':
                    return resolve(preparePluginElement(element.content));
                case 'html':
                    return resolve(prepareHTMLElement(element.content));
                case 'variable':
                    return resolve(prepareVariableElement(element.content, element.title));
                case 'textarea':
                    return resolve(prepareTextAreaElement(element.content, element.title));
                default:
                    return resolve('<h4>В этом блоке установлен неподдерживаемый тип данных (' + element.type + ')</h4>' +
                        '<details><summary>Редактировать блок (Только для разработчиков):</summary><div>' +
                        '<div><textarea>' + element.content + '</textarea></div></div></details>');
            }
        }).then(function (result) {
            siteStructure.elementWrapper.innerHTML = result;
            genControlMenu(element);
            if (element.type === 'html') initTinyMCE();
            setProgress('elementItem', false);
            hideItemLoadIndicator(id, 'element-item');
            hideLoadingIndicator();
        });
    }

    function preparePluginElement(data) {
        let link = document.createElement('a');
        link.href = data;
        let path = link.pathname.split('/');
        let parameters = parseQuery(link.search);
        let outputSource = '<div class="workspace-section" id="workspaceSection"><h4>В этом блоке выводится информация из плагина <span style="font-weight: bolder">' + path[path.length - 1] + '</span> (' + path[path.length - 2] + ')</h4>';
        outputSource += '<p>Для того, чтобы управлять плагином, перейдите по ссылке <a href="javascript:void(0);" onclick="showPlugin(\'' + path[path.length - 2] + '\',\'' + path[path.length - 1] + '\');">' + path[path.length - 1] + '</a></p>';
        outputSource += '<details><summary>Расширенные параметры вывода (Только для разработчиков):</summary><div>';
        outputSource += '<div><input value="' + link.pathname + '"></div>';
        let parametersKeys = Object.keys(parameters);
        for (let i in parametersKeys) {
            let parameter = parameters[parametersKeys[i]];
            outputSource += '<div><input value="' + parametersKeys[i] + '"><input value="' + parameter + '"></div>';
        }
        outputSource += '</div></details></div>';
        return outputSource;
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

    function prepareHTMLElement(data) {
        return new Promise(function (resolve, reject) {
            if (!window.tinymce) return resolve(workspace.require('tinymce.min'));
            return resolve(true);
        }).then(function (result) {
            return '<textarea id="html-element-data">' + data + '</textarea>';
        });
    }

    function initTinyMCE() {
        tinyMCE.baseURL = 'https://cms.prakula.ru/pms-console/plugins/tinymce';
        pms.tinymce = tinymce.init({
            selector: '#html-element-data',
            branding: false,
            height: '500',
            theme: 'modern',
            // skin_url: 'https://cms.prakula.ru/pms-console/plugins/tinymce/skins/lightgray',
            language: 'ru',
            // plugins: 'image imagetools',
            plugins: 'print preview fullpage paste searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount spellchecker imagetools contextmenu colorpicker textpattern',
            toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
            // imagetools_cors_hosts: [pms.selectedHost.domain],
            // imagetools_proxy: pms.config.apiUrl + 'console/page/imageUpload',
            images_upload_url: pms.config.apiUrl + 'console/page/imageUpload',
            // toolbar1: 'image',
            images_upload_credentials: true,
            image_advtab: true,
            // image_prepend_url: getHostUrl(),
            // images_upload_base_path: getHostUrl(),
            images_reuse_filename: true,
            relative_urls: false,
            // remove_script_host: true,
            document_base_url: getHostUrl(),
            browser_spellcheck: true,
            forced_root_block: '',
            images_upload_handler: function (blobInfo, success, failure) {
                var xhr, formData;

                xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open('POST', pms.config.apiUrl + 'console/page/imageUpload?hostId=' + pms.selectedHost.id);

                xhr.onload = function () {
                    var json;

                    if (xhr.status != 200) {
                        failure('HTTP Error: ' + xhr.status);
                        return;
                    }

                    json = JSON.parse(xhr.responseText);

                    if (!json || typeof json.location != 'string') {
                        failure('Invalid JSON: ' + xhr.responseText);
                        return;
                    }

                    success(json.location);
                };

                formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());

                xhr.send(formData);
            }
        });
        pms.onLeavePage.push(function () {
            tinymce.EditorManager.execCommand('mceRemoveEditor', true, 'html-element-data');
        })
    }

    function getPageKeywords() {
        let data = {hostId: pms.selectedHost.id, pageId: pms.selectedPage.id};
        io('console/page/getPageKeywords', data).then(function (response) {
            if (!response.status || !response.pageKeywords) {
                siteStructure.seoMenu.innerHTML = '<div class="flex-center"><div>Рекомендации временно недоступны</div></div>';
                return false;
            }
            pms.selectedPage.keywords = response.pageKeywords;
        })
    }

    function get() {

    }

    function genControlMenu(element) {
        let dirs = '';
        let availableWidth = document.getElementById('controls-menu').clientWidth - 450;
        let itemsCount = pms.selectedPage.parent_dirs.length > 0 ? pms.selectedPage.parent_dirs.length : 1;
        let spliceCount = availableWidth / 18 / itemsCount;
        if (pms.selectedPage.parent_dir !== 'root') for (let i in pms.selectedPage.parent_dirs) {
            let dir = pms.selectedPage.parent_dirs[i];
            let title = dir.title ? dir.title : dir.path.split('/').join(' ');
            if (title.slice(0, spliceCount).length < title.length) title = title.slice(0, spliceCount) + '...';
            dirs += '<span style="text-overflow: ellipsis"><a href="javascript:void(0);" onclick="showDirItem(\'dir\',' + dir.id + ')">' + title + '</a> / </span>';
        }
        let pageTitle = pms.selectedPage.title ? pms.selectedPage.title : pms.selectedPage.path;
        if (pageTitle.slice(0, spliceCount).length < pageTitle.length) pageTitle = pageTitle.slice(0, spliceCount) + '...';
        let saveButton = element ? '<button onclick="savePage(\'' + element.container + '\');" data-control-button="savePage">Сохранить</button>' : '<button onclick="buildPage();" data-control-button="buildPage">Пересобрать</button>';
        let viewButton = '<button onclick="window.open(\'' + getHostUrl() + pms.selectedPage.href + '\',\'blank\');" data-control-button="viewPage">Просмотр</button>';
        let breadCrumbs = '<span>/ </span>' + dirs + '<span>' + pageTitle + '</span>';
        siteStructure.controlsMenu.innerHTML = '<div class="flex-left"><div class="menu-button-section hide-on-mobile"><button onclick="showDirItem(\'dir\',\'root\')">Назад</button></div><div style="text-overflow: ellipsis;margin-left: 1rem;">' + breadCrumbs + '</div></div><div class="flex-right hide-on-mobile"><div class="menu-button-section">' + saveButton + '</div><div style="margin-left: 1rem;" class="menu-button-section">' + viewButton + '</div></div>';
    }

    function savePage(containerId) {
        if (!containerId) return true;
        if (isProgress('savePage')) return false;
        setProgress('savePage');
        showItemLoadIndicator('savePage', 'control-button');
        showLoadingIndicator();
        // let getData = {hostId: pms.selectedHost.id, pageId: pms.selectedPage.id, containerId: containerId};
        let postData = {};
        switch (pms.selectedPage.element[containerId].type) {
            case 'html':
                if (document.getElementById('html-element-data')) postData.content = tinyMCE.activeEditor.getBody().innerHTML; else {
                    setProgress('savePage', false);
                    hideItemLoadIndicator('savePage', 'control-button');
                    hideLoadingIndicator();
                    return false;
                }
                break;
            case 'variable':
                if (document.getElementById('variable-element-data')) postData.content = document.getElementById('variable-element-data').value; else {
                    setProgress('savePage', false);
                    hideItemLoadIndicator('savePage', 'control-button');
                    hideLoadingIndicator();
                    return false;
                }
                break;
            case 'textarea':
                if (document.getElementById('textarea-element-data')) postData.content = document.getElementById('textarea-element-data').value; else {
                    setProgress('savePage', false);
                    hideItemLoadIndicator('savePage', 'control-button');
                    hideLoadingIndicator();
                    return false;
                }
                break;
            default:
                return false;
        }
        io('console/page/savePageElement',
            {
                hostId: pms.selectedHost.id,
                pageId: pms.selectedPage.id,
                containerId: containerId
            }, postData).then(function (response) {
            if (!response.status) {
                alert('Не удалось сохранить данные');
                return false;
            }
            return getPageElement(containerId);
        }).then(function (result) {
            if (!result) return result;
            return renderElement(result);
        }).then(function (result) {
            setProgress('savePage', false);
            hideItemLoadIndicator('savePage', 'control-button');
            hideLoadingIndicator();
            return result;
        })
    }

    function buildPage() {
        setProgress('buildPage');
        showItemLoadIndicator('buildPage', 'control-button');
        showLoadingIndicator();
        let data = {host_id: pms.selectedHost.id, page_id: pms.selectedPage.id};
        io('console/page/buildPage', data).then(function (response) {
            setProgress('buildPage', false);
            hideItemLoadIndicator('buildPage', 'control-button');
            hideLoadingIndicator();
            if (!response.status) {
                alert('Не удалось пересобрать страницу');
            }
            return response.status;
        });
    }

    function prepareVariableElement(data, title) {
        return '<div class="workspace-section" id="workspaceSection"><div><label><h3>' + title + ':</h3></label></div><div><input type="text" value="' + data + '" size="' + (data.length < 40 ? 40 : data.length) + '" id="variable-element-data"/></div></div>';
    }

    function prepareTextAreaElement(data, title) {
        return '<div class="workspace-section" id="workspaceSection"><div><label><h3>' + title + ':</h3></label></div><div><textarea id="textarea-element-data">' + data.replace(/\\n/g, `
        `) + '</textarea></div></div>';
    }

    function createPage(dirId = false, templateId = false) {
        if (!dirId || !templateId) return false;
        let title = prompt('Введите название страницы', 'Новая страница');
        if (!title) return false;
        if (title.trim() === '') return alert('Необходимо указать корректное название страницы');
        let path = prompt('Введите путь страницы', 'index.php');
        if (!path) return false;
        if (path.trim() === '') return alert('Необходимо указать корректный путь страницы');
        let data = {
            hostId: pms.selectedHost.id,
            dirId: dirId,
            templateId: templateId,
            title: title,
            path: path,
        };
        return io('console/page/createPage', data).then(function (response) {
            if (!response.status) {
                alert('Не удалось создать страницу');
                return false;
            }
            let parentDir = dirId ? dirId : (response.pageData.parent_dirs.length > 0 ? response.pageData.parent_dirs[0] : 'root');
            return getDir(parentDir).then(function () {
                return showDirItem('file', response.pageData.id);
            });
        });
    }

    function createDir(dirId = false) {
        return alert('Эта функция временно недоступна');
    }

})();