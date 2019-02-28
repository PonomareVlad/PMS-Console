import {PrAkula} from './prakula.js';

export class Share extends PrAkula {
    init(parameters = {}) {
        super.init(parameters);
        this.rootNode = parameters.rootNode ? parameters.rootNode : document.body;
        this.router().finally(function (result) {

        });
    }

    async router() {
        let locationPath = location.pathname;
        let keywordId = locationPath.split('/share/')[1];
        let keywordData = await this.DB.keywords[keywordId];
        console.debug(keywordData);
        this.renderKeywordPage(keywordData);
    }

    renderKeywordPage(keywordData = {}) {

        if (!keywordData.domain) throw new Error('Domain not specified in Keyword Data');

        document.title = `SEO Рекомендации для сайта ${Share.capitalizeFirstLetter(keywordData.domain)}`;

        this.rootNode.innerHTML = '';

        this.rootNode.appendChild(genHeader());
        this.rootNode.appendChild(genElementsSection());

        function genHeader() {

            const headerNode = document.createElement('header');

            headerNode.appendChild(genUrlSection());
            headerNode.appendChild(genTitleSection());

            return headerNode;

            function genUrlSection() {

                const section = document.createElement('h2');
                section.className = `url-section caption-bottom`;

                const caption = document.createElement('span');
                caption.className = `caption`;
                caption.innerText = `Адрес страницы`;

                const path = document.createElement('span');
                path.className = `path`;
                path.innerHTML = `<span>${Share.capitalizeFirstLetter(keywordData.domain)}</span>`;
                let urlPath = new URL(keywordData.url).pathname;
                if (urlPath.length > 0 && urlPath !== '/')
                    urlPath.split('/').forEach(function (pathNode) {
                        if (pathNode.length > 0) path.innerHTML += `<span>${pathNode}</span>`;
                    });

                section.appendChild(caption);
                section.appendChild(path);

                return section;

            }

            function genTitleSection() {

                const section = document.createElement('div');
                section.className = `title-section`;

                section.appendChild(genKeywordSection());
                section.appendChild(genRatingSection());

                return section;

                function genKeywordSection() {

                    const section = document.createElement('h1');
                    section.className = `keyword-section caption-bottom`;

                    const caption = document.createElement('span');
                    caption.className = `caption`;
                    caption.innerText = `Поисковый запрос`;

                    const keyword = document.createElement('span');
                    keyword.className = `keyword`;
                    keyword.innerText = keywordData.title;

                    section.appendChild(caption);
                    section.appendChild(keyword);

                    return section;

                }

                function genRatingSection() {

                    const section = document.createElement('div');
                    section.className = `rating-section caption-bottom`;

                    const caption = document.createElement('span');
                    caption.className = `caption`;
                    caption.innerHTML = `Место в <span class="yandex-letter">Я</span>ндекс`;

                    const position = document.createElement('span');
                    position.className = `position`;
                    position.innerText = keywordData.position < 1 ? '50+' : keywordData.position;

                    section.appendChild(caption);
                    section.appendChild(position);

                    return section;

                }

            }
        }

        function genElementsSection() {

            const elementsSection = document.createElement('main');
            elementsSection.className = `elements`;

            const title = document.createElement('h3');
            title.className = `title`;
            title.innerText = `Базовые параметры:`;

            elementsSection.appendChild(title);
            elementsSection.appendChild(genElementsGroup());

            return elementsSection;

            function genElementsGroup() {

                const group = document.createElement('section');
                group.className = 'group';

                getElementsList().forEach(function (element) {
                    if (!keywordData.elements[element.id]) return;
                    group.appendChild(genElementSection(element));
                });

                return group;

                function getElementsList() {
                    return [
                        {id: 'h1', caption: 'Заголовок первого уровня'},
                        {id: 'h2', caption: 'Заголовок второго уровня'},
                        {id: 'title', caption: 'Основной заголовок'},
                    ]
                }

                function genElementSection(element) {

                    const elementData = keywordData.elements[element.id];

                    const section = document.createElement('div');
                    section.className = `element-section`;

                    const wrapper = document.createElement('div');
                    wrapper.className = `content-section`;

                    const title = document.createElement('h4');
                    title.className = `title caption-left`;

                    const caption = document.createElement('span');
                    caption.className = `caption`;
                    caption.innerText = element.caption;

                    const tag = document.createElement('span');
                    tag.className = `tag`;
                    tag.innerText = element.id;

                    if (elementData.process < 0.3) tag.classList.add('red');

                    const details = document.createElement('a');
                    details.className = `details-button`;
                    details.href = `#` + element.id;
                    details.innerText = `Подробнее`; // TODO: Count advanced parameters

                    title.appendChild(caption);
                    title.appendChild(tag);

                    wrapper.appendChild(title);

                    getParametersList().forEach(function (parameter) {
                        if (!elementData[parameter.id]) return;
                        wrapper.appendChild(genParameterSection(parameter));
                    });

                    section.appendChild(wrapper);
                    section.appendChild(details);

                    return section;

                    function getParametersList() {
                        return [
                            {id: 'length', caption: 'Общая длинна'},
                            {id: 'cs', caption: 'Среднее % содержание', multiplier: 100, symbol: '%'},
                        ]
                    }

                    function genParameterSection(parameter) {

                        const parameterData = keywordData.elements[element.id][parameter.id];

                        const section = document.createElement('div');

                        const caption = document.createElement('span');
                        caption.innerText = parameter.caption;

                        section.appendChild(caption);
                        section.appendChild(genValueSection());

                        return section;

                        function genValueSection() {

                            const section = document.createElement('span');

                            let multiplier = parameter.multiplier ? parameter.multiplier : 1;

                            let symbol = parameter.symbol ? parameter.symbol : '';

                            let currentValue = Math.round(parameterData.value * multiplier) + symbol;

                            let targetValue = Math.round(parameterData.dispersion.average * multiplier) + symbol;

                            if (parameterData.process < 0.8) {

                                section.innerHTML += `<span class="red">${currentValue}</span> -> `;

                                section.innerHTML += `<span class="green">${targetValue}</span>`;

                            } else section.innerHTML += `<span class="green">${currentValue}</span>`;

                            return section;
                        }

                    }

                }

            }

        }
    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}