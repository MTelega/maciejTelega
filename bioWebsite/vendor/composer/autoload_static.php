<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInite195a7e15bd502fb319177001e2b513f
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PHPMailer\\PHPMailer\\' => 20,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PHPMailer\\PHPMailer\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpmailer/phpmailer/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInite195a7e15bd502fb319177001e2b513f::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInite195a7e15bd502fb319177001e2b513f::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInite195a7e15bd502fb319177001e2b513f::$classMap;

        }, null, ClassLoader::class);
    }
}
