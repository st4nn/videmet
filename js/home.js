function iniciarModulo()
{
  $(".username").text(Usuario.Name);

  $(".selectpicker").selectpicker({
    style: 'count'
  });

  $("#lblHome_Fecha").text(home_ponerFecha());
  $("#txtHome_Applications").select_cargarApplications(function()
    {
      $("#txtHome_Inicio_Periodo").trigger("change");
      revisarUsuariosOnline();
    });

  $("#txtHome_Inicio_Periodo").on("change", function()
  {
    var value = $(this).val();
    if (value > 2)
    {
      $("#cntHome_wUsrOnline").hide();
      $(".cntHome_wInicio").removeClass('col-lg-3');
      $(".cntHome_wInicio").addClass('col-lg-4');
    } else
    {
      $("#cntHome_wUsrOnline").slideDown();
      $(".cntHome_wInicio").removeClass('col-lg-4');
      $(".cntHome_wInicio").addClass('col-lg-3');
    }

    var f = new Date();
    var fIni = '';

    value = parseInt(value);
    console.log(value);
    switch (value) {
      case 1:
          fIni = f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + ' 00:00:00';
        break;
      case 2:
          f = new Date(f-(60000*60*24));
          fIni = f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + " " + CompletarConCero(f.getHours(), 2) + ":" + CompletarConCero(f.getMinutes(), 2) + ":" + CompletarConCero(f.getSeconds(), 2);
        break;
      case 3:
          f = new Date(f-(60000*60*24*7));
          fIni = f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + " 00:00:00";
        break;
      case 4:
          f = new Date(f-(60000*60*24*30));
          fIni = f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + " 00:00:00";
        break;
      case 5:
          f = new Date(f-(60000*60*24*30*2));
          fIni = f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + " 00:00:00";
        break;
      default: 
          Mensaje("Hey","Algo salió mal, dile a tu proveedor que intentaste cambiar el Periodo en Inicio y te salió esto", "error");
        break;
    }

    home_cargarPrimerosDatos();

    $("#txtHome_Inicio_fechaIni").val(fIni);
    $("#txtHome_Inicio_fechaFin").val(obtenerFecha());
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
      fechaIni : $("#txtHome_Inicio_fechaIni").val(),
      fechaFin : $("#txtHome_Inicio_fechaIni").val(),
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