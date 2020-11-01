<template>
  <el-row class="sudoku">
    <el-row>
      <el-col :span="24">
        <h1>Sudoku</h1>
      </el-col>
    </el-row>
     <el-row style="min-width: 1200px; max-width: 1200px;">
        <el-col :span="16">
          <div v-for="(tRow, tIndex) in sudoku" :key="tIndex" class="tRow">
            <div class="tBorder"></div>
            <template v-for="(tt, ttIndex) in tRow"  :key="ttIndex" >
            <div class="tField" :style="`background: ${tt === null ? 'white' : tt}`">
              <input :style="sudokuValues[tIndex][ttIndex] === 'true' ? 'background: yellow;' : ''" class="tFieldInput" v-model="sudoku[tIndex][ttIndex]">
            </div>
            <div class="tBorder" v-if="ttIndex %3 === 2 && tIndex === 0"></div>
          </template>
          <div class="tBorder-horizontal" v-if="tIndex %3 === 0"></div>
          </div>
         <div class="tBorder-horizontal"></div>
        </el-col>
      <el-col :span="8" style="text-align: left">
        <el-button @click="startGame">Start</el-button>
        <el-button @click="insertNumberIfUniquePlace">Einzigartige einsetzen</el-button>
        <el-button @click="evaluateAllFields">Zahlen eliminieren</el-button>
        <el-button @click="solve">Solve</el-button>
        <el-button @click="startBacktracking">Backtrack</el-button>
        <el-button @click="clearGame">Clear</el-button>
        <el-button @click="clearWhite">Clear White</el-button>
        <el-button @click="loadExample">Load Example</el-button>
        <el-button @click="loadExample2">Load Example2</el-button>
        <el-button @click="loadExample3">Load Hardest Example</el-button>
        <el-button @click="exportArray">Export</el-button>
        <el-button @click="exportXml">Export Xml</el-button>
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
const isSingleNumber = (num: any) => !isNaN(num) && num > 0
const emptyGame = [
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null]
]
const game1 = [
  [6, null, null, null, 5, 7, 1, null, null],
  [null, null, null, null, null, 3, null, null, 5],
  [null, 1, null, 9, null, null, 2, null, null],
  [null, null, null, null, null, null, 7, null, null],
  [2, 8, 1, null, 4, null, 6, null, null],
  [null, 3, null, null, null, null, null, null, 2],
  [null, null, null, null, null, null, null, 1, 4],
  [null, 5, 8, null, null, null, null, null, 7],
  [null, null, 7, null, 6, null, 8, null, null]
]
const game2 = [
  [null, 6, null, null, 1, null, 8, 7, null],
  [null, 9, null, null, 8, null, 6, null, null],
  [null, null, null, 6, 2, null, null, null, null],
  [null, null, null, 9, 6, null, null, null, null],
  [null, null, 5, null, null, null, null, null, 2],
  [null, 7, 9, null, null, null, null, null, 5],
  [null, null, null, null, null, 4, null, null, null],
  [2, null, null, null, null, null, null, 8, null],
  [8, null, null, null, null, null, null, 5, 1]
]
const hardestGame = [[null, null, 5, 3, null, null, null, null, null], [8, null, null, null, null, null, null, 2, null], [null, 7, null, null, 1, null, 5, null, null], [4, null, null, null, null, 5, 3, null, null], [null, 1, null, null, 7, null, null, null, 6], [null, null, 3, 2, null, null, null, 8, null], [null, 6, null, 5, null, null, null, null, 9], [null, null, 4, null, null, null, null, 3, null], [null, null, null, null, null, 9, 7, null, null]]
export default defineComponent({
  name: 'Sudoku',
  data () {
    // const sudoku = JSON.parse(JSON.stringify(emptyGame)) as Array<Array<string>>
    const sudoku = JSON.parse(JSON.stringify(game1)) as Array<Array<any>>
    const sudokuValues = JSON.parse(JSON.stringify(emptyGame)) as Array<Array<string>>
    return {
      sudoku,
      sudokuValues,
      isDraw: false,
      gameStarted: false,
      model: null as any
    }
  },
  methods: {
    clearGame () {
      this.gameStarted = false
      this.sudoku = JSON.parse(JSON.stringify(emptyGame))
      this.sudokuValues = JSON.parse(JSON.stringify(emptyGame)) as Array<Array<string>>
    },
    startBacktracking () {
      this.startGame()
      const emptyCell = this.hasEmptyCell()
      console.time('backtrack')
      if (emptyCell === false) return true
      else this.backtrack(emptyCell.i, emptyCell.j)
      console.timeEnd('backtrack')
    },
    hasEmptyCell () {
      for (let i = 0; i < this.sudoku.length; i++) {
        for (let j = 0; j < this.sudoku[i].length; j++) {
          const num = +this.sudoku[i][j]
          if (!isSingleNumber(num)) return { i, j }
        }
      }
      return false
    },
    rowContainsValue (row: number, x: number) {
      for (let i = 0; i < this.sudoku.length; i++) {
        if (+this.sudoku[row][i] === x) return true
      }
    },
    columnContainsValue (column: number, x: number) {
      for (let i = 0; i < this.sudoku.length; i++) {
        if (+this.sudoku[i][column] === x) return true
      }
    },
    boxContainsValue (row: number, column: number, x: number) {
      const cornerI = row - row % 3
      const cornerJ = column - column % 3

      for (let ci = cornerI; ci < cornerI + 3; ci++) {
        for (let cj = cornerJ; cj < cornerJ + 3; cj++) {
          if (+this.sudoku[ci][cj] === x) return true
        }
      }
    },
    backtrack (i: number, j: number) {
      for (let z = 1; z <= this.sudoku.length; z++) {
        let isValid = true
        if (this.rowContainsValue(i, z)) isValid = false
        if (isValid && this.columnContainsValue(j, z)) isValid = false
        if (isValid && this.boxContainsValue(i, j, z)) isValid = false
        if (!isValid) continue
        this.sudoku[i][j] = z
        const emptyCell = this.hasEmptyCell()
        if (emptyCell === false) return true
        else if (this.backtrack(emptyCell.i, emptyCell.j)) return true
      }
      this.sudoku[i][j] = null
      return false
    },
    clearWhite () {
      this.gameStarted = false
      for (let i = 0; i < this.sudoku.length; i++) {
        for (let j = 0; j < this.sudoku[i].length; j++) {
          if (!this.sudokuValues[i][j]) {
            this.sudoku[i][j] = null
          }
        }
      }
      this.sudokuValues = JSON.parse(JSON.stringify(emptyGame)) as Array<Array<string>>
    },
    download (filename: string, text: string) {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
    exportArray () {
      const eArray = []as Array<Array<number|null>>
      for (let i = 0; i < this.sudoku.length; i++) {
        eArray.push([])
        for (let j = 0; j < this.sudoku[i].length; j++) {
          const num = +this.sudoku[i][j]
          if (isSingleNumber(num)) {
            eArray[i].push(num)
          } else {
            eArray[i].push(null)
          }
        }
      }
      this.download('sudoku.txt', JSON.stringify(eArray))
    },
    exportXml () {
      let exportText = `<data>
        <cells>
        `
      for (let i = 0; i < this.sudoku.length; i++) {
        for (let j = 0; j < this.sudoku[i].length; j++) {
          const num = +this.sudoku[i][j]
          if (isSingleNumber(num)) {
            exportText += `<cell row="${i + 1}" column="${j + 1}" value="${num}" />
            `
          }
        }
      }
      exportText += `</cells>
</data>`
      this.download('sudoku.xml', exportText)
    },
    loadExample () {
      this.gameStarted = false
      this.sudoku = JSON.parse(JSON.stringify(game1))
      this.sudokuValues = JSON.parse(JSON.stringify(emptyGame)) as Array<Array<string>>
    },
    loadExample2 () {
      this.gameStarted = false
      this.sudoku = JSON.parse(JSON.stringify(game2))
      this.sudokuValues = JSON.parse(JSON.stringify(emptyGame)) as Array<Array<string>>
    },
    loadExample3 () {
      this.gameStarted = false
      this.sudoku = JSON.parse(JSON.stringify(hardestGame))
      this.sudokuValues = JSON.parse(JSON.stringify(emptyGame)) as Array<Array<string>>
    },
    startGame () {
      for (let i = 0; i < this.sudoku.length; i++) {
        for (let j = 0; j < this.sudoku[i].length; j++) {
          const num = +this.sudoku[i][j]
          if (isSingleNumber(num)) {
            if (!this.gameStarted) {
              this.sudokuValues[i][j] = 'true'
            }
            this.sudoku[i][j] = num
          } else this.sudoku[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
      }
      this.gameStarted = true
    },
    solve () {
      console.time('solve')
      let i = 0
      let sudoku = ''
      while (i < 1000 && sudoku !== JSON.stringify(this.sudoku)) {
        i++
        sudoku = JSON.stringify(this.sudoku)
        this.evaluateAllFields()
        this.insertNumberIfUniquePlace()
        this.checkNakedTwins()
      }
      console.timeEnd('solve')
    },
    evaluateAllFields () {
      for (let i = 0; i < this.sudoku.length; i++) {
        for (let j = 0; j < this.sudoku[i].length; j++) {
          const num = +this.sudoku[i][j]
          const eliminateDuplicatedNumbers = (field: Array<number>, l: number, m: number) => {
            const indexOfNumber = field.findIndex(e => e === num)
            if (indexOfNumber > -1) {
              field.splice(indexOfNumber, 1)
              if (field.length === 1) {
                this.sudoku[l][m] = field[0]
              }
            }
          }
          if (isSingleNumber(num)) {
            for (let k = 0; k < this.sudoku.length; k++) {
              const num2 = +this.sudoku[k][j]
              if (!isSingleNumber(num2)) {
                const field = this.sudoku[k][j] as Array<number>
                eliminateDuplicatedNumbers(field, k, j)
              }
            }
            for (let l = 0; l < this.sudoku[j].length; l++) {
              const num2 = +this.sudoku[i][l]
              if (!isSingleNumber(num2)) {
                const field = this.sudoku[i][l] as Array<number>
                eliminateDuplicatedNumbers(field, i, l)
              }
            }
            const cornerI = i - i % 3
            const cornerJ = j - j % 3

            for (let ci = cornerI; ci < cornerI + 3; ci++) {
              for (let cj = cornerJ; cj < cornerJ + 3; cj++) {
                const num2 = +this.sudoku[ci][cj]
                if (!isSingleNumber(num2)) {
                  const field = this.sudoku[ci][cj] as Array<number>
                  eliminateDuplicatedNumbers(field, ci, cj)
                }
              }
            }
          }
        }
      }
    },
    insertNumberIfUniquePlace () {
      for (let num = 1; num < 10; num++) {
        // vertical
        for (let i = 0; i < this.sudoku.length; i++) {
          let possibilities = 0
          let location = 0
          for (let j = 0; j < this.sudoku[i].length; j++) {
            const num2 = +this.sudoku[i][j]
            if (num2 === num) {
              possibilities = 10
              break
            } else if (!isSingleNumber(num2)) {
              const field = this.sudoku[i][j] as Array<number>
              if (field.includes(num)) {
                location = j
                possibilities++
              }
            }
          }
          if (possibilities === 1) {
            this.sudoku[i][location] = num
          }
        }
        // horizontal
        for (let j = 0; j < this.sudoku.length; j++) {
          let possibilities = 0
          let location = 0
          for (let i = 0; i < this.sudoku[j].length; i++) {
            const num2 = +this.sudoku[i][j]
            if (num2 === num) {
              possibilities = 10
              break
            } else if (!isSingleNumber(num2)) {
              const field = this.sudoku[i][j] as Array<number>
              if (field.includes(num)) {
                location = i
                possibilities++
              }
            }
          }
          if (possibilities === 1) {
            this.sudoku[location][j] = num
          }
        }
        // corners
        for (let cornerI = 0; cornerI < 8; cornerI += 3) {
          for (let cornerJ = 0; cornerJ < 8; cornerJ += 3) {
            let possibilities = 0
            let locationi = 0
            let locationj = 0
            for (let ci = cornerI; ci < cornerI + 3; ci++) {
              for (let cj = cornerJ; cj < cornerJ + 3; cj++) {
                const num2 = +this.sudoku[ci][cj]
                if (num2 === num) {
                  possibilities = 10
                  break
                } else if (!isSingleNumber(num2)) {
                  const field = this.sudoku[ci][cj] as Array<number>
                  if (field.includes(num)) {
                    locationi = ci
                    locationj = cj
                    possibilities++
                  }
                }
              }
            }
            if (possibilities === 1) {
              this.sudoku[locationi][locationj] = num
            }
          }
        }
      }
    },
    checkNakedTwins () {
      // fetch all twins, triples and quadruples
      const setOfEverything = new Set()
      for (let i = 0; i < this.sudoku.length; i++) {
        for (let j = 0; j < this.sudoku[i].length; j++) {
          const num = +this.sudoku[i][j]
          if (!isSingleNumber(num)) {
            setOfEverything.add(JSON.stringify(this.sudokuValues[i][j]))
          }
        }
      }
      console.log(setOfEverything)

      for (let num = 1; num < 10; num++) {
        // vertical
        for (let i = 0; i < this.sudoku.length; i++) {
          let possibilities = 0
          let location = 0
          for (let j = 0; j < this.sudoku[i].length; j++) {
            const num2 = +this.sudoku[i][j]
            if (num2 === num) {
              possibilities = 10
              break
            } else if (!isSingleNumber(num2)) {
              const field = this.sudoku[i][j] as Array<number>
              if (field.includes(num)) {
                location = j
                possibilities++
              }
            }
          }
          if (possibilities === 1) {
            this.sudoku[i][location] = num
          }
        }
        // horizontal
        for (let j = 0; j < this.sudoku.length; j++) {
          let possibilities = 0
          let location = 0
          for (let i = 0; i < this.sudoku[j].length; i++) {
            const num2 = +this.sudoku[i][j]
            if (num2 === num) {
              possibilities = 10
              break
            } else if (!isSingleNumber(num2)) {
              const field = this.sudoku[i][j] as Array<number>
              if (field.includes(num)) {
                location = i
                possibilities++
              }
            }
          }
          if (possibilities === 1) {
            this.sudoku[location][j] = num
          }
        }
        // corners
        for (let cornerI = 0; cornerI < 8; cornerI += 3) {
          for (let cornerJ = 0; cornerJ < 8; cornerJ += 3) {
            let possibilities = 0
            let locationi = 0
            let locationj = 0
            for (let ci = cornerI; ci < cornerI + 3; ci++) {
              for (let cj = cornerJ; cj < cornerJ + 3; cj++) {
                const num2 = +this.sudoku[ci][cj]
                if (num2 === num) {
                  possibilities = 10
                  break
                } else if (!isSingleNumber(num2)) {
                  const field = this.sudoku[ci][cj] as Array<number>
                  if (field.includes(num)) {
                    locationi = ci
                    locationj = cj
                    possibilities++
                  }
                }
              }
            }
            if (possibilities === 1) {
              this.sudoku[locationi][locationj] = num
            }
          }
        }
      }
    }
  },
  components: {
  }
})
</script>
<style lang="scss" scoped>
  .tRow {
    width: 100%;
    height:100%;
  }
  .tField {
    width: 50px;
    height:50px;
    margin: 5px;
    display: inline-block;
    border: 2px solid black
  }
  .tBorder {
    display: inline-block;
    width: 2px;
    margin-left: -1px;
    top: 0;
    bottom: 0;
    position: absolute;
    background: black,
  }
  .tBorder-horizontal {
    display: inline-block;
    height: 2px;
    margin-top: -1px;
    left: 111px;
    right: 111px;
    position: absolute;
    background: black,
  }
  .tFieldInput {
      position: relative;
      width: 46px;
      height: 48px;
      display: inline-block;
      margin: auto;
      line-height: 50px;
      border: none;
      text-align: center;
    }
  .tic-tac-toe {
    margin: 0 auto;
    max-width: 1000px;
  }
</style>
