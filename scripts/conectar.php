<?php 
function Conectar() 
{ 
   $link = new mysqli("localhost", "root", "", "videomet_broncov7");
   if ($link->connect_errno) 
   {
      echo "Error: (" . $link->connect_errno . ") " . $link->connect_error;
      exit(); 
   }

   return $link; 
} 

?>
