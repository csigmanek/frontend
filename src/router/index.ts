import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import BattleSimulator from '../views/battleSimulator/BattleSimulator.vue'
// import CalculateSegment from '../views/demos/CalculateSegment.vue'
// import PrimeChain from '../views/demos/PrimeChain.vue'
// import Features from '../views/Features.vue'
import CursedWitch from '../views/features/CursedWitch.vue'
// import IsolaAi from '../views/features/IsolaAi.vue'
// import Home from '../views/Home.vue'
import Quiz from '../views/Quiz.vue'
import SingleChoice from '../views/quiz/SingleChoice.vue'
import StateMachine from '../views/StateMachine.vue'
import Sudoku from '../views/Sudoku.vue'
import TicTacToe from '../views/TicTacToe.vue'
import UsefulLinks from '../views/UsefulLinks.vue'
const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/tic-tac-toe',
    name: 'TicTacToe',
    component: TicTacToe
  },
  {
    path: '/state-machine',
    name: 'StateMachine',
    component: StateMachine
  },
  {
    path: '/sudoku',
    name: 'Sudoku',
    component: Sudoku
  },
  // {
  //   path: '/',
  //   name: 'Start',
  //   component: Start
  // },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz
  },
  // {
  //   path: '/battle-simulator',
  //   name: 'BattleSimulator',
  //   component: BattleSimulator
  // },
  // {
  //   path: '/demos/prime-chain',
  //   name: 'Prime Chain',
  //   component: PrimeChain
  // },
  // {
  //   path: '/demos/calculate-segment',
  //   name: 'Calculate Segment',
  //   component: CalculateSegment
  // },
  {
    path: '/useful-links',
    name: 'Useful Links',
    component: UsefulLinks
  },
  {
    path: '/cursed-witch',
    name: 'CursedWitch',
    component: CursedWitch
  },
  // {
  //   path: '/features/isolaAi',
  //   name: 'isolaAi',
  //   component: IsolaAi
  // },
  {
    path: '/quiz/single-choice',
    name: 'SingleChoice',
    component: SingleChoice
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
