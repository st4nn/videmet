<?php
   include("../conectar.php"); 
   error_reporting(0);
   $link = Conectar();

   date_default_timezone_set('America/Bogota');

   $usuario = addslashes($_POST['pUsuario']);
   $clave = md5(md5(addslashes($_POST['pClave'])));
   $Fecha = $_POST['pFecha'];
   
   $sql = "SELECT iduser_user AS id,
                name_user AS Username,
                status_user AS Status,
                email AS Email,
                profile AS Profile,
                fullname AS Name
            FROM 
               users
            WHERE 
               users.name_user = '$usuario' 
               AND users.password_user = '" . $clave . "';";

   $result = $link->query($sql);

   if ( $result->num_rows == 1)
   {
      $idx = 0;
      
         $Resultado = array();
         while ($row = mysqli_fetch_assoc($result))
         {
            foreach ($row as $key => $value) 
            {
               $Resultado[$key] = utf8_encode($value);
            }
            $idx++;
         }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>