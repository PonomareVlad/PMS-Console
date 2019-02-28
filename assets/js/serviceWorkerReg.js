//This is the service worker with the combined offline experience (Offline page + Offline copy of pages)
if ('serviceWorker' in navigator) {
//Add this below content to your HTML page, or add the js file to your page at the very top to register sercie worker
    if (navigator.serviceWorker.controller) {
        //console.log('[PWA Builder] active service worker found, no need to register')
    } else {

//Register the ServiceWorker
        navigator.serviceWorker.register('OneSignalSDKWorker.js', {
//         navigator.serviceWorker.register('serviceWorker.js', {
            scope: './'
        }).then(function (reg) {
            //console.log('Service worker has been registered for scope:'+ reg.scope);
        });
    }
}