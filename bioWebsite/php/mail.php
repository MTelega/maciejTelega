<?php
$configs = include('config.php');

require "../vendor/phpmailer/phpmailer/src/PHPMailer.php";
require "../vendor/phpmailer/phpmailer/src/SMTP.php";
require "../vendor/phpmailer/phpmailer/src/Exception.php";
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$from = $_REQUEST['email'];
$name = $_REQUEST['name'];
$surname = $_REQUEST['surname'];
$msg = $_REQUEST['message'];
$subject = 'email from www.maciejtelega.co.uk';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                        //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = $configs['gmail'];                      //SMTP username
    $mail->Password   = $configs['password'];                   //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom($from);
    $mail->addAddress($configs['email']);     //Add a recipient

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = $subject;
    $mail->Body    = '<p>From: ' . $from . '</p><p> Name: ' . $name . '</p><p>Subject: ' . $subject . '</p><p>Message: ' . $msg . '</p>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

?>