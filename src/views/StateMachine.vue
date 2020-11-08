<template>
  <div class="state-machine">
    <div>
      <el-button @click="initExampled4">Beispiel Dezimal durch 4 teilbar</el-button>
      <el-button @click="initExampleb3">Beispiel Binär durch 3 teilbar</el-button>
    </div>
    <hr>
        Zustände: <input v-model="states">
        Eingaben: <input v-model="keys">
        <el-button @click="initialize">Initialisieren</el-button>
        <div v-for="(tRow, tIndex) in stateValues" :key="tIndex" class="tRow">
            <template v-for="(tt, ttIndex) in tRow"  :key="ttIndex" >
            <div class="tField" :style="`background: ${tt === null ? 'white' : tt}`">
              <input class="tFieldInput" v-model="stateValues[tIndex][ttIndex]">
            </div>
          </template>
        </div>
        <div>
          Startzustand: <input v-model="startState">
          Endzustände: <input v-model="endState">
        </div>
        <div>
          Prüfe: <input v-model="test"> <el-button @click="testValue">Prüfe jetzt</el-button>
        </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'StateMachine',
  data () {
    return {
      stateValues: [] as number[][],
      states: 4,
      keys: 10,
      startState: '0',
      endState: '[0]',
      test: '10101'
    }
  },
  methods: {
    initialize () {
      const stateValues = [] as number[][]
      for (let i = 0; i < +this.states; i++) {
        const states = [] as number[]
        for (let j = 0; j < +this.keys; j++) {
          states.push(0)
        }
        stateValues.push(states)
      }
      this.stateValues = stateValues
    },
    initExampled4 () {
      this.startState = '4'
      this.endState = '[0,5]'
      this.stateValues = [
        [0, 1, 2, 3, 0, 1, 2, 3, 0, 1],
        [2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
        [0, 1, 2, 3, 0, 1, 2, 3, 0, 1],
        [2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
        [5, 1, 2, 3, 0, 1, 2, 3, 0, 1],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
      ]
    },
    initExampleb3 () {
      this.startState = '0'
      this.endState = '[0,4]'
      this.stateValues = [
        [3, 1],
        [2, 0],
        [4, 2],
        [1, 2],
        [5, 5],
        [5, 5]
      ]
    },
    testValue () {
      let currentState = +this.startState
      for (let i = 0; i < this.test.length; i++) {
        const num = +this.test.charAt(i)
        currentState = +this.stateValues[currentState][num]
      }
      const endStates = JSON.parse(this.endState) as string[]
      if (endStates.some(x => +x === currentState)) {
        const that = this as any
        that.$notify({
          title: 'Gültig',
          message: h('i', { style: 'color: teal' }, 'Der String erfüllt die Anforderungen.')
        })
      } else {
        const that = this as any
        that.$notify({
          title: 'Ungültig',
          message: h('i', { style: 'color: teal' }, 'Der String erfüllt die Anforderungen NICHT!')
        })
      }
    }
  }
})
</script>
<style lang="scss" scoped>
  .tRow {
    width: 100%;
    height:100%;
  }
  .tField {
    width: 30px;
    height:30px;
    margin: 5px;
    display: inline-block;
    border: 2px solid black
  }
  .tFieldInput {
      position: relative;
      width: 26px;
      height: 28px;
      display: inline-block;
      margin: auto;
      line-height: 30px;
      border: none;
      text-align: center;
    }
  .state-machine {
    margin: 0 auto;
    max-width: 1000px;
  }
</style>
