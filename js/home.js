function iniciarModulo()
{
  $(".username").text(Usuario.Name);

  $(".selectpicker").selectpicker({
    style: 'count'
  });

  $("#cntHome_Gra_EspXLinea_Buttons button").on("click", function(evento)
  {
    evento.preventDefault();
    var tipo = parseInt($(this).attr("data-valor"));

    $("#cntHome_Gra_EspXLinea_Buttons button").removeClass('btn-primary');
    $(this).addClass('btn-primary');

    graficaEspectadoresPorTiempo('cntHome_Gra_EspXLinea', ['', 'Reproducciones', 'Usuarios Únicos'], tipo, ['#ffb300', '#b71c1c']);
  });

  $("#lblHome_Fecha").text(home_ponerFecha());

  $("#txtHome_Inicio_Periodo").on("change", function()
  {
    var value = $(this).val();
    if (value != 6)
    {
        $("#cntHome_PrimeraLinea .lblHome_Dato").slideUp();
        $("#cntHome_PrimeraLinea .imgCargando").show();

        var f = new Date();
        var fIni = '';
        f = new Date(f-(60000*60*24*30));

        value = parseInt(value);
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

        $("#txtHome_Inicio_fechaIni").val(fIni);
        $("#txtHome_Inicio_fechaFin").val(obtenerFecha());

        $("#txtHome_CustomDate_Desde").val(fIni);

        home_cargarGraficas();
    } else
    {
        $("#btnHome_CustomDate_Pantalla").show();
        $("#btnHome_CustomDate_Imprimir").hide();
        $("#cntHome_CustomDate").modal({
          "backdrop"  : "static",
          "keyboard"  : true,
          "show"      : true            
        });
    }


  });

  $("#btnHome_CustomDate_Pantalla").on("click", function(evento)
  {
    evento.preventDefault();
    $("#cntHome_CustomDate").modal('hide');

    $("#txtHome_Inicio_fechaIni").val($("#txtHome_CustomDate_Desde").val());
    $("#txtHome_Inicio_fechaFin").val($("#txtHome_CustomDate_Hasta").val());

    home_cargarGraficas();

    $("#txtHome_CustomDate_Desde").val('');
    $("#txtHome_CustomDate_Hasta").val('');
  });

  $("#lnkHome_ExportarReporte").on("click", function(evento)
    {
        evento.preventDefault();

        /*$("#btnHome_CustomDate_Pantalla").hide();
        $("#btnHome_CustomDate_Imprimir").show();
        $("#cntHome_CustomDate").modal({
          "backdrop"  : "static",
          "keyboard"  : true,
          "show"      : true            
        });*/
        window.print();
    });

  $("#btnHome_CustomDate_Imprimir").on("click", function(evento)
    {
        evento.preventDefault();

        $("#txtHome_CustomDate_Desde").val('');
        $("#txtHome_CustomDate_Hasta").val('');
    });

  $("#txtHome_Applications").select_cargarApplications(function()
    {
        $("#txtHome_Inicio_Periodo").val(3);
      $("#txtHome_Inicio_Periodo").trigger("change");
      revisarUsuariosOnline();
    });
}

