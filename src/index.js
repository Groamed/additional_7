module.exports = function solveSudoku(matrix) {
  // your solution
  var work = [],
    suggest = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var steps = 0;
  Init();
  Start();
  if (IsSolved(matrix)) {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        matrix[i][j] = work[i][j][0];
      }
    }
  }
  return matrix;

  function Init() {
    for (var i = 0; i < 9; i++) {
      work[i] = [];
      for (var j = 0; j < 9; j++) {
        if (matrix[i][j] > 0) {
          work[i][j] = [matrix[i][j], 'yes', []];
        } else {
          work[i][j] = [0, 'no', suggest];
        }
      }
    }
  }

  function Start() {
    do {
      changed = FindSol();
      steps++;
    } while ((steps < 81) && changed);
    if (!IsSolved(matrix) && !IsFailed())
      Selection();
  }

  function FindSol() {
    var changed = 0;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (work[i][j][1] != 'no') {
          continue;
        }
        changed += Single(i, j);
        changed += HiddenSingle(i, j);
      }
    }
    return changed;
  }

  function Single(i, j) {
    work[i][j][2] = ArrayDiff(work[i][j][2], GetRow(i));
    work[i][j][2] = ArrayDiff(work[i][j][2], GetColumn(j));
    work[i][j][2] = ArrayDiff(work[i][j][2], GetBlock(i, j));
    if (work[i][j][2].length == 1) {
      work[i][j][0] = work[i][j][2][0];
      work[i][j][1] = 'yes';
      work[i][j][2] = [];
      return 1;
    }
    return 0;
  }

  function HiddenSingle(i, j) {
    var changed = 0;
    var reduc = RowReduction(i, j);
    if (reduc.length == 1) {
      work[i][j][0] = reduc[0];
      work[i][j][1] = 'yes';
      work[i][j][2] = [];
      changed++;
    }
    var reduc = ColumnReduction(i, j);
    if (reduc.length == 1) {
      work[i][j][0] = reduc[0];
      work[i][j][1] = 'yes';
      work[i][j][2] = [];
      changed++;
    }
    var reduc = BlockReduction(i, j);
    if (reduc.length == 1) {
      work[i][j][0] = reduc[0];
      work[i][j][1] = 'yes';
      work[i][j][2] = [];
      changed++;
    }
    return changed;
  }

  function RowReduction(i, j) {
    var reduc = work[i][j][2];
    for (var n = 0; n < 9; n++) {
      if (n == j || work[i][n][1] != 'no') {
        continue;
      }
      reduc = ArrayDiff(reduc, work[i][n][2]);
    }
    return reduc;
  }

  function ColumnReduction(i, j) {
    var reduc = work[i][j][2];
    for (var n = 0; n < 9; n++) {
      if (n == i || work[n][j][1] != 'no') {
        continue;
      }
      reduc = ArrayDiff(reduc, work[n][j][2]);
    }
    return reduc;
  }

  function BlockReduction(i, j) {
    var reduc = work[i][j][2];
    var offset = OffSet(i, j);
    for (var n = 0; n < 3; n++) {
      for (var p = 0; p < 3; p++) {
        if (((offset.i + n) == i && (offset.j + p) == j) || work[offset.i + n][offset.j + p][1] != 'no') {
          continue;
        }
        reduc = ArrayDiff(reduc, work[offset.i + n][offset.j + p][2]);
      }
    }
    return reduc;
  }

  function GetRow(i) {
    var row = [];
    for (var n = 0; n < 9; n++) {
      if (work[i][n][0] != 'no')
        row[row.length] = work[i][n][0];
    }
    return row;
  }

  function GetColumn(j) {
    var column = [];
    for (var n = 0; n < 9; n++) {
      if (work[n][j][0] != 'no')
        column[column.length] = work[n][j][0];
    }
    return column;
  }

  function GetBlock(i, j) {
    var block = [];
    var offset = OffSet(i, j);
    for (var n = 0; n < 3; n++) {
      for (var p = 0; p < 3; p++) {
        if (work[n + offset.i][p + offset.j][0] != 'no')
          block[block.length] = work[n + offset.i][p + offset.j][0];
      }
    }
    return block;
  }

  function OffSet(i, j) {
    return {
      i: Math.floor(i / 3) * 3,
      j: Math.floor(j / 3) * 3
    };
  }

  function ArrayDiff(farr, sarr) {
    var diff = [];
    for (var i = 0; i < farr.length; i++) {
      var find = false;
      for (var j = 0; j < sarr.length; j++) {
        if (farr[i] == sarr[j]) {
          find = true;
          break;
        }
      }
      if (!find) {
        diff[diff.length] = farr[i];
      }
    }
    return diff;
  }

  function IsSolved(matrix) {
    var solv = true;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (matrix[i][j] == 0) {
          solv = false;
        }
      }
    }
    return solv;
  }

  function IsFailed() {
    var fail = false;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (work[i][j][1] == 'no' && !work[i][j][2].length) {
          fail = true;
        }
      }
    }
    return fail;
  }



  function Selection() {
    var imin = -1,
      jmin = -1,
      lowestsg = 0;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        matrix[i][j] = work[i][j][0];
        if (work[i][j][1] == 'no' && (work[i][j][2].length < lowestsg || !lowestsg)) {
          lowestsg = work[i][j][2].length;
          imin = i;
          jmin = j;
        }
      }
    }
    for (var n = 0; n < lowestsg; n++) {
      matrix[imin][jmin] = work[imin][jmin][2][n];
      var sudoku = new solveSudoku(matrix);
      if (IsSolved(sudoku)) {
        for (var i = 0; i < 9; i++) {
          for (var j = 0; j < 9; j++) {
            work[i][j][0] = sudoku[i][j];
          }
        }
        return;
      }
    }
  }
}