<?php

$inputArr = $_POST['input'];
$resultsArr = $_POST['results'];
$xArr = $_POST['xArr'];
$tArr = $_POST['tArr'];

define('RESULTS_DIR', $_SERVER['DOCUMENT_ROOT'] . '/server/files');

// Функция для ответа на клиент
function response_to_client($fileName)
{
    header('Content-type: application/json');
    echo json_encode(array(
        'filename' => '/server/files/' . $fileName
    ));
    die();
}

if (!empty($inputArr) && !empty($resultsArr)) {
    // Правильно обзываем файл
    $fileName = '';
    $filePath = RESULTS_DIR . '/';
    foreach ($inputArr as $inputVal) {
        $fileName .= $inputVal . '_';
    }
    $fileName = substr($fileName, 0, -1);
    $fileName .= '.txt';
    $filePath .= $fileName;

    // Если файл с такими исходными данными уже есть, возвращаем его
    if (!file_exists($filePath)) {
        // Иначе создаем его
        // Мой хитрый алгоритм прохождения по массиву реализуется здесь
        $content = '';
		
        //for ($j = 0; $j < count($resultsArr); $j++) {
            //for ($i = 0; $i < count($resultsArr[$j]); $i++) {
		for ($j = 0; $j < count($tArr); $j++) {
            for ($i = 0; $i < count($xArr); $i++) {
                //$content .= $resultsArr[$i][$j] . "\n";
				$content .= $tArr[$j] . " " . $xArr[$i] . " " .  $resultsArr[$i][$j] . "\n";
			
            }
        }
        file_put_contents($filePath, $content);
    }
    response_to_client($fileName);
}