function home_cargarGraficas()
{
    home_cargarPrimerosDatos();

    graficaEspectadoresPorTiempo('cntHome_Gra_EspXLinea', ['', 'Reproducciones', 'Usuarios Únicos'], 5, ['#ffb300', '#b71c1c']);

    graficaEspectadoresPorTiempo('cntHome_Gra_EspXHora', ['Hora', 'Reproducciones', 'Usuarios Únicos'], 1, ['#00838f', '#ec407a']);

    graficaEspectadoresPorTiempo('cntHome_Gra_EspXDia', ['Día', 'Reproducciones', 'Usuarios Únicos'], 2, ['#cddc39', '#795548']);

    tablaEspectadoresPorFranja();

    graficasPorDispositivo('cntHome_Gra_EspXDispositivo');

    graficasPorPais('cntHome_Gra_EspXPais');
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
      fechaFin : $("#txtHome_Inicio_fechaFin").val(),
      Aplicacion : $("#txtHome_Applications").val()
    }, function(data, textStatus, xhr) 
    {
      $("#lblHome_Actuales").text((data.usrOnline));
      $("#lblHome_Totales").text(data.conTotales);
      $("#lblHome_Unicos").text(data.usrUnicos);
      $("#lblHome_MaxAudiencia").text(data.maxAudiencia);
      
      var tPromedioH = Math.trunc(data.tiempoPromedio/60/60);
      var tPromedioM = Math.trunc((data.tiempoPromedio/60)-(tPromedioH*60));
      var tPromedioS = Math.trunc(data.tiempoPromedio-(tPromedioH*60*60) - (tPromedioM*60));

      $("#lblHome_TiempoPromedio").text(CompletarConCero(tPromedioH, 2) + ':' + CompletarConCero(tPromedioM, 2) + ':' + CompletarConCero(tPromedioS, 2));
      $("#cntHome_PrimeraLinea .imgCargando").hide();
      $("#cntHome_PrimeraLinea .lblHome_Dato").show();

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


function graficaEspectadoresPorTiempo(idObj, etiquetas, tipo, vColor)
{
  $("#" + idObj).hide();
  $("#" + idObj).parent("div").parent("section").find(".imgCargando").show();
  vColor = vColor || '#a52714';

  $.post('scripts/php/home_cargarEspectadoresPorTiempo.php', 
    {
      Usuario : Usuario.id,
      fechaIni : $("#txtHome_Inicio_fechaIni").val(),
      fechaFin : $("#txtHome_Inicio_fechaFin").val(),
      Aplicacion : $("#txtHome_Applications").val(),
      tipo : tipo
    }, function(data, textStatus, xhr) {
     $("#" + idObj).parent("div").parent("section").find(".imgCargando").hide();
      if (data == 0)
      {

      } else
      {
        $("#" + idObj).slideDown();
        var idx = 0;
        var arr = [];
        arr[idx] = etiquetas;
        $.each(data, function(index, val) 
        {
          idx++;
           arr[idx] = [];
           $.each(val, function(index2, val2) 
           {
              if (index2 != 'etiqueta')
              {
                val2 = parseInt(val2);
              }
              arr[idx].push(val2);
           });
        });

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        
        function drawChart() {
          var data = google.visualization.arrayToDataTable(arr);

          var options = {
              colors: vColor,
              height : '350',
              legend: { position: 'bottom' }
            };

          var chart = new google.visualization.LineChart(document.getElementById(idObj));

          chart.draw(data, options);
        }
      }
    }, 'json');
}

function tablaEspectadoresPorFranja()
{
    var idObj = 'tblHome_Franjas';
    $("#" + idObj).hide();
    $("#" + idObj).parent("div").parent("section").find(".imgCargando").show();
  $.post('scripts/php/home_cargarEspectadoresPorFranja.php', 
    {
      Usuario : Usuario.id,
      fechaIni : $("#txtHome_Inicio_fechaIni").val(),
      fechaFin : $("#txtHome_Inicio_fechaFin").val(),
      Aplicacion : $("#txtHome_Applications").val(),
      tipo : 1
    }, function(data, textStatus, xhr) {

        $("#" + idObj).parent("div").parent("section").find(".imgCargando").hide();

      if (data == 0)
      {

      } else
      {
        $("#" + idObj).slideDown();

        var dia = {};

        dia.madrugrada = 0;
        dia.maniana = 0;
        dia.tarde = 0;
        dia.noche = 0;

        dia.Usrmadrugrada = 0;
        dia.Usrmaniana = 0;
        dia.Usrtarde = 0;
        dia.Usrnoche = 0;
        
        $.each(data, function(index, val) 
        {
          if (parseInt(val.etiqueta) < 7)
          {
            dia.madrugrada += parseInt(val.cantidad);
            dia.Usrmadrugrada += parseInt(val.usuariosUnicos);
          } else
          {
            if (parseInt(val.etiqueta) < 13)
            {
              dia.maniana += parseInt(val.cantidad);
              dia.Usrmaniana += parseInt(val.usuariosUnicos);
            } else
            {
              if (parseInt(val.etiqueta) < 19)
              {
                dia.tarde += parseInt(val.cantidad);
                dia.Usrtarde += parseInt(val.usuariosUnicos);
              } else
              {
                if (!isNaN(val))
                {
                  dia.noche += parseInt(val.cantidad);
                  dia.Usrnoche += parseInt(val.usuariosUnicos);
                }
              }
            }
          }
        });

        $.each(dia, function(index, val) 
        {
           $("#lblHome_Tbl_EspXFranja_" + index).text(val);
        });
      }
    }, 'json');
}

function graficasPorDispositivo(idObj)
{
    $("#" + idObj).hide();
    $("#" + idObj).parent("div").parent("section").find(".imgCargando").show();
  $.post('scripts/php/home_cargarEspectadoresPorDispositivo.php', 
    {
      Usuario : Usuario.id,
      fechaIni : $("#txtHome_Inicio_fechaIni").val(),
      fechaFin : $("#txtHome_Inicio_fechaFin").val(),
      Aplicacion : $("#txtHome_Applications").val(),
      tipo : 1
    }, function(data, textStatus, xhr) {
        $("#" + idObj).parent("div").parent("section").find(".imgCargando").hide();
      if (data == 0)
      {
        
      } else
      { 
        $("#" + idObj).slideDown();
        var arr = [];
        $.each(data, function(index, val) 
        {
          arr.push([val.etiqueta, parseInt(val.cantidad)]);
        });
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Topping');
          data.addColumn('number', 'Slices');
          data.addRows(arr);

          var options = {
            'height':500,
            'pieHole': 0.4};

          var chart = new google.visualization.PieChart(document.getElementById(idObj));
          chart.draw(data, options);
        } 
      }
    }, 'json');
}

function graficasPorPais(idObj)
{
    $("#txtHome_CustomDate_Desde").val('');

    $("#" + idObj).hide();
    $("#" + idObj).parent("div").parent("section").find(".imgCargando").show();
    $.post('scripts/php/home_cargarEspectadoresPorPais.php', 
    {
      Usuario : Usuario.id,
      fechaIni : $("#txtHome_Inicio_fechaIni").val(),
      fechaFin : $("#txtHome_Inicio_fechaFin").val(),
      Aplicacion : $("#txtHome_Applications").val(),
      tipo : 1
    }, function(data, textStatus, xhr) {

        $("#" + idObj).parent("div").parent("section").find(".imgCargando").hide();
      if (data == 0)
      {

      } else
      { 
        $("#" + idObj).slideDown();
        var arr = [['País', 'Cantidad']];
        $.each(data, function(index, val) 
        {
          arr.push([val.etiqueta, parseInt(val.cantidad)]);
        });
         google.charts.load('current', {
            'packages':['geochart'],
            'mapsApiKey': 'AIzaSyDQ-WIBwmrkkXHw6Kzr1E_0pO__2iAasCs'
          });
          google.charts.setOnLoadCallback(drawRegionsMap);


        function drawRegionsMap() {

        var data = google.visualization.arrayToDataTable(arr);
          
          var options = {'height':350};

          var chart = new google.visualization.GeoChart(document.getElementById(idObj));
          chart.draw(data, options);
        } 
      }
    }, 'json');
}