'use strict';
var Bestpint = Bestpint || {};
$(document).ready(function () {
    //execute Leaflet only on map page
    var href = window.location.href;
    if(href.split('/').pop() !== 'map'){
        return;
    }
    else {
        console.log('Let \'s display some map');
        Bestpint.config();
        Bestpint.init();
    }
});
