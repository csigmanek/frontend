<template>
  <el-container direction="vertical">
    <el-main>
      <h1>Isola</h1>
      <p>
        Gewinnen Sie, indem Sie den Gegenspieler bewegungsunfähig machen!
        Es wird abwechselnd gezogen. Klicken Sie dazu auf ein benachbartes Feld Ihres Königs, um ihn zu bewegen.
        Anschließend klicken Sie auf ein beliebiges freies Feld, um es für den Rest des Spiels zu sperren.
      </p>
      <el-checkbox class="isola__checkbox" v-model="AI1">KI für Gelb</el-checkbox>
      <el-select v-model="difficulty1" :clearable="false" placeholder="Select">
        <el-option
          v-for="item in difficultyOptions"
          :key="item.value + 'd1'"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <br>
      <el-checkbox class="isola__checkbox" v-model="AI2">KI für Grün</el-checkbox>
      <el-select v-model="difficulty2" :clearable="false" placeholder="Select">
        <el-option
          v-for="item in difficultyOptions"
          :key="item.value + 'd2'"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <br>
      <el-checkbox class="isola__checkbox" v-model="isolaSmall">kleineres Feld</el-checkbox>
      <el-button class="isola__button" @click="newGame">Neues Spiel starten</el-button>
      <p>
        {{getStatus}}
        <br>
        Ergebnisse: Grün: {{totalGreen}} Gelb: {{totalYellow}}
      </p>
      <div class="isola" :class="{'isola--small' : isolaSmall}" :refresh="refresh">
        <template v-for="(item, fieldX) in game">
          <div
            v-for="(value, fieldY) in item"
            :key="`x-${fieldX}y-${fieldY}`"
            class="isola__field"
            :class="fieldY % 2 === 1
              ? fieldX % 2 === 0 ? 'isola__field--alt' : ''
              : fieldX % 2 === 1 ? 'isola__field--alt' : ''"
            :style="`width: ${100 / gridX}%; height: ${100 / gridY}%;`"
            @click="makeMove({x: fieldY, y: fieldX})"
          >
          <div :class="getIsolaClass(value)">{{fieldX}}{{fieldY}}</div>
          </div>
        </template>
      </div>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
