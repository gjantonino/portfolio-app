<?php

function output_dirfiles($source) {

    $directory = $source;

    $images = preg_grep('~\.(jpeg|jpg|png)$~', scandir($directory));
    //$images = glob(($source + '*.{jpeg,gif,png}'), GLOB_BRACE);
    //$scanned_directory = array_diff(scandir($directory), array('..', '.'));
    
    //$type = pathinfo($source, PATHINFO_EXTENSION);
    //$response = $scanned_directory;

    //header("Content-Type: application/json");
    //echo json_encode(array_values($scanned_directory));
    echo json_encode(array_values($images));

}
output_dirfiles($_GET['path']);
//output_dirfiles('gallery-images/color/');
?>