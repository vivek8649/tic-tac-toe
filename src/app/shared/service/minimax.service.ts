import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MiniMaxService {

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

  constructor() {
  }

  // This function returns true if there are moves
  // remaining on the board. It returns false if
  // there are no moves left to play.
  public isMovesLeft(board: string[]): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[i] === '')
        return true;
    }
    return false;
  }

  // This is the evaluation function as discussed
  // in the previous article ( http://goo.gl/sJgv68 )
  public evaluate(board: string[], player: string, opponent: string): number {
    const playsForPlayer: number[] = board.reduce((a: number[], cell, index) =>
      (cell === player) ? a.concat(index) : a, []);

    for (const [index, win] of this.winCombos.entries()) {
      if (win.every(el => playsForPlayer.indexOf(el) > -1)) {
        return +10;
      }
    }

    const playsForOpp: number[] = board.reduce((a: number[], cell, index) =>
      (cell === opponent) ? a.concat(index) : a, []);

    for (const [index, win] of this.winCombos.entries()) {
      if (win.every(el => playsForOpp.indexOf(el) > -1)) {
        return -10;
      }
    }

    return 0;
  }

  // This is the minimax function. It considers all
  // the possible ways the game can go and returns
  // the value of the board
  public minimax(board: string[], depth: number, isMax: boolean, player: string, opponent: string): number {
    let score = this.evaluate(board, player, opponent);

    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10)
      return score;

    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10)
      return score;

    // If there are no more moves and
    // no winner then it is a tie
    if (this.isMovesLeft(board) == false)
      return 0;

    // If this maximizer's move
    if (isMax) {
      let best = -1000;

      // Traverse all cells
      for (let i = 0; i < 9; i++) {
        // Check if cell is empty
        if (board[i] === '') {
          // Make the move
          board[i] = player;

          // Call minimax recursively and choose
          // the maximum value
          best = Math.max(best, this.minimax(board, depth + 1, !isMax, player, opponent));
          // Undo the move
          board[i] = '';
        }
      }
      return best;
    }

    // If this minimizer's move
    else {
      let best = 1000;

      // Traverse all cells
      for (let i = 0; i < 9; i++) {
        // Check if cell is empty
        if (board[i] === '') {
          // Make the move
          board[i] = opponent;

          // Call minimax recursively and choose
          // the minimum value
          best = Math.min(best, this.minimax(board, depth + 1, !isMax, player, opponent));

          // Undo the move
          board[i] = '';
        }
      }
      return best;
    }
  }

  // This will return the best possible
  // move for the player
  public findBestMove(board: string[], player: string, opponent: string): number {
    let bestVal = -1000;
    let bestMove = -1;

    // Traverse all cells, evaluate minimax function
    // for all empty cells. And return the cell
    // with optimal value.
    for (let i = 0; i < 9; i++) {
      // Check if cell is empty
      if (board[i] === '') {
        // Make the move
        board[i] = player;

        // compute evaluation function for this
        // move.
        let moveVal = this.minimax(board, 0, false, player, opponent);

        // Undo the move
        board[i] = '';

        // If the value of the current move is
        // more than the best value, then update
        // best/
        if (moveVal > bestVal) {
          bestMove = i
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  }

}
