'use strict';
var Bestpint = Bestpint || {};
$(document).ready(function () {
    //execute Leaflet only on map page
    var href = window.location.href;
    var query = '';
    var page = href.split('/');
    if (page[page.length - 1].indexOf('map') === -1) {
        return;
    }
    else {
        console.log('Let \'s display some map');
        Bestpint.config();
        Bestpint.init();
    }
});
