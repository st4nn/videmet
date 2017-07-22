<?php 
	function getApplicationsId($id) 
	{ 
		$link = Conectar();
		$sql = "SELECT 
				GROUP_CONCAT(DISTINCT a2.idapplication_application SEPARATOR ', ') AS ids 
			FROM
				applications 
				INNER JOIN applications AS a2 ON a2.name_application = applications.name_application
			WHERE 
				applications.idapplication_application = '$id'";

		$result = $link->query($sql);
		$fila =  $result->fetch_array(MYSQLI_ASSOC);
		return $fila['ids'];
	} 

	function validarNull_Float($str)
	{
		if ($str == null)
		{
		 return 0;
		} 
		return (float)$str;
	}
?>
