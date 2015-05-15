'use strict';
var Bestpint = Bestpint || {};
Bestpint.init = function () {
    //request data from Epicollect+ via a proxy
    $.when(Bestpint.getData()).then(function (response) {

        Bestpint.entries = response;
        //get user location (on mobile only) to give just the entries around the area
        if (Bestpint.isMobile.any()) {
            //get device position before init map
            navigator.geolocation.getCurrentPosition(function (position) {
                Bestpint.device_lat = position.coords.latitude;
                Bestpint.device_long = position.coords.longitude;
                Bestpint.initialiseMap();
            }, function (error) {
                console.log(error);
                Bestpint.initialiseMap();
            });
        }
        else {
            //init maps on desktop
            Bestpint.initialiseMap();
        }
    }, function (error) {
        //show error message, request failed
        console.log(error);
        Bestpint.map_wrapper.hide();
        Bestpint.proxy_error_wrapper.removeClass('hidden');
        Bestpint.fakeloader.fadeOut();
    });
};
