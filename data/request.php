<?php

// Get cURL resource
$curl = curl_init();
// Set some options - we are passing in a useragent too here
curl_setopt_array($curl, array(
    CURLOPT_URL => 'http://plus.epicollect.net/Bestpint/Place.json',
    CURLOPT_USERAGENT => 'Codular Sample cURL Request'
));
// Send the request & save response to $resp
$resp = curl_exec($curl);

var_dump($resp);

// Close request to clear up some resources
curl_close($curl);