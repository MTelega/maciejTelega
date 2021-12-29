<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$configs = include('config.php');

$executionStartTime = microtime(true);

$url = 'http://api.geonames.org/timezoneJSON?formatted=true&lat=' . $_REQUEST['Latitude'] . '&lng=' . $_REQUEST['Longitude'] . '&username='. $configs['geonamesUserName'] .'&style=full';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>