<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url = '../countryBorders.geo.json';
$data = file_get_contents($url);
$decode = json_decode($data, true);

$selector = [];
foreach ($decode['features'] as $f) {
    $key = $f['properties']['iso_a2'] . $f['properties']['name'];
    if (!isset($selector[$key])) {
        $selector[] = [
            'iso_a2' => $f['properties']['iso_a2'],
            'name' => $f['properties']['name'],
        ];
 } 
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $selector;

echo json_encode($output);
?>