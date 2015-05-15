'use strict';
var Bestpint = Bestpint || {};
Bestpint.config = function () {
    this.entries = {};
    this.device_lat = 0;
    this.device_long = 0;
    //http://joaopereirawd.github.io/fakeLoader.js/
    this.fakeloader = $('#fakeloader');
    this.map_wrapper = $('#map-canvas');
    this.proxy_error_wrapper = $('#proxy-error');
    this.fakeloader.fakeLoader({
        timeToHide: 1000000,
        bgColor: '#333',
        spinner: 'spinner1'
    });
};