'use strict';
var Bestpint = Bestpint || {};
Bestpint.createInfoWindowContent = function(the_entry) {

    var entry = the_entry;
    var html = '';

    //replace missing images (and the horrible ec+ placeholder) with nice placeholder
    if (entry.ecplus_Beer_ctrl7 === undefined || entry.ecplus_Beer_ctrl7.indexOf('thumbnail=true') > -1) {
        entry.ecplus_Beer_ctrl7 = 'img/placeholder.png';
    }


    html += '<table class="infoWindow table-striped table-bordered table-condensed">';
    html += '<thead><tr><th colspan="2" class="text-center">' + (entry.ecplus_Beer_ctrl6 || '') + '</th></tr></thead>';
    html += '<tbody>';


    //let's do it manually as we kow all the fields

    //name of the place
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl13 + '</td>';
    html += '<td>' + (entry.ecplus_Beer_ctrl13 || '') + '</td>';
    html += '</tr>';

    //type of place
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Place_ctrl4.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Place_ctrl4.values[entry.ecplus_Place_ctrl4] || '') + '</td>';
    html += '</tr>';

    //Name of beer
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl6 + '</td>';
    html += '<td>' + (entry.ecplus_Beer_ctrl6 || '') + '</td>';
    html += '</tr>';

    //Brewery
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl8 + '</td>';
    html += '<td>' + (entry.ecplus_Beer_ctrl8 || '') + '</td>';
    html += '</tr>';

    //Type of beer
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl9.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl9.values[entry.ecplus_Beer_ctrl9] || '') + '</td>';
    html += '</tr>';


    //html += '<tr>';
    //html += '<td colspan="2" class="text-center">' + Bestpint.project.ecplus_Beer_ctrl7 + '</td>';
    //html += '</tr>';
    html += '<tr colspan="2">';
    //set fixed height for table cell to avoid cell resizing messing up the auto panning when infoWindow is open
    html += '<tr><td colspan="2" class="img-wrapper">';
    html += '<div class="desktop-frame-square">';
    html += '<div class="crop">';
    html += '<i class="fa fa-spinner fa-spin fa-3x"></i>';
    html += '<img src="' + entry.ecplus_Beer_ctrl7 + '" alt="" title="" width="200">';
    html += '</div>';
    html += '</div>';
    html += '</td></tr>';
    html += '</tr>';

    //How would you rate it
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl14.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl14.values[entry.ecplus_Beer_ctrl14] || '') + '</td>';
    html += '</tr>';

    //how is the price range
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl11.key + '</td>';
    html += '<td>' + (Bestpint.project.ecplus_Beer_ctrl11.values[entry.ecplus_Beer_ctrl11] || '') + '</td>';
    html += '</tr>';

    //price and currency
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Beer_ctrl12 + '</td>';
    html += '<td>' + (entry.ecplus_Beer_ctrl12 || '') + '</td>';
    html += '</tr>';

    //Any comments?
    html += '<tr>';
    html += '<td>' + Bestpint.project.ecplus_Place_ctrl5 + '</td>';
    html += '<td>' + (entry.ecplus_Place_ctrl5 || '') + '</td>';
    html += '</tr>';

    html += '</tbody>';
    html += '</table>';

    return html;
}