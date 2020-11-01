<template>
  <el-container direction="vertical">
    <el-main class="quiz-app">
      <transition-group name="slide-fade">
        <div key="start" v-if="start">
          <h1>Herzlich willkommen beim {{quiz.category}}quiz</h1>
          <h2>Bitte wählen Sie Ihre Erfahrungsstufe.</h2>
          <p>Die maximal erreichbare Punktanzahl und die zu erwartende Herausforderung steigen mit höherer Erfahrungsstufe.</p>
          <el-button class="quiz-app__button" @click="difficulty=1;backTo('start', 'game');startQuiz();" type="primary">Ich bin Anfänger</el-button>
          <el-button class="quiz-app__button" @click="difficulty=2;backTo('start', 'game');startQuiz();" type="primary">Ich habe Basiswissen</el-button>
          <el-button class="quiz-app__button" @click="difficulty=3;backTo('start', 'game');startQuiz();" type="primary">Ich bin Experte</el-button>
          <hr/>
          <el-button class="quiz-app__button" @click="backTo('start', 'highscore');" type="info">Bestenliste</el-button>
          <el-button class="quiz-app__button" @click="backTo('start', 'howToPlay');" type="info">Wie man spielt</el-button>
          <el-button class="quiz-app__button" @click="backToQuiz()" type="info">Zurück zur Quizwahl</el-button>
        </div>
        <div key="howToPlay" v-if="howToPlay">
          <h2>Wie man spielt</h2>
          <p>
            Man wählt einen Schwierigkeitsgrad. Danach werden verschiedene Frage zu {{quiz.category}} gestellt.
            Eine korrekte Antwort erhöht die Punktzahl, während eine falsche Antwort sie reduziert.
            Das Spiel endet, wenn die Zeit abgelaufen ist oder {{askAmount}} Fragen beantwortet wurden.
          </p>
          <h4> Schwierigkeitsgrad: </h4>
          <ul>
            <li>
              Leicht: 90 Sekunden Zeit, 3 Sekunden extra je richtiger Antwort.
              Punktemodifikator für Antworten: 1.0
            </li>
            <li>
              Normal: 60 Sekunden Zeit, 3 Sekunden extra je richtiger Antwort.
              Punktemodifikator für Antworten: 1.5
            </li>
            <li>
              Schwer: 30 Sekunden Zeit, 3 Sekunden extra je richtiger Antwort.
              Punktemodifikator für Antworten: 2.0
            </li>
          </ul>
          <p>
            Falsche Antworten reduzieren die Punktzahl deutlich.
            Am Ende des Spiels werden die Punkte um die verbleibende
            Zeit multipliziert mit dem Beantwortungsgrad der gestellten Fragen erhöht.
          </p>
          <el-button class="quiz-app__button" @click="backTo('howToPlay', 'start');" type="info">Zurück</el-button>
        </div>
        <div key="highscore" v-if="highscore" v-loading="highscoreLoading">
          <h2>Bestenliste</h2>
          <p v-if="highscoreList.length === 0">
            Derzeit sind noch keine Einträge verfügbar.
            Spielen sie auf einem beliebigen Schwierigkeitsgrad, um einen Rekord aufzustellen.
          </p>
          <ul class="quiz__highscorelist" v-else>
            <li v-for="(score, scoreIndex) in highscoreList" :key="'score' + scoreIndex">
              <div class="highscorelist__item highscorelist__rank">
                {{scoreIndex + 1}}
              </div
              ><div class="highscorelist__item highscorelist__score">
                {{score.score}}
              </div
              ><div class="highscorelist__item highscorelist__user">
                {{score.user}}
              </div
              ><div class="highscorelist__item highscorelist__info">
                ({{score.difficulty}})
              </div>
            </li>
          </ul>
          <el-button class="quiz-app__button" @click="backTo('highscore', 'start');" type="info">Zurück</el-button>
        </div>
        <div key="game" v-if="game">
          <h2 v-if="!gameRunning">Bereiten Sie sich vor: Das Quiz startet in {{timeToStart}} Sekunden</h2>
          <div v-else>
            <div class="quiz-app__question">
              <h2 class="question__h2">{{questionBefore}}</h2>
              <div class="question__word">{{questionMain}}</div>
              <h2 class="question__h2">{{questionAfter}}</h2>
            </div>
            <el-button class="quiz-app__button quiz-app__button--answer" :class="difficultyClass + ' ' +  answerClass(questionAnswerIndex)"
              v-for="(questionAnswer, questionAnswerIndex) in questionAnswers" :key="'questionAnswer' + questionAnswerIndex + questionAnswer"
              @click.stop.prevent="choseAnswer(questionAnswerIndex)" type="primary">{{questionAnswer}}</el-button>
            <el-button class="quiz-app__button" @click.stop.prevent="choseAnswer(-1)" type="info">Joker</el-button>
            <el-button class="quiz-app__button" @click="backTo('game', 'start');" type="info">Quiz abbrechen</el-button>
            {{gameTime}}
          </div>
        </div>
        <div key="summary" v-if="summary">
          <h2>Endergebnis:</h2>
          <p>
            Korrekt beantwortete Fragen: {{correctlyAnsweredQuestions}} / {{activeQuestion}}
          </p>
          <p>
            Verbleibende Zeit: {{gameTime}}
          </p>
          <p>
            Erreichte Punkte: {{gameScore}}
          </p>
          <p>
            Gesamtpunktzahl: {{currentScore}}
          </p>
          <el-select v-model="user" placeholder="Select">
            <el-option
              v-for="u in users"
              :key="u + 'users'"
              :label="u"
              :value="u">
            </el-option>
          </el-select>
          <p>
            Mit bestätigen des Buttons "Highscore übermitteln" und Auswahl eines Sternzeichens
            stimmten Sie der
            <a href="https://sigmanek.net/about" target="blank">
              Datenschutzerklärung
            </a> zu.
          </p>
          <el-button class="quiz-app__button" v-loading="submitting" @click="submitHighscore" type="primary">Highscore übermitteln</el-button>
          <el-button class="quiz-app__button" @click="backTo('summary', 'highscore');" type="info">Bestenliste</el-button>
          <el-button class="quiz-app__button" @click="backTo('summary', 'start');" type="info">Quiz abbrechen</el-button>
        </div>
      </transition-group>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import _ from 'lodash'
