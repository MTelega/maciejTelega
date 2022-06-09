<?php
$configs = include('config.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

$response_array = array();
$from = $_REQUEST['email'];
$name = $_REQUEST['name'];
$msg = $_REQUEST['message'];
$subject = 'email from bio website';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);


    $mail->setFrom($from);
    $mail->addAddress($configs['email']);
    $mail->Subject = $subject;
    $mail->isHTML(TRUE);
    $mail->Body = 'Sent from maciejtelega.co.uk: <br><br>' . $msg . '<br><br>Sent by: <br>' . $name . '<br><br>Email address: <br>' . $from;

    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = TRUE;
    $mail->SMTPSecure = 'tls';
    $mail->Username = $configs['gmail'];
    $mail->Password = $configs['password'];
    $mail->Port = 587;
 
    /* Finally send the mail. */
    if(!$mail->Send()) {
        $message = 'Mail error: '.$mail->ErrorInfo;
        $response_array = array("success"=> false,
                                "status" => false,
                                "message" => $message);
        header('Content-Type: application/json');
        echo json_encode($response_array);die();
    } else {
        $message = "Message has beed sent.";
        $response_array = array("success"=> true,
                                "status" => true,
                                "message" => $message);
        header('Content-Type: application/json');
        echo json_encode($response_array);die();
    }

?>