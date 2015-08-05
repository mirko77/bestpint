'use strict';
var Bestpint = Bestpint || {};
Bestpint.getData = function () {

    var deferred = new $.Deferred();
    var url = 'http://plus.epicollect.net/Bestpint/Beer.json';

    $.ajax({
        url: 'http://query.yahooapis.com/v1/public/yql',
        data: {
            q: "select * from json where url='http://plus.epicollect.net/Bestpint/Beer.json'",
            format: "json"
        },
        success: function (data) {
            //console.log(data);
            if (data.query.results) {
                //console.log(data.query.results.json.json);
                deferred.resolve(data.query.results.json.json);
            }
            else {
                deferred.reject(status);
            }
        },
        error: function (req, status, error) {
            console.log(error);
            deferred.reject(status);
        }
    });
    return deferred.promise();
};