import axios from 'axios'
import { Quiz } from '../quiz'
import { defineComponent } from 'vue'

interface CompleteQuestion {
  question: string;
  questionBefore: string;
  questionAfter: string;
  validAnswer: string;
  answers: string[];
}

interface Highscore {
  score: number;
  user: string;
  category: string;
  difficulty: number;
}

export default defineComponent({
  name: 'SingleChoice',
  data () {
    const that = this as any
    return {
      quiz: that.$store.getters.activeQuiz as Quiz,
      start: true,
      category: 'Anatomie',
      howToPlay: false,
      highscore: false,
      game: false,
      submitting: false,
      summary: false,
      gameRunning: false,
      timeToStart: 3,
      // 0 - sandbox, 1 - easy, 2 - normal, 3 - hard
      difficulty: 0,
      askAmount: 25,
      // setting up question
      completeQuestions: [] as CompleteQuestion[],
      questionBefore: '',
      questionMain: '',
      questionAfter: '',
      questionAnswers: [] as string[],
      correctAnswerId: -1,
      answerChosen: false,
      gameTime: 0,
      gameScore: 0,
      score: 0,
      activeQuestion: 0,
      correctlyAnsweredQuestions: 0,
      user: '',
      highscoreList: [] as Highscore[],
      highscoreLoading: false,
      gameInterval: null as any,
      users: [
        'Widder',
        'Stier',
        'Zwillinge',
        'Krebs',
        'Löwe',
        'Jungfrau',
        'Waage',
        'Skorpion',
        'Schütze',
        'Steinbock',
        'Wassermann',
        'Fische'
      ],
      // stores whether current answers are correct
      // eslint-disable-next-line prefer-spread
      isValid: Array.apply(null, Array(8)).map(Number.prototype.valueOf, 0)
    }
  },
  methods: {
    shuffleArray (inputArray: any[]): any[] {
      const helpArray = _.cloneDeep(inputArray)
      const outputArray = []
      // perhaps alphabetical
      console.log('start', helpArray.length)
      for (let i = helpArray.length; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        outputArray.push(helpArray[j])
        helpArray.splice(j, 1)
      }
      return outputArray
    },
    backToQuiz (): void {
      this.$router.push({
        path: '/quiz'
      })
    },
    startQuiz (): void {
      this.gameRunning = false
      this.gameTime = 120 - this.difficultyAmount * 15
      this.gameScore = 0
      clearInterval(this.gameInterval)
      this.timeToStart = 3
      const countDown = () => {
        this.timeToStart -= 1
        if (this.timeToStart > 0) {
          setTimeout(countDown, 1000)
        } else {
          this.gameRunning = true
          this.gameInterval = setInterval(() => {
            this.gameTime--
            if (this.gameTime === 0) {
            // Time is up
              clearInterval(this.gameInterval)
              this.gameRunning = false
              this.backTo('game', 'summary')
            }
          }, 1000)
        }
      }
      countDown()
      // setting up questions
      this.generateQuestions()
      this.activeQuestion = -1
      this.getQuestion()
      this.score = 0
      this.correctlyAnsweredQuestions = 0
    },
    submitHighscore (): void {
      const that = this as any
      if (this.submitting) {
        return
      }
      if (this.user.length === 0) {
        that.$message({
          message: 'Bitte wählen Sie zunächst ein Sternzeichen.',
          type: 'error'
        })
        return
      }
      this.submitting = true
      axios.post('/api/highscores', {
        score: +this.currentScore,
        user: this.user,
        category: this.quiz.category,
        difficulty: this.difficulty
      })
        .then(
          (success: any) => {
            if (success.data) {
              that.$message({
                message: 'Ihr Highscore wurde erfolgreich übermittelt.',
                type: 'success'
              })
            } else {
              that.$message({
                message: 'Sie haben es leider nicht in die top 10 geschafft.',
                type: 'warning'
              })
            }
            this.submitting = false
            if (this.summary) {
              this.backTo('summary', 'highscore')
            }
          },
          (failure: any) => {
            console.warn('error submitting highscore')
          }
        )
    },
    getQuestion (): void {
      this.answerChosen = false
      this.resetIsValid()
      this.activeQuestion++
      if (this.activeQuestion === this.askAmount) {
      // last question
        clearInterval(this.gameInterval)
        this.gameRunning = false
        this.backTo('game', 'summary')
        return
      }
      const question = this.completeQuestions[this.activeQuestion]
      const questionAnswers = this.shuffleArray(question.answers)
      this.questionBefore = question.questionBefore
      this.questionAfter = question.questionAfter
      this.questionMain = question.question
      this.correctAnswerId = questionAnswers.indexOf(question.validAnswer)
      this.questionAnswers = questionAnswers
    },
    answerClass (index: number): string {
      return this.isValid[index] === 2 ? 'valid' : this.isValid[index] === 1 ? 'invalid' : ''
    },
    choseAnswer (index: number): void {
      if (this.answerChosen) {
        return
      }
      // Joker
      if (index === -1) {
        this.getQuestion()
        return
      }
      const isValidHelp = [...this.isValid]
      isValidHelp[index] = index === this.correctAnswerId ? 2 : 1
      this.isValid = isValidHelp
      this.answerChosen = true
      // go to next question
      if (index === this.correctAnswerId) {
        this.gameScore += 5 * (this.difficultyAmount + 2) / 4
        this.correctlyAnsweredQuestions++
        this.gameTime += 3
        setTimeout(() => {
          this.getQuestion()
        }, 300)
      } else {
        this.gameScore -= 10 * (this.difficultyAmount + 1) / 4
        setTimeout(() => {
          this.getQuestion()
        }, 1700)
      }
    },
    resetIsValid (): void {
      // eslint-disable-next-line prefer-spread
      this.isValid = Array.apply(null, Array(this.isValid.length)).map(Number.prototype.valueOf, 0)
    },
    backTo (from: string, target: string): void {
      const that = this as any
      that[from] = false
      // prevent scrollbar
      setTimeout(() => {
        that[target] = true
      }, 10)
    },
    generateQuestions (): void {
    // categories, number of questions to be asked
      const askLength = this.quiz.ask.length
      console.log(askLength, 'l')
      // questions will be asked in order
      // init array with [0,0,0]
      // eslint-disable-next-line prefer-spread
      const questionCategory = Array.apply(null, Array(askLength)).map(Number.prototype.valueOf, 0)
      const weight = 1 // todo use dynamic
      let questionCategorySum = 0
      for (let i = 0; i < askLength; i++) {
        questionCategorySum += weight
      }
      for (let j = 0; j < this.askAmount; j++) {
        const num = Math.random() * questionCategorySum
        for (let i = 0, questionCategoryTempSum = 0; i < askLength; i++) {
          questionCategoryTempSum += weight
          if (num <= questionCategoryTempSum) {
            questionCategory[i]++
            break
          }
        }
      }
      const completeQuestions = []
      // double questions are not yet avoided
      // prevent deadlock
      let operations = 0
      for (let i = 0; i < askLength; i++) {
        for (let j = 0; j < questionCategory[i] && operations < 2000; j++) {
          const id = Math.floor(this.quiz.answers.length * Math.random())
          const correctAnswer = this.quiz.answers[id]
          const askQ = this.quiz.ask[i].direction[0]
          const askA = this.quiz.ask[i].direction[1]
          const correctAnswerQ = correctAnswer[askQ]
          const correctAnswerA = correctAnswer[askA]
          operations++
          if (correctAnswerQ === '' || correctAnswerA === '') {
          // there is no useful answer or question
            j--
            continue
          }
          const complete = {
            question: correctAnswerQ,
            questionBefore: this.quiz.ask[i].questionBefore,
            questionAfter: this.quiz.ask[i].questionAfter,
            validAnswer: correctAnswerA,
            answers: [correctAnswerA]
          }
          const itemsNeeded = this.difficultyAmount
          const pAnswer = this.quiz.pAnswers[askA]
          if (pAnswer) {
          // there is a subset of valid answers given
            while (complete.answers.length < itemsNeeded && operations < 2000) {
              const id2 = Math.floor(pAnswer!.length * Math.random())
              operations++
              if (complete.answers.indexOf(pAnswer![id2]) === -1) {
              // answer does not exist yet
                complete.answers.push(pAnswer![id2])
              }
            }
          } else {
            while (complete.answers.length < itemsNeeded && operations < 2000) {
              operations++
              const id2 = Math.floor(this.quiz.answers.length * Math.random())
              if (this.quiz.answers[id2][askA] !== '' && complete.answers.indexOf(this.quiz.answers[id2][askA]) === -1) {
                complete.answers.push(this.quiz.answers[id2][askA])
              }
            }
          }
          completeQuestions.push(complete)
        }
        this.completeQuestions = completeQuestions
      }
    }
  },
  mounted () {
    if (this.quiz.category === undefined) {
      // no quiz has been loaded yet
      this.backToQuiz()
    }
  },
  computed: {
    currentScore (): string {
      return (this.gameScore + this.gameTime * this.correctlyAnsweredQuestions / Math.max(this.activeQuestion, 1)).toFixed(2)
    },
    difficultyClass (): string {
      let difficultyClass = ''
      switch (this.difficulty) {
        case 0:
        case 2:
        // 4 answers
          difficultyClass = 'quiz-app__button--medium'
          break
        case 3:
        // 6 answers
          difficultyClass = 'quiz-app__button--small'
          break
        case 1:
        // 2 answers
          difficultyClass = 'quiz-app__button--big'
          break
      }
      return difficultyClass
    },
    difficultyAmount (): number {
      let amount = 0
      switch (this.difficulty) {
        case 0:
        case 2:
        // 4 answers
          amount = 4
          break
        case 3:
        // 6 answers
          amount = 6
          break
        case 1:
        // 2 answers
          amount = 2
          break
      }
      return amount
    }
  },
  watch: {
    highscore: function (val: boolean, oldVal: boolean) {
      if (val) {
        this.highscoreLoading = true
        axios.get(`/api/highscores?category=${this.quiz.category}`)
          .then(
            (success: any) => {
              console.log('success', success.data)
              this.highscoreLoading = false
              this.highscoreList = success.data
            },
            (failure: any) => {
              console.warn(failure)
            }
          )
      }
    }
  }
})

