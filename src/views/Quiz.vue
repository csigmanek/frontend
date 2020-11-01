<template>
  <el-container direction="vertical">
    <el-main>
      <h1>Stellen Sie sich Ihr Quiz zusammen oder wählen Sie einen Themenquiz:</h1>
      <el-row :gutter="20">
        <el-col :span="24" :sm="12" :lg="6" v-if="loading">
          <el-card class="box-card">
            <div class="clearfix">
              <b><span>Bitte Warten Sie, während die Quiz geladen werden...</span></b>
            </div>
          </el-card>
        </el-col>
        <el-col :span="24" :sm="12" :lg="6"  v-for="quiz in quizList" :key="quiz.category">
          <el-card class="box-card">
            <div class="clearfix">
              <b><span>{{quiz.category}}</span></b>
              <el-button @click="startQuiz(quiz)" style="float: right; padding: 3px 0" type="text">Starten</el-button>
            </div>
            <div class="card__image">
              <img :src="`/img/quiz/${quiz.category}.jpg`" :alt="quiz.category">
            </div>
            <el-checkbox-group
              v-if="false"
              v-model="checkedAnthropology"
              :min="1"
              :max="4">
              <el-checkbox v-for="option in anthropologyOptions" :label="option" :key="option">{{option}}</el-checkbox>
            </el-checkbox-group>
            <p>
              {{quiz.description}}
            </p>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import axios from 'axios'
import { Quiz } from './quiz'

export default defineComponent({
  name: 'Start',
  data () {
    return {
      anthropologyOptions: ['Os - Knochen', 'Knochen - Os', 'Knochen - Region', 'Os - Region'],
      checkedAnthropology: ['Knochen - Region'],
      quizList: [] as Quiz[],
      loading: true
    }
  },
  methods: {
    startQuiz (quiz: Quiz): void {
      this.$store.commit('activeQuiz', quiz)
      this.$router.push({
        path: '/quiz/single-choice'
      })
    }
  },
  mounted () {
    this.loading = true
    axios.get('/api/quiz').then(
      (success) => {
        for (const data of success.data) {
          this.quizList.push({
            ask: JSON.parse(data[3]),
            category: data[0],
            pAnswers: JSON.parse(data[2]),
            answers: JSON.parse(data[1]),
            description: data[4]
          })
        }
        this.loading = false
      },
      (failure) => {
        console.warn(failure)
      }
    )
  }
})

</script>
<style lang="scss">
  // .el-main {
  //   max-width: 1920px;
  //   margin: 0 auto;
  //   width: 100%;
  // }
  // .el-row {
  //   margin-bottom: 20px;
  //   &:last-child {
  //     margin-bottom: 0;
  //   }
  // }
/*   .el-col {
    border-radius: 4px;
  } */
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    /* border-radius: 4px; */
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .el-checkbox {
    width: 50%;
    margin-left: 0px !important;
  }

  .card__image {
    margin-bottom: 10px;
    width: 100%;
    height: 150px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
