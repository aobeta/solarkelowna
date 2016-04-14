<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//if(isset($_POST['hashString'])){
   $id = $_POST['var'];
   
   $con = mysqli_connect('localhost', 'root', 'letmein', 'SolarKel4');
        mysqli_set_charset($con,'utf8'); 
        $sql = 'SELECT area FROM Building WHERE buildingId='.$id;
        $result = mysqli_query($con, $sql);
                
        while ($info = mysqli_fetch_array($result)) {
            $area = $info['area'];
		
        }
   
   echo $area;
        
   //$file = 'DELETETHIS.txt';
    
   //file_put_contents($file, $area, FILE_APPEND);
   
?>
