<?php

$project = $_GET['project'];

// Get cURL resource
$curl = curl_init();
// Set some options - we are passing in a useragent too here
curl_setopt_array($curl, array(
    CURLOPT_URL => 'http://plus.epicollect.net/projects?q='.$project.'&limit=25',
    CURLOPT_USERAGENT => 'Codular Sample cURL Request'
));
// Send the request & save response to $resp
$resp = curl_exec($curl);

echo $resp;

// Close request to clear up some resources
curl_close($curl);