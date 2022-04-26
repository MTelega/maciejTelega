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
	$countBefore = 'SELECT COUNT(*) FROM department';

	$countResultOne = $conn->query($countBefore);

	$query = $conn->prepare('DELETE FROM department WHERE id = ? AND NOT EXISTS (SELECT * FROM personnel WHERE departmentID = ?)');
	
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

	$countAfter = 'SELECT COUNT(*) FROM department';

	$countResultTwo = $conn->query($countAfter);

	$countOne = mysqli_fetch_assoc($countResultOne);

	$countTwo = mysqli_fetch_assoc($countResultTwo);

	if ($countOne['COUNT(*)'] === $countTwo['COUNT(*)']) {
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