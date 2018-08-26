'use strict'

/*Import module*/
const si = require('systeminformation');

// Draw CPUs chart
var CPUDataList = [];   // Data list for each CPU
exports.drawCPUChart = function(io, cpuInfo) {
  CPUDataList = [];
  
  var cpu_index = 0;
  for (var i=0; i<cpuInfo.cores; i++) {
    cpu_index = i+1;
    CPUDataList.push((function(){
        var CPULabel = ['CPU-', cpu_index].join('');
        var currentYList = [CPULabel];
        for (var i=0; i<60; i++) {
          currentYList.push(0);
        }
        return currentYList;
      })()
    );
  }

  io.emit('initCPUData', CPUDataList);   // Send data to view

  // Update data each 0.5 second but graph each second
  setInterval(function() {
    si.currentLoad(function(data) {
      var cpu_index = 0;
      data.cpus.forEach(function(cpu){

        // Only display data at interval bellow 60 seconds
        CPUDataList[cpu_index].shift();                     // Remove temporarily label
        CPUDataList[cpu_index].shift();                     // Remove first data
        CPUDataList[cpu_index].push(Math.floor(cpu.load));  // Push new data
        var cpuLabel = ['CPU-', (cpu_index + 1), ': ', cpu.load.toFixed(1), '%'].join('');
        CPUDataList[cpu_index].unshift(cpuLabel); // Put label again
        cpu_index++;
      });
    });
  }, 500);

  // Update graph each second
  setInterval(function(){
    io.emit('updateCPUData', CPUDataList);   // Send new data to view
  }, 1000);

};
