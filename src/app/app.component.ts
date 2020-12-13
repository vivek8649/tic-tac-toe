import { Component, OnInit } from '@angular/core';
import { GameLevel } from './shared/enum/game-level.enum';
import { Player } from './shared/enum/player';
import { GameInfo } from './shared/model/game-info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public gameLevel = GameLevel;
  public player = Player;

  public gameInfo: GameInfo = { level: GameLevel.medium, isGameStarted: false };
  public title = 'tic-tac-toe';

  constructor() {
  }

  public setLevel(level: GameLevel): void {

    this.gameInfo.level = level;
    this.gameInfo = JSON.parse(JSON.stringify(this.gameInfo));
  }

  public ngOnInit(): void {

  }
}
