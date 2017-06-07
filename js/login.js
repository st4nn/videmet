
$(document).on("ready", ready_login);

function ready_login()
{
  $("#frmLogin").on("submit", frmLogin_submit);

  var Usuario = JSON.parse(localStorage.getItem('ls_videomet'));  

  var objDate = 16;
  if (Usuario == null)
  {
    sessionFlag = false;
  } else
  {
    var objUser = JSON.parse(localStorage.getItem('ls_videomet'));
    var cDate = new Date();
    var sessionFlag = true;
  
    var pDate = new Date(objUser.cDate);
  
    objDate = cDate - pDate;  
  }

  
  if (Math.round((objDate/1000)/60) < 60 && sessionFlag)
  {
    objUser.cDate = cDate;
    localStorage.setItem("ls_videomet", JSON.stringify(objUser));    
    window.location.replace("admin/home.html");
  } else
  {
    delete localStorage.ls_videomet;    
  }
}
/**
 * Evento que se llama cuando el usuario hace submit para Iniciar Sesión
**/
function frmLogin_submit(event)
{
  event.preventDefault();
  var cDate = new Date();

  $.post("scripts/php/validarUsuario.php", 
    {
      pUsuario : $("#txtLogin_Usuario").val(),
      pClave : $("#txtLogin_Clave").val(),
      pFecha : cDate
    }, function (data)
    {
      if (data != 0)
      {
        localStorage.setItem("ls_videomet", JSON.stringify(data));  
        window.location.replace("admin/home.html");
      } else
      {
        $(".alert").html("<strong>Error!</strong> Acceso denegado.");
        $(".alert").fadeIn(300).delay(2600).fadeOut(600);
      }
    }, 'json').fail(function()
    {
      $(".alert").html("<strong>Error!</strong> No hay acceso al Servidor, por favor revisa tu conexión a red.");
      $(".alert").fadeIn(300).delay(2600).fadeOut(600);
    });
}