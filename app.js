'use strict'

const PORT = 8081;
const express = require('express');
const app = express();
const router = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const si = require('systeminformation');

const manarakaWUI_network = require('./manarakaWUI_modules/network.js');
const manarakaWUI_CPU = require('./manarakaWUI_modules/cpu.js');
const manarakaWUI_memory = require('./manarakaWUI_modules/memory.js');
const manarakaWUI_process = require('./manarakaWUI_modules/process.js');
const manarakaWUI_fileSys = require('./manarakaWUI_modules/fileSystem.js');

var path = __dirname + '/views/';

router.get('/',function(req, res){
  res.sendFile(path + 'index.html');
});

app.use('/',router);
app.use(express.static(__dirname + '/public'));
app.use('*',function(req,res){
  res.sendFile(path + '404.html');
});

io.on('connection', function(socket) {

  /*** CPUs ***/
  // Draw and update line chart for CPUs
  si.cpu(function(cpuInfo){   // cpuInfo holds informations like: cores, voltage, speed,...
    manarakaWUI_CPU.drawCPUChart(io, cpuInfo);
  });


  /*** Memory ***/
  // Draw and update line and donut chart for memories
  manarakaWUI_memory.drawMemoryChart(io);


  /*** Networks ***/
  // Draw and update networks line chart
  // Note: for this version, the app cannot detect network changes (interfaces changing state: up to down)
  si.networkInterfaces(function(ifaceList){
    var upIfaceList = [];       // upIfaceList holds informations about "Up" interfaces
    for (var i=0; i<ifaceList.length; i++) {
      si.networkStats(ifaceList[i].iface, function(ifaceInfo){
        if (ifaceInfo.operstate == 'up') {
          upIfaceList.push(ifaceInfo.iface);
        }
        createNetChart(i, ifaceList.length, upIfaceList);
      });
    }

  });

  // Callback after detecting all networks interfaces
  function createNetChart(init, final, upIfaceList) {
    if (init == final) {
      manarakaWUI_network.drawNetChart(io, upIfaceList);
    }
  }


  /*** Processes ***/
  // Create and update processes table
  manarakaWUI_process.createUpdateProcTable(io);


  /*** File System ***/
  // Create and update processes table
  manarakaWUI_fileSys.createUpdateFileSysTable(io);

});

http.listen(PORT, function () {     // Use socket.io
  //app.listen(8081, function () {
  console.log('App listening on port ' + PORT + '!');
})
