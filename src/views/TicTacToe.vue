<template>
  <el-row class="tic-tac-toe">
    <el-row>
      <el-col :span="24">
        <h1>Tic Tac Toe</h1>
      </el-col>
    </el-row>
     <el-row>
        <el-col :span="12">
          <div v-for="(tRow, tIndex) in tttMatrix" :key="tIndex" class="tRow">
            <div v-for="(tt, ttIndex) in tRow" :key="ttIndex" class="tField" :style="`background: ${tt === null ? 'white' : tt}`" @click="selectField(tIndex, ttIndex)">

            </div>
          </div>
        </el-col>
      <el-col :span="12">
        <h2 v-if="gameHasEnded && !isDraw">Herzlichen Glückwunsch {{color}}. Du hast gewonnen!</h2>
        <h2 v-if="gameHasEnded && isDraw">Leider Unentschieden!</h2>
        <el-button @click="startGame">Start</el-button>
        <el-button @click="useAi">KI Nutzen</el-button>
        <el-button @click="debugAi">KI Testen</el-button>
        <el-button @click="generateData">Daten generieren</el-button>
      </el-col>
    </el-row>
  </el-row>
</template>
<style lang="scss" scoped>
  .tRow {
    width: 100%;
    height:100%;
  }
  .tField {
    width: 100px;
    height:100px;
    margin: 10px;
    display: inline-block;
    border: 2px solid black
  }
  .tic-tac-toe {
    margin: 0 auto;
    max-width: 1000px;
  }
</style>

<script lang="ts">

import { defineComponent } from 'vue'
import * as tf from '@tensorflow/tfjs'
// import * as tfvis from '@tensorflow/tfjs-vis'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tfvis = require('@tensorflow/tfjs-vis')

