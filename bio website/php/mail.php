<?php
$configs = include('config.php');

require "PHPMailer/PHPMailer.php";
require "PHPMailer/SMTP.php";
require "PHPMailer/Exception.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$from = $_REQUEST['email'];
$name = $_REQUEST['name'];
$msg = $_REQUEST['message'];
$subject = 'email from www.maciejtelega.co.uk';

$mail = new PHPMailer();
$mail->IsSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true; 
$mail->SMTPSecure = 'tls'; 
$mail->Port = 587;  
$mail->Username = $configs['gmail'];
$mail->Password = $configs['password'];  
$mail->setFrom('m.telega.bio@gmail.com');
$mail->IsHTML(true);
$mail->Body = '<p>From: ' . $from . '</p><p> Name: ' . $name . '</p><p>Subject: ' . $subject . '</p><p>Message: ' . $msg . '</p>';
$mail->addAddress($configs['email']);
$mail->Send();

if ($mail->Send()){
  echo 'Email Sent..!';
} else {
  echo 'Error..!';
}

$mail->smtpClose();

?>