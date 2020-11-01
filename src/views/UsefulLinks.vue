<template>
  <el-container direction="vertical">
    <el-main>
      <h1>Nützliche Links</h1>
      <p>Hier werden einige Links aufgelistet,
        die immer wieder zur Entwicklung dieser Webseite benötigt werden.
        Es besteht kein Anspruch auf Vollständigkeit.
        Triviale Links zu den Githubprojekten eingesetzter Bibliotheken werden nicht verlinkt.
      </p>

      <el-tabs type="card" @tab-clicks="handleClick">
        <el-tab-pane label="JavaScript">
          <h2>JavaScript</h2>
          <ul>
            <li>
              <a href="https://caniuse.com/" target="blank">Can I use</a>
            </li>
            <li>
              <a href="https://element.eleme.io/#/en-US/component/tabs" target="blank">Element-UI</a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="C++">
          <h2>C++</h2>
          <ul>
            <li>
              <a href="https://en.cppreference.com/w/" target="blank">C++ Reference</a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="SQL">
          Es sind noch keine Links vorhanden
        </el-tab-pane>
        <el-tab-pane label="Sensors">
          Es sind not keine Links vorhanden.
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UsefulLinks'
})
</script>
