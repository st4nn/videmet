<?php
  include("../conectar.php"); 
  include("funcionesBasicas.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $idAplicacion = addslashes($_POST['Aplicacion']);

   $sql = "SELECT uconcurrent_sessions FROM sessions WHERE applications_id IN ($idAplicacion) ORDER BY idsession_session DESC LIMIT 1;";

   $result = $link->query($sql);
   $fila =  $result->fetch_array(MYSQLI_ASSOC);
   echo validarNull_Float($fila['uconcurrent_sessions']);
   
   mysqli_free_result($result);  
?>