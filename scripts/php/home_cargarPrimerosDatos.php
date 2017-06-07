<?php
  include("../conectar.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $fechaIni = addslashes($_POST['fechaIni']);
   $fechaFin = addslashes($_POST['fechaFin']);
   $idAplicacion = addslashes($_POST['Aplicacion']);

   $Respuesta = array('usrOnline' => 0, 'conTotales' => 0, 'usrUnicos' => 0, 'tiempoPromedio' => 0);

   $sql = "SELECT 
            COUNT(sessions.idsession_session) AS conexionesTotales,
            COUNT(distinct(viewers.ip_viewer)) AS usuariosUnicos,
            AVG(sessions.x_duration) AS duracion,
            MAX(idsession_session) as idMax
          FROM 
            sessions
            INNER JOIN `viewers` ON sessions.idviewer_session=viewers.id_viewer
            INNER JOIN `streams` ON streams.idstream_stream=viewers.idstream_viewer
          WHERE
            sessions.event_session = 'Play'
            AND streams.idapplication_stream = $idAplicacion
            AND sessions.x_duration > 2
            AND sessions.date_mysql >= '$fechaIni 00:00:00'
            AND sessions.date_mysql <= '$fechaFin 23:59:59';";

   $result = $link->query($sql);
   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   $Respuesta['usrUnicos'] = validarNull($fila['usuariosUnicos']);
   $Respuesta['conTotales'] = validarNull($fila['conexionesTotales']);
   $Respuesta['tiempoPromedio'] = validarNull($fila['duracion']);

   $sql = "SELECT uconcurrent_sessions FROM sessions WHERE idsession_session = '" . $fila['idMax'] . "';";

   $result = $link->query($sql);
   $fila =  $result->fetch_array(MYSQLI_ASSOC);
   $Respuesta['usrOnline'] = validarNull($fila['uconcurrent_sessions']);
   
   mysqli_free_result($result);  
   
   
   echo json_encode($Respuesta);

   function validarNull($str)
   {
      if ($str == null)
      {
         return 0;
      } 
      return (float)$str;
   }
?>