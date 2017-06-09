function iniciarModulo()
{
  $(".username").text(Usuario.Name);

  $(".selectpicker").selectpicker({
    style: 'count'
  });

  $("#lblHome_Fecha").text(home_ponerFecha());
  $("#txtHome_Applications").select_cargarApplications(function()
    {
      home_cargarPrimerosDatos();
      revisarUsuariosOnline();
    });
}

function home_ponerFecha()
{
  var diasDeLaSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  var meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  var f = new Date();

  return diasDeLaSemana[f.getDay()] + ' ' + f.getDate() + ' de ' + meses[f.getMonth()] + '-' + f.getFullYear();
}

$.fn.select_cargarApplications = function(callback)
{
  if (callback === undefined){callback = function(){}}

  $(this).find('option').remove();
  var obj = this;
  $.post('scripts/php/home_cargarApplications.php', {Usuario : Usuario.id}, function(data, textStatus, xhr) 
  {
    if (data != 0)
    {
      var tds = '';
      $.each(data, function(index, val) 
      {
         tds += '<option value="' + val.id + '">' + val.name + '</option>';
      });
      $(obj).append(tds);
      $(obj).selectpicker('refresh');

      callback();
    } else
    {
      sweetAlert("Oops...", "No tienes ninguna aplicación asociada!", "error"); 
    }
  }, 'json');
}

function home_cargarPrimerosDatos()
{
  $.post('scripts/php/home_cargarPrimerosDatos.php', 
    {
      Usuario : Usuario.id,
      fechaIni : '2017-06-01',
      fechaFin : '2017-06-01',
      Aplicacion : $("#txtHome_Applications").val()
    }, function(data, textStatus, xhr) 
    {
      $("#lblHome_Actuales").text((data.usrOnline));
      $("#lblHome_Totales").text(data.conTotales);
      $("#lblHome_Unicos").text(data.usrUnicos);
      
      var tPromedioH = Math.trunc(data.tiempoPromedio/60/60);
      var tPromedioM = Math.trunc((data.tiempoPromedio/60)-(tPromedioH*60));
      var tPromedioS = Math.trunc(data.tiempoPromedio-(tPromedioH*60*60) - (tPromedioM*60));

      $("#lblHome_TiempoPromedio").text(CompletarConCero(tPromedioH, 2) + ':' + CompletarConCero(tPromedioM, 2) + ':' + CompletarConCero(tPromedioS, 2));
      $("#cntHome_PrimeraLinea .imgCargando").hide();

      setTimeout(home_cargarPrimerosDatos, 60*1000*10);
    }, 'json').fail(function()
    {
      setTimeout(home_cargarPrimerosDatos, 60*1000*1);
    });
}

function revisarUsuariosOnline()
{
  $.post('scripts/php/home_cargarUsuariosOnline.php', 
    {
      Usuario : Usuario.id,
      Aplicacion : $("#txtHome_Applications").val()
    }, function(data, textStatus, xhr) 
    {
      $("#img_Home_Actuales").hide();
      $("#lblHome_Actuales").text((data));
      setTimeout(revisarUsuariosOnline, 30*1000);
    }).fail(function()
    {
      setTimeout(revisarUsuariosOnline, 5*1000);
    });
}