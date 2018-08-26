'use strict'

/*Import module*/
const si = require('systeminformation');
const manarakaWUI_utils = require('./utils.js');

var rowList = [];           // Holds files system  list
var fileSysDataList = [];   // Holds files system list formated to be compatible with dynamic table format

// Create and update processes table
exports.createUpdateFileSysTable = function(io) {

  setInterval(function(){
    si.fsSize(function(devices){
      //var title = ['Device', 'Folder', 'Type', 'Total', 'Free', 'Used', 'Percent'];

      var rowList = []
      devices.forEach(function(d) {
        var free = d.size - d.used;
        rowList.push([d.fs, d.mount, d.type, d.size, free, d.used, d.use]);
      });

      // Sort files system by Total size (at column 3)
      rowList = manarakaWUI_utils.sortList(rowList, 3);

      fileSysDataList = [];
      rowList.forEach(function(row) {
        fileSysDataList.push({
          field1: row[0],
          field2: row[1],
          field3: row[2],
          field4: manarakaWUI_utils.normalizeNumber(row[3]),
          field5: manarakaWUI_utils.normalizeNumber(row[4]),
          field6: manarakaWUI_utils.normalizeNumber(row[5]),
          field7: row[6].toFixed(0)
        });
      });

    });

    io.emit('updateFileSysData', fileSysDataList);    // Send new data to view

  }, 5000);

};
