<template>
  <el-container direction="vertical">
    <el-main>
      <h1>Primzahlkette</h1>
      <div class="prime__container">
        <div class="prime__line">
          <div class="prime__member"
            :class="{'is-prime': isPrime(item),
              'is-twin': isPrime(numbersUp[itemIndex]) && isPrime(numbersDown[itemIndex])}"
            v-for="(item, itemIndex) in numbersUp"
            :key="'p1' + itemIndex">{{item}}</div>
        </div>
        <div class="prime__line">
          <div class="prime__member"
            :class="{'is-prime': isPrime(item),
              'is-twin': isPrime(numbersUp[itemIndex]) && isPrime(numbersDown[itemIndex])}"
            v-for="(item, itemIndex) in numbersDown"
            :key="'p1' + itemIndex">{{item}}</div>
        </div>
      </div>
      <el-button primary @click="rotateLeft">Linksdrehung</el-button>
      <el-button primary @click="rotateRight">Rechtsdrehung</el-button>
      <el-button primary @click="numbers = calcNumbers(10000)">10.000 Werte</el-button>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class PrimeChain extends Vue {
  private primes = this.calcPrime(10000);
  private numbers = this.calcNumbers(1000);

  private calcPrime(max: number): number[] {
    const primes = [];
    for (let i = 2; i < max; i++) {
      let isPrime = true;
      for (const prime of primes) {
        if (i % prime === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) {
        primes.push(i);
      }
    }
    return primes;
  }
  private rotateRight(): void {
    this.numbers.push(this.numbers[0]);
    this.numbers.splice(0, 1);
  }
  private rotateLeft(): void {
    this.numbers.splice(0, 0, this.numbers[this.numbers.length - 1]);
    this.numbers.splice(this.numbers.length - 1, 1);
  }
  private isPrime(num: number): boolean {
    return this.primes.findIndex((a) => num === a) !== -1;
  }
  private calcNumbers(max: number) {
    const numbers = [];
    for (let i = 1; i < max; i += 2) {
      numbers.push(i);
    }
    return numbers;
  }

  private get numbersUp(): number[] {
    return this.numbers.slice((this.numbers.length) / 2, this.numbers.length).reverse();
  }
  private get numbersDown(): number[] {
    return this.numbers.slice(0, (this.numbers.length) / 2);
  }
}
</script>
<style lang="scss" scoped>
.prime__container {
  width: 100%;
  overflow-x: scroll;
  height: 150px;
}
.prime__member {
  width: 40px;
  text-align: center;
  line-height: 40px;
  height: 40px;
  border-radius: 100%;
  display: inline-block;
  background: grey;
}
.is-prime {
  background: red;
}
.is-twin {
  border: 4px solid black;
}
.prime__line {
  width: 100%;
  height: 50px;
  white-space: nowrap;
}
</style>