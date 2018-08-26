'use strict'

// Returns size in TB, GB, MB, KB, B for a given number
exports.normalizeNumber = function(number) {
  if (number > 1024 * 1024 * 1024 * 1024) {
    return [(number / (1024 * 1024 * 1024 * 1024)).toFixed(1), ' '].join('TB');
  }
  else if (number > 1024 * 1024 * 1024) {
    return [(number / (1024 * 1024 * 1024)).toFixed(1), ' '].join('GB');
  }
  else if (number > 1024 * 1024) {
    return [(number / (1024 * 1024)).toFixed(1), ' '].join('MB');
  }
  else if (number > 1024) {
    return [(number / (1024)).toFixed(1), ' '].join('KB');
  }
  else {
    return [number, ' '].join('B');
  }
};

// Sorts an array of array [[...],[...],...] by specifying column index used to sort
exports.sortList = function(rowList, columnIndex) {
  for (var i=0; i<rowList.length; i++) {
    for (var j=0; j<rowList.length; j++) {
      if (rowList[j][columnIndex] < rowList[i][columnIndex]) {
        var tmp = rowList[i];
        rowList[i] = rowList[j];
        rowList[j] = tmp;
      }
    }
  }
  return rowList;
}
