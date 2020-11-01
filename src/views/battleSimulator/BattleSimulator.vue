<template>
  <div class="about">
    <el-main>
      <h1>Battle Simulator</h1>
      <el-row :gutter="20">
        <el-col :lg="6" :span="6">
          <Button>Desert Challenge</Button>
        </el-col>
        <el-col :lg="18" :span="18">
          <div class="battle-screen">BattleScreen
              
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class BattleSimulator extends Vue {
  loadGame = () => {};
  party = []
  private mounted() {
    this.loadGame();
  }
}
</script>