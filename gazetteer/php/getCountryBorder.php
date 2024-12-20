<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url = '../countryBorders.geo.json';
$data = file_get_contents($url);
$decode = json_decode($data, true);
$coordinates;

for($i = 0; $i < count($decode['features']); $i++){
    if($decode['features'][$i]['properties']['iso_a2'] === $_REQUEST['countryCode']){
     $coordinates = $decode['features'][$i];
    }
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $coordinates;

echo json_encode($output);
?>