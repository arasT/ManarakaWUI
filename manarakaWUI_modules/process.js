'use strict'

/*Import module*/
const si = require('systeminformation');
const manarakaWUI_utils = require('./utils.js');

var rowList = [];           // Holds processes list
var processDataList = [];   // Holds processes list formated to be compatible with dynamic table format

// Create and update processes table
exports.createUpdateProcTable = function(io) {

  setInterval(function(){
    si.processes(function(procData){
      //var title = ['PID', 'USER', 'PR', 'NI', 'VIRT', 'RES', 'S', '%CPU', '%MEM', 'TIME', 'NAME'];
      var rowList = [];

      procData.list.forEach(function(p) {
        var adjustedCPU = p.pcpu.toFixed(1);    // Adjust CPU percent
        var nice = isNaN(p.nice) ? '?' : p.nice;
        rowList.push([p.pid, p.user, p.priority, nice, p.mem_vsz, p.mem_rss, p.state.substring(0,1), adjustedCPU, p.pmem, p.started, p.name]);
      });

      // Sort by cpu (cpu usage is at column 7)
      rowList = manarakaWUI_utils.sortList(rowList, 7);

      processDataList = [];
      // Translate processes list to the same format used to genetrate dynamic table
      rowList.forEach(function(row) {
        processDataList.push({
          field1: row[0],
          field2: row[1],
          field3: row[2],
          field4: row[3],
          field5: row[4],
          field6: row[5],
          field7: row[6],
          field8: row[7],
          field9: row[8],
          field10: row[9],
          field11: row[10]
        });
      });

    });

    io.emit('updateProcData', processDataList);    // Send new data to view

  }, 5000);

};
