<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	
	$countQuery = 'SELECT COUNT(id) as lc FROM location';

	$countResultOne = $conn->query($countQuery);

	$query = $conn->prepare('DELETE FROM location WHERE id = ? AND NOT EXISTS (SELECT id FROM department WHERE locationID = ?)');
	
	$query->bind_param("ii", $_POST['id'], $_POST['id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	} 


	$countResultTwo = $conn->query($countQuery);

	$countOne = mysqli_fetch_assoc($countResultOne);

	$countTwo = mysqli_fetch_assoc($countResultTwo);

	if ($countOne['lc'] === $countTwo['lc']) {
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = ['The record cannot be deleted because it is associated with another record.'];
		
		mysqli_close($conn);
	
		echo json_encode($output); 

	} else {

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = ['Record has been deleted.'];
		
		mysqli_close($conn);
	
		echo json_encode($output); 
	}



?>