const emptyGame = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]
export default defineComponent({
  name: 'TicTacToe',
  data () {
    const tttMatrix = JSON.parse(JSON.stringify(emptyGame)) as Array<Array<string>>
    return {
      tttMatrix,
      color: 'blue',
      isDraw: false,
      gameHasEnded: false,
      model: null as any
    }
  },
  methods: {
    startGame () {
      this.color = 'blue'
      this.gameHasEnded = false
      this.isDraw = false
      this.tttMatrix = JSON.parse(JSON.stringify(emptyGame))
    },
    selectField (tIndex: number, ttIndex: number) {
      if (this.tttMatrix[tIndex][ttIndex] !== null || this.gameHasEnded) return
      this.tttMatrix[tIndex][ttIndex] = this.color
      this.checkWinner()
    },
    checkWinner () {
      for (let i = 0; i < 3; i++) {
        if (this.tttMatrix[0][i] === this.tttMatrix[1][i] && this.tttMatrix[1][i] === this.tttMatrix[2][i] && this.tttMatrix[2][i] === this.color) this.gameHasEnded = true
        if (this.tttMatrix[i][0] === this.tttMatrix[i][1] && this.tttMatrix[i][1] === this.tttMatrix[i][2] && this.tttMatrix[i][2] === this.color) this.gameHasEnded = true
      }
      if (this.tttMatrix[0][0] === this.tttMatrix[1][1] && this.tttMatrix[1][1] === this.tttMatrix[2][2] && this.tttMatrix[2][2] === this.color) this.gameHasEnded = true
      if (this.tttMatrix[2][0] === this.tttMatrix[1][1] && this.tttMatrix[1][1] === this.tttMatrix[0][2] && this.tttMatrix[0][2] === this.color) this.gameHasEnded = true
      if (!this.gameHasEnded && !this.tttMatrix.some(ttRow => ttRow.some(t => t === null))) {
        this.gameHasEnded = true
        this.isDraw = true
      }
      if (!this.gameHasEnded) this.color = this.color === 'blue' ? 'red' : 'blue'
    },
    generateData () {
      const result = [] as Array<{destination: number; tttMatrix: Array<Array<string>>}>
      for (let i = 0; i < 100; i++) {
        this.startGame()
        const state = [] as Array<{destination: number; tttMatrix: Array<Array<string>>}>
        let color = 'blue'
        while (true) {
          const destination = Math.floor(Math.random() * 9)
          if (this.gameHasEnded) {
            state.push({ tttMatrix: JSON.parse(JSON.stringify(this.tttMatrix)), destination })
            break
          }
          this.selectField(destination % 3, Math.floor(destination / 3))
          if (this.color !== color) {
            state.push({ tttMatrix: JSON.parse(JSON.stringify(this.tttMatrix)), destination })
            color = this.color
          }
        }
        if (!this.isDraw) {
          if (this.color === 'blue') state.filter((s, sIndex) => sIndex % 2 === 0).forEach(r => result.push(r))
          else state.filter((s, sIndex) => sIndex % 2 === 1).forEach(r => result.push(r))
        }
      }
      console.log(result)
      this.model = tf.sequential()
      // Add a single input layer
      this.model.add(tf.layers.dense({ inputShape: [9], units: 1, useBias: true }))

      // Add an output layer
      this.model.add(tf.layers.dense({ units: 1, useBias: true }))

      this.model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse']
      })

      const convertedTensors = this.convertToTensor(result)
      console.log(convertedTensors.inputs, convertedTensors.labels)
      this.model.fit(convertedTensors.inputs, convertedTensors.labels, {
        batchSize: 32,
        epochs: 50,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
          { name: 'Training Performance' },
          ['loss', 'mse'],
          { height: 200, callbacks: ['onEpochEnd'] }
        )
      }).then(() => (window.alert('done')))
    },
    convertToTensor (data: Array<{destination: number; tttMatrix: Array<Array<string>>}>) {
      // Wrapping these calculations in a tidy will dispose any
      // intermediate tensors.

      return tf.tidy(() => {
        // Step 1. Shuffle the data
        tf.util.shuffle(data)

        const getValue = (v: string) => v === null ? 0 : v === 'blue' ? 1 : 2
        // Step 2. Convert data to Tensor
        const inputs = data.map(d => [
          getValue(d.tttMatrix[0][0]), getValue(d.tttMatrix[0][1]), getValue(d.tttMatrix[0][2]),
          getValue(d.tttMatrix[1][0]), getValue(d.tttMatrix[1][1]), getValue(d.tttMatrix[1][2]),
          getValue(d.tttMatrix[2][0]), getValue(d.tttMatrix[2][1]), getValue(d.tttMatrix[2][2])
        ])
        const labels = data.map(d => d.destination)

        this.downloadJson(inputs, 'inputs.json')
        this.downloadJson(labels, 'labels.json')

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 9])
        const labelTensor = tf.tensor2d(labels, [labels.length, 1])

        console.log('test', inputTensor.print(), inputs)

        // Step 3. Normalize the data to the range 0 - 1 using min-max scaling
        const inputMax = inputTensor.max()
        const inputMin = inputTensor.min()
        const labelMax = labelTensor.max()
        const labelMin = labelTensor.min()

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))

        return {
          inputs: normalizedInputs,
          labels: normalizedLabels,
          // Return the min/max bounds so we can use them later.
          inputMax,
          inputMin,
          labelMax,
          labelMin
        }
      })
    },
    downloadJson (exportObj: any, exportName: string) {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', exportName + '.json')
      document.body.appendChild(downloadAnchorNode) // required for firefox
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    },
    useAi () {
      // Define a model for linear regression.
      const model = tf.sequential()
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }))

      model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

      // Generate some synthetic data for training.
      const xs = tf.tensor2d([1, 2, 3, 4], [4, 1])
      const ys = tf.tensor2d([1, 3, 5, 7], [4, 1])

      // Train the model using the data.
      model.fit(xs, ys, { epochs: 10 }).then(() => {
        // Use the model to do inference on a data point the model hasn't seen before:
        console.log(model.predict(tf.tensor2d([5], [1, 1])))
        // Open the browser devtools to see the output
      })
    },
    debugAi: async () => {
      async function getData () {
        const carsDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
        const carsData = await carsDataResponse.json() as Array<{Miles_per_Gallon: string; Horsepower: string}>
        const cleaned = carsData.map(car => ({
          mpg: car.Miles_per_Gallon,
          horsepower: car.Horsepower
        }))
          .filter(car => (car.mpg != null && car.horsepower != null))

        return cleaned
      }
      const data = await getData()
      const values = data.map(d => ({
        x: d.horsepower,
        y: d.mpg
      }))
      tfvis.render.scatterplot(
        { name: 'Horsepower v MPG' },
        { values },
        {
          xLabel: 'Horsepower',
          yLabel: 'MPG',
          height: 300
        }
      )

      function createModel () {
        // Create a sequential model
        const model = tf.sequential()

        // Add a single input layer
        model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }))

        // Add an output layer
        model.add(tf.layers.dense({ units: 1, useBias: true }))

        return model
      }

      function convertToTensor (data: Array<{mpg: string; horsepower: string}>) {
        // Wrapping these calculations in a tidy will dispose any
        // intermediate tensors.

        return tf.tidy(() => {
          // Step 1. Shuffle the data
          tf.util.shuffle(data)

          // Step 2. Convert data to Tensor
          const inputs = data.map(d => d.horsepower)
          const labels = data.map(d => d.mpg)

          const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
          const labelTensor = tf.tensor2d(labels, [labels.length, 1])

          // Step 3. Normalize the data to the range 0 - 1 using min-max scaling
          const inputMax = inputTensor.max()
          const inputMin = inputTensor.min()
          const labelMax = labelTensor.max()
          const labelMin = labelTensor.min()

          const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
          const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))

          return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            // Return the min/max bounds so we can use them later.
            inputMax,
            inputMin,
            labelMax,
            labelMin
          }
        })
      }

      async function trainModel (model: any, inputs: any, labels: any) {
        // Prepare the model for training.
        model.compile({
          optimizer: tf.train.adam(),
          loss: tf.losses.meanSquaredError,
          metrics: ['mse']
        })

        const batchSize = 32
        const epochs = 50

        return await model.fit(inputs, labels, {
          batchSize,
          epochs,
          shuffle: true,
          callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'mse'],
            { height: 200, callbacks: ['onEpochEnd'] }
          )
        })
      }

      // Convert the data to a form we can use for training.
      const tensorData = convertToTensor(data)
      const { inputs, labels } = tensorData

      const model = createModel()
      // Train the model
      await trainModel(model, inputs, labels)
      console.log('Done Training')

      function testModel (model: any, inputData: Array<{mpg: string; horsepower: string}>, normalizationData: any) {
        const { inputMax, inputMin, labelMin, labelMax } = normalizationData

        // Generate predictions for a uniform range of numbers between 0 and 1;
        // We un-normalize the data by doing the inverse of the min-max scaling
        // that we did earlier.
        const [xs, preds] = tf.tidy(() => {
          const xs = tf.linspace(0, 1, 100)
          const preds = model.predict(xs.reshape([100, 1]))

          const unNormXs = xs
            .mul(inputMax.sub(inputMin))
            .add(inputMin)

          const unNormPreds = preds
            .mul(labelMax.sub(labelMin))
            .add(labelMin)

          // Un-normalize the data
          return [unNormXs.dataSync(), unNormPreds.dataSync()]
        })

        const predictedPoints = Array.from(xs).map((val, i) => {
          return { x: val, y: preds[i] }
        })

        const originalPoints = inputData.map(d => ({
          x: d.horsepower, y: d.mpg
        }))

        tfvis.render.scatterplot(
          { name: 'Model Predictions vs Original Data' },
          { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
          {
            xLabel: 'Horsepower',
            yLabel: 'MPG',
            height: 300
          }
        )
      }
      testModel(model, data, tensorData)
    }
  },
  components: {
  }
})
</script>
