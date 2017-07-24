<?php
   include("../conectar.php"); 

   error_reporting(0);

   $link = Conectar();

   date_default_timezone_set('America/Bogota');

   $sql = "SELECT DISTINCT ip_viewer
            FROM 
               viewers
            WHERE
              country_code = '-'
            ORDER BY viewers.id_viewer DESC
            LIMIT 0, 1000;";

   $result = $link->query($sql);

   if ( $result->num_rows > 0)
   {
     while ($row = mysqli_fetch_assoc($result))
     {
        $datos = json_decode(file_get_contents('http://ip-api.com/json/' . $row['ip_viewer']));


        $sql = "UPDATE viewers SET country_code = '" . $datos->countryCode . "', country_name = '" . $datos->country . "' WHERE ip_viewer = '" . $row['ip_viewer'] . "';";
        $link->query($sql);

        $sql = "INSERT INTO viewers_data(IP_Address, Country_Name, Country_Code, Region_Code, Region_Name, City_Name, Latitud, Longitud, ISP, Local_Time) VALUES 
                ('" . $datos->query . "', 
        '" . utf8_decode($datos->country) . "', 
        '" . utf8_decode($datos->countryCode) . "', 
        '" . utf8_decode($datos->region) . "', 
        '" . utf8_decode($datos->regionName) . "', 
        '" . utf8_decode($datos->city) . "', 
        '" . utf8_decode($datos->lat) . "', 
        '" . utf8_decode($datos->lon) . "', 
        '" . utf8_decode($datos->isp) . "', 
        '" . utf8_decode($datos->timezone) . "') ON DUPLICATE KEY UPDATE Region_Name = VALUES(Region_Name), City_Name = (City_Name);";

        $link->query($sql);
     }
     mysqli_free_result($result);  

   } 
?>