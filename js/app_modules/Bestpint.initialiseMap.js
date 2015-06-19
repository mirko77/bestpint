/* global L*/
'use strict';
var Bestpint = Bestpint || {};
Bestpint.initialiseMap = function () {

    var self = this;

    if (self.isMobile.any()) {
        //hack to make map show on Chrome Android
        self.map_wrapper.height('100vh');
    }

    //render map based on type (Leaflet by default, Gmaps or OpenLayers)
    switch (self.type) {
        case'gm':
            self.renderGmaps();
            break;
        case 'ol':
            self.renderOpenLayers();
            break;
        case 'bm':
            self.renderBingMaps();
            break;
        default:
            self.renderLeaflet();
    }
};