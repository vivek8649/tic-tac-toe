import { GameLevel } from '../enum/game-level.enum';
import { Player } from '../enum/player';

export interface GameInfo {
  level: GameLevel;
  isGameStarted: boolean;
}