</script>
<style lang="scss">
@import '~settings';
  .quiz-app {
    background-color:#d7c6e6;
    height: 100vh;
    max-width: 600px;
    @include res(md) {
      height: calc(100vh - 60px);
    }
  }
  .quiz-app__button {
    width: 100%;
    max-width: 600px;
    display: block !important;
    height: 60px;
    font-size: 24px;
    margin: 10px auto !important;
  }
  .quiz-app__button--answer {
    width: calc(50% - 10px);
    overflow: hidden;
    height: 100%;
    vertical-align: top;
    display: inline-block !important;
    &:nth-child(2n + 1) {
      margin-left: 20px !important;
    }
    span {
      display: inline-block;
      width: 100%;
      white-space: normal;
      word-break: normal;
    }
    &:focus {
      background-color: rgb(96, 39, 58) !important;
    }
  }
  .quiz-app__button--small {
    height: 80px;
  }
  .quiz-app__button--medium {
    height: 120px;
  }
  .quiz-app__button--big {
    height: 180px;
  }
.quiz-app__question {
  @include res(md) {
    height: 200px;
  }
  height: 150px;
  width: 100%;
  overflow-y: auto;
}
.question__word {
  text-align: center;
  font-size: 30px;
  @include res(md) {
    font-size: 40px;
  }
}
.question__h2 {
  margin: 0 10px;
  @include res(md) {
    margin: 0 20px;
  }
}
.slide-fade-enter-active {
  transition: opacity .3s ease;
}
.slide-fade-enter {
  opacity: 0;
}
.valid {
  border: 5px green solid !important;
}
.invalid {
  border: 5px red solid !important;
}
.el-select {
  width: 100%;
}
.el-input__inner {
  height: 60px;
}

.quiz__highscorelist {
  font-size: 20px;
  list-style: none;
}
.highscorelist__item {
  display: inline-block;
}
.highscorelist__rank {
  width: 10%;
}
.highscorelist__score {
  width: 20%;
}
.highscorelist__user {
  width: 30%;
}
.highscorelist__info {
  width: 40%;
}
</style>
