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

function obtenerFecha()
{
  var f = new Date();
  return f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + " " + CompletarConCero(f.getHours(), 2) + ":" + CompletarConCero(f.getMinutes(), 2) + ":" + CompletarConCero(f.getSeconds(), 2);
}

function Mensaje(Titulo, Mensaje, Tipo)
{
  if (Tipo == "danger")
  {
    Tipo = 'warning';
  } 
  swal({

          title: Titulo,
          text: Mensaje,
          type: Tipo,
          showCancelButton: false
  }); 
}