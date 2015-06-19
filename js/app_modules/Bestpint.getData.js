'use strict';
var Bestpint = Bestpint || {};
Bestpint.getData = function () {

    var deferred = new $.Deferred();
    var url = 'http://plus.epicollect.net/Bestpint/Beer.json';

    //try a cors request to epicollect server using yql https://developer.yahoo.com/yql
    //$.getJSON("http://query.yahooapis.com/v1/public/yql",
    //    {
    //        q: "select * from json where url='http://plus.epicollect.net/Bestpint/Beer.json'",
    //        format: "json"
    //    },
    //    function (data, status) {
    //        //if the proxy is down for some reasons, show error message
    //        if (data.query.results) {
    //            //console.log(data.query.results.json.json);
    //            deferred.resolve(data.query.results.json.json);
    //        }
    //        else {
    //            deferred.reject(status);
    //        }
    //    });

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