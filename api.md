List of Console methods:
===

Main methods (**/console**):
---

- **/getUserData** - current user ID 
*Return*: `{userId: ID of current user}`
- **/auth** - Authorize user by credentials:
*Request*: `login: mail@mail.ru, password: password`
*Return*: `{userId: ID of current user}`
- **/reg** - Registration new user with credentials:
*Request*: `login: mail@mail.ru, password: password`
*Return*: `{userId: ID of current user}`
- **/logout** - Destroy current session
*Return*: `{status: Status of operation}`
- **/getHosts** - List of hosts
*Return*: 
```
{
    hostsData: [
        {id: 1, domain: "ponomarevlad.ru", state: 1},
        ...
    ]
}
```
- **/getHostData** - Data of selected host:
*Request*: `id: 1`
*Return*: 
```
{
    id:1, 
    domain: "ponomarevlad.ru", 
    state: 1 
}
```
- **/getModules** - List of available Modules:
*Request*: `hostId: 1`
*Return*: 
```
{
    modulesData: [
        {
            id: "ID модуля", 
            title: "Название модуля",
            menu_item_title: "Название элемента меню",
            menu_item_type: "Тип элемента меню"
        },
        ...
    ]
}
```
- **/getModuleData** - Data of selected Module:
*Request*: `hostId: 1, moduleId: siteStructure`
*Return*: 
```
{
    id: "ID модуля", 
    title: "Название модуля",
    menu_item_title: "Название элемента меню",
    menu_item_type: "Тип элемента меню"
    init: "Исполняемый код",
}
```

Host actions methods (**/host**):
---

- **/getDir** - List of directory content 
*Request*: `hostId: 1, dirId: 1`
*Return*: 
```
{
    dirData:{
        id: 'root', 
        parent_dir: false, 
        path: '/path', 
        title: 'Корневая директория',
        plugin_init: 'Привязка директории к плагину'
        contents:{
            dirs:[
                {
                    id: 1, 
                    parent_dir: 'root', 
                    path: '/path', 
                    title: 'Заголовок директории',
                    plugin_init: 'Привязка директории к плагину'
                },
                ...
            ],
            files:[
                {
                    id: 1, 
                    parent_dir: 'root',
                    path: 'index.php',
                    title: 'Название страницы',
                    template_id: 'ID шаблона'
                },
                ...
            ]
        }
    }
}
```

Page actions methods (**/page**):
---

- **/getPageData** - page elements list and other data 
*Request*: `hostId: 1, pageId: 1`
*Return*: 
```
{
    pageData:{
        id: 1, 
        path: 'index.php', 
        parent_dirs: [
            {id: 1, path: '/', title: 'Заголовок директории'},
            ...
        ],
        title: 'Название страницы',
        template_id: 'ID шаблона'
        elements: [
            {
                container: 'html_description',
                type: 'html',
            },
            ...
        ]
    }
}
```
- **/getPageKeywords** - page keywords list 
*Request*: `hostId: 1, pageId: 1`
*Return*: 
```
{
    pageKeywords:[
        {
            id: 1,
            title: 'Поисковый запрос',
        },
        ...
    ]
}
```
- **/getPageElement** - page element data 
*Request*: `hostId: 1, pageId: 1, containerId: html_description`
*Return*: 
```
{
    elementData:{
        container: 'html_description',
        type: 'html',
        content: '<p>Текст страницы</p>',
    }
}
```
- **/getKeywordData** - page Keyword data 
*Request*: `hostId: 1, pageId: 1, keywordId: 2`
*Return*: 
```
{
    keywordData:{
        id: 2,
        title: 'Поисковый запрос',
        data: {
            title:{
                length:{
                    average:100,
                    min:50,
                    max:150,
                },
                cs:{
                    average:100,
                    min:50,
                    max:150,
                }
            },
            h3:{
                length:{
                    average:100,
                    min:50,
                    max:150,
                }
            }
            ...
        }
    }
}
```
- **/savePageElement** - save element data 
*Request*: `hostId: 1, pageId: 1, containerId: html_description, content: 'New content'`
*Return*: `{status: Status of operation}`

- **/createKeyword** - create new keyword for page
*Request*: `hostId: 1, pageId: 1, keyword: keyword`
*Return*: 
```
{
    keywords:{
        'keyword_title': 'keyword_id',
        ...
    }
}
```