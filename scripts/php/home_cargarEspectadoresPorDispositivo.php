   <?php
  include("../conectar.php"); 
  include("funcionesBasicas.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $fechaIni = addslashes($_POST['fechaIni']);
   $fechaFin = addslashes($_POST['fechaFin']);
   $tipo =  addslashes($_POST['tipo']);
   $idAplicacion = addslashes($_POST['Aplicacion']);

   $idAplicacion = getApplicationsId($idAplicacion);

   switch ($tipo) {
      case 1:
            $tipo = '%H';
         break;
      case 2:
            $tipo = '%W';
         break;
      default:
            $tipo = '%H';
         break;
   }

   date_default_timezone_set('America/Bogota');

   $sql = "SELECT 
            device.device AS etiqueta,
            COUNT(sessions.idsession_session) AS cantidad
          FROM 
            sessions
            INNER JOIN device ON sessions.id_device=device.id_device
          WHERE
            sessions.event_session = 'Play'
            AND sessions.applications_id IN ($idAplicacion)
            AND sessions.x_duration > 2
            AND sessions.date_mysql >= '$fechaIni 00:00:00'
            AND sessions.date_mysql <= '$fechaFin 23:59:59'
         GROUP BY
            1
         ORDER BY 1;";

   $result = $link->query($sql);

   if ( $result->num_rows > 0)
   {
      $idx = 0;
      
         $Resultado = array();
         while ($row = mysqli_fetch_assoc($result))
         {
            $Resultado[$idx] = array();
            foreach ($row as $key => $value) 
            {
               $Resultado[$idx][$key] = utf8_encode($value);
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