'use strict'

// Generates C3js line chart
//  * chartType     : chart's type, ex: spline
//  * containerId   : id of container where to place chart
//  * columnsData   : chart's data
//  * minMax        : configure min and max values for y axis of the chart
function generateChart(chartType, containerId, columnsData, minMax) {

  if (!minMax) {
    var newChart = c3.generate({
        bindto : containerId,
        data : {
          columns : columnsData,
          type : chartType
        },
        transition: { duration: 0 },
        tooltip: { show: false },
        point: { show: false }
    });

    return newChart;
  }

  var newChart = c3.generate({
      bindto : containerId,
      data : {
        columns : columnsData,
        type : chartType
      },
      transition: { duration: 0 },
      tooltip: { show: false },
      point: { show: false },
      axis: {
        y: {
          max: minMax.max,
          min: minMax.min
        }
      }
  });
  return newChart;
}

// Generates easyPieChart pie chart
//  * containerId : id of container where to place chart
//  * color       : pie chart's color
//  * pieSize     : pie chart's size
function generatePieChart(containerId, color, pieSize) {
  $(containerId).easyPieChart({
    animate:{
      duration:500,
      enabled:true
    },
    barColor:color,
    trackColor:'#ccc',
    scaleColor:false,
    lineWidth:5,
    lineCap:'circle',
    size: pieSize
  });
}

// Update table dynamically
//  * tableId   : id of the table
//  * fields    : array containing fields ranking
//  * data      : array of objects to display
/*  Example
  var data2 = [
    { field1: 'value a1', field2: 'value a2', field3: 'value a3', field4: 'value a4' },
    { field1: 'value b1', field2: 'value b2', field3: 'value b3', field4: 'value b4' },
  ];
  loadTable('data-table', ['field2', 'field1', 'field3'], data1);
*/
function loadTable(tableId, fields, data) {
    //$('#' + tableId).empty(); //not really necessary
    var rows = '';
    $.each(data, function(index, item) {
      var row = '<tr>';
      $.each(fields, function(index, field) {
        row += '<td>' + item[field+''] + '</td>';
      });
      rows += row + '<tr>';
    });
    $('#' + tableId + ' tbody').html(rows);
}

// Idem to loadTable() but add a progressbar in the latest column of each row
function loadTableWithBar(tableId, fields, data) {
    var rows = '';
    $.each(data, function(index, item) {
      var row = '<tr>';
      $.each(fields, function(index, field) {
        if (index == (fields.length - 1)) {

          var progressBar = '<div class="progress">';
          progressBar += '<div class="progress-bar" role="progressbar" ' +
                            'style="width: ' + item[field+''] + '%;"' +
                            'aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">' +
                            item[field+''] + '%' +
                          '</div>';
          progressBar += '</div>';
          row += '<td>' + progressBar + '</td>';
          
        } else {
          row += '<td>' + item[field+''] + '</td>';
        }
      });
      rows += row + '<tr>';
    });
    $('#' + tableId + ' tbody').html(rows);
}
