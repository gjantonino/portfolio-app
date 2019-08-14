<?php
// generates a thumbnail, if you only provide a width or a height value,
// it will keep the original image ratio
function output_thumbnail($source, $newWidth, $newHeight) {

    $type = pathinfo($source, PATHINFO_EXTENSION);
    if ($type == "png") {
        $image = imagecreatefrompng($source);
    } else {
        $image = imagecreatefromjpeg($source);
    }
    // get image dimensions
    $dimensions = getimagesize($source);

    $width = $dimensions[0];
    $height = $dimensions[1];

    if (!$newWidth && !$newHeight) return false;
    // if width or height is not set (but at least one is) calculate the other using ratio
    if (!$newWidth || !$newHeight) {
        $ratio = $width / $height;

        if ($newHeight) {
            $newWidth = $newHeight * $ratio;
        } else {
            $newHeight = $newWidth / $ratio;
        }
    }

    // create an empty image
    $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
    // fill it with resized version of original image
    imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    // notify the browser that incoming response is an image
    header("Content-Type: image/jpeg");
    return imagejpeg($resizedImage);

    // free the memory
    imagedestroy($image);
    imagedestroy($resizedImage);
}

output_thumbnail($_GET["image"], 768); // resize to 500 pixels in width