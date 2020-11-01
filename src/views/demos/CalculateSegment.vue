<template>
  <el-container direction="vertical">
    <el-main>
      <h1>Segmente</h1>
      <p>Berechnet die Mindesttourdauer, wenn eine Strecke aus den gegebenen geordneten Segmenten in n > 1 Tagen zurückgelegt werden soll.</p>
      <input v-model="segments">
      <h2>Anzahl der Tagestouren</h2>
      <input v-model="days" type="number">
      <el-button primary @click="calculate">Berechnen</el-button>
      <p v-html="result"></p>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class CalculateSegment extends Vue {
  private segments: string = '11,16,5,5,12,10';
  private days: number = 5;
  private result: string = '';
  private calculate(): void {
    const segments = this.segments.split(',');
    if (segments.length === 0 || segments.some((a) => isNaN(+a))) {
      this.result = 'Ungültige Segmentangabe. Bitte kommaseparierte Liste mit Zahlen angeben.';
      return;
    }
    const days = Math.floor(this.days);
    if (days === 0) {
      this.result = 'Ungültiger Wert für Tagesouren: Es muss mindestens eine Tagestour geben.';
      return;
    }
    if (days >= segments.length) {



      // const helpArray: any[] = Array.apply(null, { length: 4 }); // days - segments.length });
      const helpArray: any[] = new Array(days - segments.length).fill(null); // days - segments.length });
      // result will be [null, null, null, null]


      this.result = segments.map((a, index) => {
        return `Tag ${index + 1}: ${a}`;
      }).join(', ') + [...helpArray].map((a, index) => {
        return `, Tag ${index + segments.length + 1}: 0`;
      }).join('');
      return;
    }

    this.result = 'calculated';
  }
}
</script>
<style lang="scss" scoped>
</style>