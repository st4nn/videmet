<?php
  include("../conectar.php"); 
  include("funcionesBasicas.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $fechaIni = addslashes($_POST['fechaIni']);
   $fechaFin = addslashes($_POST['fechaFin']);
   $idAplicacion = addslashes($_POST['Aplicacion']);

   $idAplicacion = getApplicationsId($idAplicacion);

   date_default_timezone_set('America/Bogota');

   $Respuesta = array('usrOnline' => 0, 'conTotales' => 0, 'usrUnicos' => 0, 'tiempoPromedio' => 0);

   $sql = "SELECT 
            COUNT(sessions.idsession_session) AS conexionesTotales,
            MAX(sessions.uconcurrent_sessions) AS maxAudiencia,
            COUNT(distinct(viewers.ip_viewer)) AS usuariosUnicos,
            SUM(sessions.x_duration) AS duracion
          FROM 
            sessions
            INNER JOIN viewers ON sessions.idviewer_session=viewers.id_viewer
          WHERE
            sessions.event_session = 'Play'
            AND sessions.applications_id IN ($idAplicacion)
            AND sessions.x_duration > 2
            AND sessions.date_session >= '$fechaIni 00:00:00'
            AND sessions.date_session <= '$fechaFin 23:59:59';";

   $result = $link->query($sql);
   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   $Respuesta['usrUnicos'] = validarNull_Float($fila['usuariosUnicos']);
   $Respuesta['conTotales'] = validarNull_Float($fila['conexionesTotales']);
   $Respuesta['maxAudiencia'] = validarNull_Float($fila['maxAudiencia']);
   $tmpConTotales = $Respuesta['conTotales'];
   if ($tmpConTotales == 0)
   {
      $Respuesta['tiempoPromedio'] = 0;      
   } else
   {
      $Respuesta['tiempoPromedio'] = validarNull_Float($fila['duracion'])/$Respuesta['conTotales'];
   }


   $sql = "SELECT uconcurrent_sessions FROM sessions WHERE applications_id IN ($idAplicacion) ORDER BY idsession_session DESC LIMIT 1;";

   $result = $link->query($sql);
   $fila =  $result->fetch_array(MYSQLI_ASSOC);
   $Respuesta['usrOnline'] = validarNull_Float($fila['uconcurrent_sessions']);
   
   mysqli_free_result($result);  
   
   
   echo json_encode($Respuesta);

?>