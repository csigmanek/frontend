<template>
  <div id="nav">
    <!-- <router-link to="/">Home</router-link> -->
    <router-link to="/tic-tac-toe">TicTacToe</router-link>
    <router-link to="/sudoku">Sudoku</router-link>
    <router-link to="/quiz">Quiz</router-link>
    <router-link to="/cursed-witch">Verfluchte Hexe</router-link>
    <router-link to="/about">About</router-link>
    <a href="https://element-plus.org/#/en-US/component/installation">Element-UI</a>
  </div>
  <el-main>
    <router-view/>
  </el-main>
</template>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<style lang="scss" scoped>
.el-main {
  margin-right: 300px;
}

#nav {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  // background: #111191;
  background: linear-gradient( 0deg, #6837d8, #9f4cff );
  // linearGradient( 45deg, #2f2fbb, #111191 );

  a {
    display: block;
    width: 100%;
    height: 32px;
    line-height: 32px;
    color: white;
    font-weight: bold;
    &:hover {
      background: #cbc0da;
    }
    &.router-link-exact-active {
      background: #cbc0da;
    }
  }
}
</style>
