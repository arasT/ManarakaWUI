'use strict'

/*Import module*/
const si = require('systeminformation');
const manarakaWUI_utils = require('./utils.js');

var netData = {};             // Contains all network data
var totalDataIfaceList = [];  // Contains total Up/Down data per iface
var netLineDataList = [];     // Data list for all interfaces: UP and DOWN
var ifaceUploadList = [];     // Data list for all interfaces: Upload only
var ifaceDownloadList = [];   // Data list for all interfaces: Download only

// Create chart for Up networks interfaces and update this chart continuously
exports.drawNetChart = function(io, ifaceUpList) {
  netLineDataList = [];
  ifaceUploadList = [];
  ifaceDownloadList = [];

  // Init data (only display data between 0-60 seconds)
  ifaceUpList.forEach(function(ifaceUp){

    ifaceUploadList.push({
      iface : ifaceUp,
      y : (function(){
        var ifaceLabel = [ifaceUp, ' ', 'Up'].join('');
        var currentYList = [ifaceLabel];
        for (var i=0; i<60; i++) {
          currentYList.push(0);
        }
        return currentYList;
      })()
    });

    ifaceDownloadList.push({
      iface : ifaceUp,
      y : (function(){
        var ifaceLabel = [ifaceUp, ' ', 'Down'].join('');
        var currentYList = [ifaceLabel];
        for (var i=0; i<60; i++) {
          currentYList.push(0);
        }
        return currentYList;
      })()
    });

  });

  ifaceUploadList.forEach(function(ifaceUpload){
    netLineDataList.push(ifaceUpload.y);
  });
  ifaceDownloadList.forEach(function(ifaceDownload){
    netLineDataList.push(ifaceDownload.y);
  });

  netData = {line: netLineDataList, totalPerIface: {}};
  io.emit('initNetData', netData);   // Send data to view


  // Update data and graph each second
  setInterval(function() {
    netLineDataList = [];
    ifaceDownloadList.forEach(function(iData){
      si.networkStats(iData.iface).then(ifaceData => {

        // Get total data (up/down) for each interface
        totalDataIfaceList.push({
          field1: iData.iface,
          field2: manarakaWUI_utils.normalizeNumber(ifaceData.rx),
          field3: manarakaWUI_utils.normalizeNumber(ifaceData.tx)
        });

        // Only display data at interval bellow 60 seconds
        iData.y.shift();                                    // Remove temporarily label
        iData.y.shift();                                    // Remove first data
        var downKBsec = Math.ceil(ifaceData.rx_sec / 1024);
        downKBsec = isNaN(downKBsec) ? 0 : downKBsec;
        var ifaceLabel = [iData.iface, ' ', 'Down: ', downKBsec, 'KBps'].join('');
        iData.y.push(downKBsec > 0 ? downKBsec : 0);        // Put latest data
        iData.y.unshift(ifaceLabel)                         // Put the label again
      });
    });

    ifaceUploadList.forEach(function(iData){
      si.networkStats(iData.iface).then(ifaceData => {

        // Only display data at interval bellow 60 seconds
        iData.y.shift();                                    // Remove temporarily label
        iData.y.shift();                                    // Remove first data
        var upKBsec = Math.ceil(ifaceData.tx_sec / 1024);
        upKBsec = isNaN(upKBsec) ? 0 : upKBsec;
        var ifaceLabel = [iData.iface, ' ', 'Up: ', upKBsec, 'KBps'].join('');
        iData.y.push(upKBsec > 0 ? upKBsec : 0);        // Put latest data
        iData.y.unshift(ifaceLabel)                         // Put the label again
      });
    });

    ifaceUploadList.forEach(function(ifaceUpload){
      netLineDataList.push(ifaceUpload.y);
    });
    ifaceDownloadList.forEach(function(ifaceDownload){
      netLineDataList.push(ifaceDownload.y);
    });

    netData = {line: netLineDataList, totalPerIface: totalDataIfaceList};
    io.emit('updateNetData', netData);    // Send new data to view
    totalDataIfaceList = [];

  }, 1000);

  // Update graph each 2 seconds
  /*setInterval(function(){
    io.emit('updateNetData', netLineDataList);   // Send new data to view
  }, 2000)*/
};
