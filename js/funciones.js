var Usuario = null;

$(document).ready(function() {
	aplicacion();
  Usuario = JSON.parse(localStorage.getItem('ls_videomet'));

  if (Usuario == null || Usuario == undefined)
  {
    cerrarSesion();
  } else
  {
    iniciarModulo();
  }
});

function aplicacion()
{
  $(".lblCerrarSesion").on("click", cerrarSesion);
}

function cerrarSesion()
{
  delete localStorage.ls_videomet;
  window.location.replace("index.html");
}

function CompletarConCero(n, length)
{
   n = n.toString();
   while(n.length < length) n = "0" + n;
   return n;
}