<template>
  <el-container direction="vertical">
    <el-main>
      <h1>Probieren Sie einige zur Demonstration implementierte Features aus:</h1>
      <el-row :gutter="20">
        <el-col :span="24" :sm="12" :lg="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <b><span>Verflixte Hexen</span></b>
              <el-button @click="start('cursedWitch')" style="float: right; padding: 3px 0" type="text">Starten</el-button>
            </div>
            <div class="card__image">
              <img src="./features/img/witch.png" alt="witches">
            </div>
          </el-card>
        </el-col>
        <el-col :span="24" :sm="12" :lg="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <b><span>Isola</span></b>
              <el-button @click="start('isolaAi')" style="float: right; padding: 3px 0" type="text">Starten</el-button>
            </div>
            <div class="card__image">
              <img src="./features/img/isola.jpg" alt="isola">
            </div>
          </el-card>
        </el-col>
        <el-col :lg="6" :span="12"><div class="grid-content bg-purple"></div></el-col>
        <el-col :lg="6" :span="12"><div class="grid-content bg-purple"></div></el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Features extends Vue {
  private start(name: string): void {
    this.$router.push({
      path: `features/${name}`,
    });
  }
}
</script>