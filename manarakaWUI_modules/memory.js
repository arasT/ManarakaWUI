'use strict'

/*Import module*/
const si = require('systeminformation');

// Draw memories chart
var memData = {};
var memLineDataList = [];
var memDonutData = {};
exports.drawMemoryChart = function(io) {
  memLineDataList = [];

  memLineDataList.push(intializememLineDataList('RAM [0 GB]'));
  memLineDataList.push(intializememLineDataList('SWAP [0 GB]'));
  memDonutData = {
    ramLabel : 'RAM (100%)',
    ramPercent : 0,
    swapLabel : 'SWAP (100%)',
    swapPercent : 0
  };

  memData = {line: memLineDataList, donut: memDonutData};
  io.emit('initMemoryData', memData);   // Send data to view

  // Update data each 0.5 second but graph each second
  setInterval(function() {
    si.mem(function(memData){

      // Note: memory "used" field in the package documentation doesn't give the right info
      var ramUsedPercent = ((memData.total - memData.available)/memData.total)*100;

      // Note: memory "swaptotal" field in the package documentation gives NaN
      var swapTotal = memData.swapused + memData.swapfree;
      var swapUsedPercent = ((swapTotal - memData.swapused)/swapTotal)*100;
      swapUsedPercent = isNaN(swapUsedPercent) ? 0.0 : swapUsedPercent;
      var ramUsedInGB = ((memData.total - memData.available) / (1024*1024*1024)).toFixed(1);
      var swapUsedInGB = ((swapTotal - memData.swapused) / (1024*1024*1024)).toFixed(1);

      // Only display data at interval bellow 60 seconds: RAM
      memLineDataList[0].shift();                             // Remove temporarily label
      memLineDataList[0].shift();                             // Remove first data
      memLineDataList[0].push(ramUsedPercent.toFixed(0));     // Push new data
      var ramTotalInGB = (memData.total / (1024*1024*1024)).toFixed(1);
      var memLabel = ['RAM ', ramUsedInGB,' of ', ramTotalInGB, 'GB (', ramUsedPercent.toFixed(1), '%)'].join('');
      memLineDataList[0].unshift(memLabel);                   // Put label again

      // Only display data at interval bellow 60 seconds: SWAP
      memLineDataList[1].shift();                             // Remove temporarily label
      memLineDataList[1].shift();                             // Remove first data
      memLineDataList[1].push(swapUsedPercent.toFixed(0));    // Push new data
      var swapTotalInGB = (swapTotal / (1024*1024*1024)).toFixed(1);
      memLabel = ['SWAP ', swapUsedInGB,' of ', swapTotalInGB, 'GB (', swapUsedPercent.toFixed(1), '%)'].join('');
      memLineDataList[1].unshift(memLabel);                   // Put label again

      memDonutData = {
        ramLabel : ['RAM (', ramUsedPercent.toFixed(1), '%)'].join(''),
        ramPercent : ramUsedPercent.toFixed(0),
        swapLabel : ['SWAP (', swapUsedPercent.toFixed(1), '%)'].join(''),
        swapPercent : swapUsedPercent.toFixed(0)
      };
    });

    memData = {line: memLineDataList, donut: memDonutData};
    io.emit('updateMemoryData', memData);   // Send new data to view

  }, 1000);

  // Local function to initialize data for memories
  function intializememLineDataList(label) {
    var currentYList = [label];
    for (var i=0; i<60; i++) {
      currentYList.push(0);
    }
    return currentYList;
  }
};