enum State {
  empty,
  blocked,
  p1,
  p2,
}
interface Coordinates {
  x: number;
  y: number;
}
@Component({
  components: {
  },
})
export default class IsolaAi extends Vue {
  private gridX: number = 8;
  private gridY: number = 6;
  private game: State[][] = [];
  private playerActive: State.p1 | State.p2 = State.p1;
  private hasMoved: boolean = false;
  private AI1: boolean = false;
  private AI2: boolean = true;
  private refresh: boolean = true;
  private isolaSmall: boolean = false;
  private totalGreen: number = 0;
  private totalYellow: number = 0;
  private difficulty1: number = 0;
  private difficulty2: number = 0;
  private winner: null | State.p1 | State.p2 = null;
  private difficultyOptions: {
    label: string;
    value: number;
  }[] = [
    {
      label: 'Einfach',
      value: 0,
    },
    {
      label: 'Normal',
      value: 1,
    },
    {
      label: 'Schwer',
      value: 2,
    },
  ];
  private mounted() {
    this.game = this.createGame();
  }
  get getStatus(): string {
    return this.winner
      ? `Spieler ${this.winner === State.p1 ? 'Gelb' : 'Grün'} hat gewonnen.`
      : `Spieler ${this.playerActive === State.p1 ? 'Gelb' : 'Grün'} ist am Zug.`;
  }
  private createGame(): State[][] {
    const game = [];
    for (let y = 0; y < this.gridY; y++) {
      const help = [];
      for (let x = 0; x < this.gridX; x++) {
        help.push(State.empty);
      }
      game.push(help);
    }
    game[Math.min(this.gridY - 1, 2)][0] = State.p1;
    game[Math.max(this.gridY - 3, 0)][game[Math.max(this.gridY - 3, 0)].length - 1] = State.p2;
    return game;
  }
  private newGame() {
    this.game = this.createGame();
    this.winner = null;
    this.playerActive = State.p1;
    this.hasMoved = false;
    this.checkAI();
    this.refresh = !this.refresh;
  }
  private get playerInactive(): State.p1 | State.p2 {
    return this.playerActive === State.p1 ? State.p2 : State.p1;
  }
  private checkAI() {
    if ((this.playerActive === State.p1 && !this.AI1) ||
      (this.playerActive === State.p2 && !this.AI2)) {
      return;
    }
    const playerCoords = this.findPlayer(this.playerActive);
    const actions = this.getActions(playerCoords, this.game);
    let moves = 0;
    let willMove: Coordinates[] = [];
    for (const action of actions) {
      const game = JSON.parse(JSON.stringify(this.game));
      game[playerCoords.y][playerCoords.x] = State.empty;
      game[action.y][action.x] = this.playerActive;
      const secondActions = this.getActions({ y: action.y, x: action.x}, game);
      let modifier: number = 0;
      if (this[this.playerActive === State.p1 ? 'difficulty1' : 'difficulty2'] > 0) {
        const opponentCoords = this.findPlayer(this.playerInactive);
        const isNextToPlayer = Math.abs(action.y - opponentCoords.y) <= 1 && Math.abs(action.x - opponentCoords.x) <= 1;
        modifier += 2;
        if (this.getActions(action, game).length < 3) {
          modifier -= 1;
        }
      }
      if (secondActions.length + modifier > moves) {
        moves = secondActions.length;
        willMove = [action];
      } else if (secondActions.length === moves) {
        willMove.push(action);
      }
    }
    const move = Math.floor(Math.random() * willMove.length);
    this.makeMove(willMove[move]);
    // now block
    let unblocked = 9;
    let block: Coordinates[] = [];
    for (let y = 0; y < this.game.length; y++) {
      for (let x = 0; x < this.game[y].length; x++) {
        if (this.game[y][x] === State.empty) {
          const game = JSON.parse(JSON.stringify(this.game));
          game[y][x] = State.blocked;
          const secondActions = this.getActions(this.findPlayer(this.playerInactive), game);
          let modifier = 0;
          if (this[this.playerActive === State.p1 ? 'difficulty1' : 'difficulty2'] > 0) {
            let isUseful = true;
            for (const action of secondActions) {
              if (this.getActions(action, game).length > 3 &&
                Math.abs(action.y - playerCoords.y) <= 1 &&
                Math.abs(action.x - playerCoords.x) <= 1) {
                isUseful = false;
              }
            }
            if (isUseful) {
              modifier -= 1;
            }
          }
          if (secondActions.length + modifier < unblocked) {
            unblocked = secondActions.length;
            block = [{x, y}];
          } else if (secondActions.length === unblocked) {
            block.push({x, y});
          }
        }
      }
    }
    this.makeMove(block[Math.floor(Math.random() * block.length)]);
  }
  private makeMove(coords: Coordinates) {
    if (this.hasMoved) {
      if (this.game[coords.y][coords.x] === State.empty) {
        this.game[coords.y][coords.x] = State.blocked;
        this.playerActive = this.playerInactive;
        this.hasMoved = false;
        if (this.getActions(this.findPlayer(this.playerActive), this.game).length === 0) {
          this.winner = this.playerInactive;
          if (this.playerInactive === State.p1) {
            this.totalYellow++;
          } else {
            this.totalGreen++;
          }
        } else if (this.AI1 && this.AI2) {
          setTimeout(() => {
            this.checkAI();
          }, 40);
        } else {
          this.checkAI();
        }
      }
    } else {
      const playerCoords = this.findPlayer(this.playerActive);
      for (const action of this.getActions(playerCoords, this.game)) {
        if (action.x === coords.x && action.y === coords.y) {
          this.game[playerCoords.y][playerCoords.x] = State.empty;
          this.game[coords.y][coords.x] = this.playerActive;
          this.hasMoved = true;
        }
      }
    }
    this.refresh = !this.refresh;
  }
  private getIsolaClass(state: State): string {
    switch (state) {
      case State.blocked:
      return 'isola__chip isola__chip--blocked';
      case State.p1:
      return 'isola__chip';
      case State.p2:
      return 'isola__chip isola__chip--alt';
      case State.empty:
      return '';
    }
  }
  private findPlayer(player: State.p1 | State.p2): Coordinates {
    for (let y = 0; y < this.game.length; y++) {
      for (let x = 0; x < this.game[y].length; x++) {
        if (this.game[y][x] === player) {
          return {y, x};
        }
      }
    }
    return {x: -1, y: -1};
  }
  private getActions(coords: Coordinates, game: State[][]): Coordinates[] {
    const result: Coordinates[] = [];
    const checkX = (y: number) => {
      if (game[y][coords.x - 1] === State.empty) {
        result.push({x: coords.x - 1, y});
      }
      if (game[y][coords.x] === State.empty) {
        result.push({x: coords.x, y});
      }
      if (game[y][coords.x + 1] === State.empty) {
        result.push({x: coords.x + 1, y});
      }
    };
    if (coords.y > 0) {
      checkX(coords.y - 1);
    }
    if (coords.y < game.length - 1) {
      checkX(coords.y + 1);
    }
    checkX(coords.y);
    return result;
  }

}
</script>
<style lang="scss">
  .isola {
    width: 800px;
    height: 600px;
  }
  .isola--small {
    transform: scale(0.5) translate(-50%, -50%);
  }
  .isola__field {
    display: inline-block;
    // kill space at bottom
    vertical-align:middle;
    background-color: #60273a;
  }
  .isola__field--alt {
    background-color: #d7c6e6;
  }
  .isola__chip {
    width: 80%;
    height: 80%;
    margin: 10%;
    border-radius: 100%;
    background: #e6a23c;
  }
  .isola__chip--alt {
    background: #67c23a;
  }
  .isola__chip--blocked {
    background: #3b363f;
    border-radius: 0;
  }
  .isola__checkbox {
    width: 200px;
    margin-right: 30px;
    margin-bottom: 10px;
    border: 1px solid rgb(220, 223, 230);
    padding: 9px;
    border-radius: 4px;
  }
  .isola__button {
    width: 205px;
  }
</style>