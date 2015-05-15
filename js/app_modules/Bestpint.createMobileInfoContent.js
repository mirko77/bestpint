'use strict';
var Bestpint = Bestpint || {};
Bestpint.createMobileInfoContent = function (the_entry) {

    var entry = the_entry;
    var html = '';

    //replace missing images (and the horrible ec+ placeholder) with nice placeholder
    if (entry.ecplus_Beer_ctrl7 === undefined || entry.ecplus_Beer_ctrl7.indexOf('thumbnail=true') > -1 || entry.ecplus_Beer_ctrl7 === '') {
        entry.ecplus_Beer_ctrl7 = 'img/placeholder.png';
    }

    html += '<table class="mobile-info-window table-condensed table-bordered table-striped">';
    html += '<thead><tr><th colspan="2" class="text-center">' + (entry.ecplus_Beer_ctrl6 || '') + ', ' + (entry.ecplus_Beer_ctrl13 || '') + '</th></tr></thead>';
    html += '<tbody>';

    //How would you rate it
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl14.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl14.values[entry.ecplus_Beer_ctrl14] || '') + '</td>';
    html += '</tr>';

    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl11.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl11.values[entry.ecplus_Beer_ctrl11] || '') + '</td>';
    html += '</tr>';


    html += '<tr><td colspan="2" class="img-wrapper">';
    html += '<div class="frame-square">';
    html += '<div class="crop">';
    html += '<i class="fa fa-spinner fa-spin fa-3x"></i>';
    html += '<img src="' + entry.ecplus_Beer_ctrl7 + '" alt="" title="small wide image">';
    html += '</div>';
    html += '</div>';
    html += '</td></tr>';

    html += '</tbody>';
    html += '</table>';


    return html;
};