import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { element } from 'protractor';
import { GameLevel } from '../shared/enum/game-level.enum';
import { Player } from '../shared/enum/player';
import { GameInfo } from '../shared/model/game-info';
import { MiniMaxService } from '../shared/service/minimax.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {

  @Input()
  public gameInfo: GameInfo = { level: GameLevel.easy, isGameStarted: false };

  public player1 = 'X';
  public player2 = '0';

  public winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  public board: string[] = ['', '', '', '', '', '', '', '', ''];
  public isAdmin = false;
  public isGameFinished = false;

  constructor(private miniMaxService: MiniMaxService) {
  }

  public ngOnInit(): void {
    this.startGame();
  }

  public ngOnChanges(): void {
    this.startGame();
  }

  public readUserInput(event: Event, x: number): void {
    // Invalid inputs - If user is clicking at filled places or after game is finished
    if (this.board[x] || this.isGameFinished) {
      return;
    }

    setTimeout(() => {
      this.makeTheMove(x, this.player1);
      setTimeout(() => {
        // Check if 2nd player is computer if yes make it's move
        if (!this.isGameFinished) {
          this.makeTheMove(this.getBestMoveForComputer(), this.player2);
        }
      });
    });
  }

  private getBestMoveForComputer(): number {
    if (this.gameInfo.level == GameLevel.impossible) {
      return this.miniMaxService.findBestMove(this.board, this.player2, this.player1);
    } else if (this.gameInfo.level == GameLevel.medium) {
      return this.findPossibleBestIndex(this.board, this.player2, this.player1);
    } else {
      const playerWinningIndex = this.getWinningIndex(this.board, this.player2);
      if (playerWinningIndex != -1) return playerWinningIndex;
      const emptyIndexes = this.getEmptyIndexes(this.board);
      return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
    }
  }

  private findPossibleBestIndex(board: string[], player: string, opponent: string): number {
    const playerWinningIndex = this.getWinningIndex(board, player);
    if (playerWinningIndex != -1) return playerWinningIndex;

    const opponentWinningIndex = this.getWinningIndex(board, opponent);
    if (opponentWinningIndex != -1) return opponentWinningIndex;

    const possibleWinIndx = this.getPossibleWinIndx(player);
    if (possibleWinIndx != -1) return possibleWinIndx;

    const emptyIndexes = this.getEmptyIndexes(board);

    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]

  }

  private getPossibleWinIndx(player: string): number {
    for (let winArr of this.winCombos) {
      let count = 0;
      let index = -1;
      winArr.forEach(element => {
        if (this.board[element] === player) {
          count++;
        } else if (this.board[element] === '') {
          index = element;
        }
      });
      if (count === 1 && index != -1) {
        return index;
      }
    }
    return -1;
  }

  private getEmptyIndexes(board: string[]) {
    return board.reduce((a: number[], cell, index) =>
      (cell === '') ? a.concat(index) : a, []);
  }

  private getWinningIndex(board: string[], player: string): number {
    for (const [index, win] of this.winCombos.entries()) {
      let count = 0;
      let place = -1
      win.forEach((element, indx) => {
        if (this.board[element] === player) {
          count++;
        } else if (this.board[element] === '') {
          place = element;
        }
      });

      if (count === 2 && place !== -1) {
        return place;
      }
    }
    return -1;

  }

  private makeTheMove(x: number, player: string): void {
    this.board[x] = player;

    if (this.isGameWon(this.board, player)) {
      setTimeout(() => {
        alert(player + ' won the game');
        this.isGameFinished = true;
        return;
      });
    }

    if (this.isGameDraw()) {
      setTimeout(() => {
        alert('Game is a tie');
        this.isGameFinished = true;
        return;
      });
    }
  }

  private startGame(): void {
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.isGameFinished = false;
  }

  private isGameDraw(): boolean {
    for (let i = 0; i < 9; i++) {
      if (!this.board[i]) {
        return false;
      }
    }
    return true;
  }

  private isGameWon(board: string[], player: string): boolean {

    const plays: number[] = board.reduce((a: number[], cell, index) =>
      (cell === player) ? a.concat(index) : a, []);

    for (const [index, win] of this.winCombos.entries()) {
      if (win.every(el => plays.indexOf(el) > -1)) {
        return true;
      }
    }

    return false;
  }

}
