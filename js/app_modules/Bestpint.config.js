'use strict';
var Bestpint = Bestpint || {};
Bestpint.config = function () {

    //from MDN https://goo.gl/kla3zJ -> get value of a parameter specified in the query string when requesting the page
    this.getURLParam = function (oTarget, sVar) {
        return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    };

    //type of map to display, will default to Leaflet.js
    this.type = this.getURLParam(window.location, 'type');
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