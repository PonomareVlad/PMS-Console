//var workspace = require('./workspace.js');
//require('../css/style.css');

function loadWorkspace() {
    // import * as workspace from './workspace.js';
    getModule("workspace", function (module) {
        console.log(module.test);
    },'./');
}

function getModule(module, callback, path) {
    require.ensure([], function () {
        window[module] = require((path ? path : './modules/') + module + '.js');
        callback(window[module]);
    });
}

window.addEventListener('load', function () {
    document.body.innerHTML = '<h1>PMS Console!</h1>';
    loadWorkspace();
    console.log(`Init with workspace ${window.workspace ? workspace.test : false}`);
});