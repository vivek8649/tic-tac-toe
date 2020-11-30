import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  public input: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];
  public isAdmin: boolean = false;
  public isGameFinished = false;

  constructor() {
  }

  public ngOnInit(): void {

  }

  public readUserInput(event: Event, x: number, y: number): void {
    if (this.input[x][y] === '*' || this.input[x][y] === '0' || this.isGameFinished) return;

    this.input[x][y] = '*';

    if (this.isGameWon('*')) {
      this.isGameFinished = true;
      setTimeout(() => {
        alert('You won');
      });
      return;
    }

    this.readAdminInput();

    if (this.isGameWon('0')) {
      this.isGameFinished = true;
      setTimeout(() => {
        alert('Computer won');
      });
      return;
    }

    if (this.isGameDraw()) {
      setTimeout(() => {
        this.isGameFinished = true;
        alert('It\'s a draw');
      });
      return;
    }
  }

  private isGameDraw() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (!this.input[i][j]) return false;
      }
    }
    return true;
  }

  private isGameWon(player: string): boolean {
    // check horizontal
    var dCount = 0;
    var dCrossCount = 0;

    for (var i = 0; i < 3; i++) {
      var hCount = 0;
      var vCount = 0;
      for (var j = 0; j < 3; j++) {
        // h
        if (this.input[i][j] === player) hCount++;
        if (this.input[j][i] === player) vCount++;
      }
      if (hCount == 3 || vCount === 3) return true;
    }

    for (var i = 0; i < 3; i++) {
      if (this.input[i][i] === player) dCount++;
    }
    if (dCount === 3) return true;

    for (var i = 0; i < 3; i++) {
      if (this.input[3 - i - 1][i] === player) dCrossCount++;
    }
    if (dCrossCount === 3) return true;

    return false;
  }

  private readAdminInput(): void {
    const index = this.getMiddleIndex();
    if (index.length) {
      this.input[index[0]][index[1]] = '0';
    }
  }

  private GetWinningIndex(): number[] {
    // check horizontal
    for (var i = 0; i < 3; i++) {
      var zeroCountH = 0;
      var zeroCountV = 0;
      var hIDx: number[] = [];
      var vIdx: number[] = [];
      for (var j = 0; j < 3; j++) {
        // h
        if (this.input[i][j] === '0') zeroCountH++;
        else if (this.input[i][j] !== '*') hIDx = [i, j];
        if (this.input[j][i] === '0') zeroCountV++;
        else if (this.input[j][i] !== '*') vIdx = [j, i];
      }
      if (zeroCountH === 2 && hIDx.length) return hIDx;
      if (zeroCountV === 2 && vIdx.length) return vIdx;
    }

    var dCount = 0;
    var idx: number[] = [];
    for (var i = 0; i < 3; i++) {
      if (this.input[i][i] === '0') dCount++;
      else if (this.input[i][i] !== '*') idx = [i, i];
    }
    if (dCount === 2) return idx;

    idx = [];
    dCount = 0;
    for (var i = 0; i < 3; i++) {
      if (this.input[3 - i - 1][i] === '0') dCount++;
      else if (this.input[3 - i - 1][i] !== '*') idx = [3 - i - 1, i];
    }
    if (dCount === 2) return idx;

    return [];
  }

  private getMiddleIndex(): number[] {
    // top horizontal
    var idx = [];
    idx = this.GetWinningIndex();
    if (idx.length) return idx;

    idx = this.getHorizontalInsertion();
    if (idx.length) return idx;

    idx = this.getVerticalInsertion();
    if (idx.length) return idx;

    idx = this.getDiagonalInsertion();
    if (idx.length) return idx;

    idx = this.getRandomInsertion();
    if (idx.length) return idx;

    return idx;
  }

  private getRandomInsertion(): number[] {
    var idx = [];

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (this.input[i][j] !== '*' && this.input[i][j] !== '0') {
          idx[0] = i;
          idx[1] = j;
        }
      }
    }

    return idx;
  }

  private getHorizontalInsertion(): number[] {
    for (var i = 0; i < 3; i++) {
      var count = 0;
      var idx = [];
      for (var j = 0; j < 3; j++) {
        if (this.input[i][j] === '*') {
          count++;
        } else if (this.input[i][j] !== '0') {
          idx[0] = i;
          idx[1] = j;
        }
      }
      if (count === 2 && idx.length) {
        return idx;
      }
    }
    return [];
  }

  private getVerticalInsertion(): number[] {
    // vertical
    for (var i = 0; i < 3; i++) {
      var count = 0;
      var idx = [];
      for (var j = 0; j < 3; j++) {
        if (this.input[j][i] === '*') {
          count++;
        } else if (this.input[j][i] !== '0') {
          idx[0] = j;
          idx[1] = i;
        }
      }
      if (count === 2 && idx.length) {
        return idx;
      }
    }

    return [];
  }

  private getDiagonalInsertion(): number[] {


    // diagonal
    var count = 0;
    var idx = [];

    for (var i = 0; i < 3; i++) {
      if (this.input[i][i] === '*') count++;
      else if (this.input[i][i] !== '0') {
        idx[0] = i;
        idx[1] = i;
      }
    }

    if (count === 2 && idx.length) return idx;

    // diagonal
    count = 0;
    idx = [];

    for (var i = 0, j = 2; i < 3; i++, j--) {
      count++;
      if (this.input[i][j] === '*') count++;
      else if (this.input[i][i] !== '0') {
        idx[0] = i;
        idx[1] = j;
      }
    }
    if (count == 2 && idx.length) return idx;

    return [];

  }


}
