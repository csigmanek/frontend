<template>
  <el-container direction="vertical">
    <el-main @click="showHelp = false" @focusout="showHelp = false">
      <h2>Die verfluchte Hexe</h2>
      <div class="witch" :class="{'valid': valid, 'witch--small': witchSmall}" @mouseup="stopDrag" @mouseleave="stopDrag" @touchout="stopDrag" @touchend="stopDrag">
        <div class="witch__element" v-for="(witch, witchIndex) in witches" :key="witch.name" @mousedown.stop.prevent="startDrag($event, witchIndex)"
          :style="`transform: translate(${witch.style.left}px,${witch.style.top}px);${witch.style.active ? 'z-index: 10;': 'transition: transform 0.15s ease;'}`"
          ref="dragIcon" @click.stop.prevent="turnWitch(witchIndex)" @touchstart.stop.prevent="startDrag($event, witchIndex)" :dataWitch="witchIndex"
        >
          <div :class="'witch' + Math.abs(witch.data.north) + (witch.data.north < 0 ? 'down' : 'up witch__picture--up')" class="witch__picture witch__picture--north"></div>
          <div :class="'witch' + Math.abs(witch.data.south) + (witch.data.south < 0 ? 'down' : 'up witch__picture--up')" class="witch__picture witch__picture--south"></div>
          <div :class="'witch' + Math.abs(witch.data.east) + (witch.data.east < 0 ? 'down' : 'up witch__picture--up')" class="witch__picture witch__picture--east"></div>
          <div :class="'witch' + Math.abs(witch.data.west) + (witch.data.west < 0 ? 'down' : 'up witch__picture--up')" class="witch__picture witch__picture--west"></div>
        </div>
      </div>
      <div class="description">
        Linksklicken Sie, um die Karte zu drehen. Verschieben Sie die Karten per Drag and Drop, bis das Quadrat korrekt ausgefüllt ist.
        <div>
          <el-radio v-model="difficulty" :label="1">Leicht</el-radio>
          <el-radio v-model="difficulty" :label="2">Normal</el-radio>
          <el-radio v-model="difficulty" :label="3">Schwer</el-radio>
        </div>
        <el-button @click="newGame">Neuen Versuch starten</el-button>
        <h3 v-if="valid" key="valid_h3">Herzlichen Glückwunsch! Sie haben gewonnen!</h3>
        <el-button @click.stop.prevent="showHelp = true;">Hilfe Anzeigen</el-button>
        <el-checkbox v-model="witchSmall">kleineres Feld</el-checkbox>
        <div v-if="showHelp" key="help_div" class="showHelp" @click="showHelp = false" @focusout="showHelp = false">
          <h2 style="background: white;">Dies ist die mittlere Position</h2>
          <div style="left: 50%; transform: translateX(-50%);" class="witch__element">
            <div :class="'witch' + Math.abs(helpWitch.north) + (helpWitch.north < 0 ? 'down' : 'up witch__picture--up')" class="witch__picture witch__picture--north"></div>
            <div :class="'witch' + Math.abs(helpWitch.south) + (helpWitch.south < 0 ? 'down' : 'up witch__picture--up')" class="witch__picture witch__picture--south"></div>
            <div :class="'witch' + Math.abs(helpWitch.east) + (helpWitch.east < 0 ? 'down' : 'up witch__picture--up')" class="witch__picture witch__picture--east"></div>
            <div :class="'witch' + Math.abs(helpWitch.west) + (helpWitch.west < 0 ? 'down' : 'up witch__picture--up')" class="witch__picture witch__picture--west"></div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'

const firstGutter = 202
const secondGutter = 404
const firstTest = firstGutter / 2
const secondTest = (secondGutter - firstGutter) / 2 + firstGutter

interface WitchPosition {
  top: number;
  left: number;
  active: boolean;
}
interface WitchData {
  north: number;
  east: number;
  west: number;
  south: number;
}
interface Witch {
  name: string;
  style: WitchPosition;
  data: WitchData;
}

export default defineComponent({
  name: 'CursedWitch',
  data () {
    return {
      witches: [
        {
          name: 'witch1',
          style: {
            top: 0,
            left: 0,
            active: false
          },
          data: {
            north: 1,
            east: 2,
            west: -1,
            south: -2
          }
        },
        {
          name: 'witch2',
          style: {
            top: firstGutter,
            left: 0,
            active: false
          },
          data: {
            north: 1,
            east: 2,
            west: -1,
            south: -2
          }
        },
        {
          name: 'witch3',
          style: {
            top: secondGutter,
            left: 0,
            active: false
          },
          data: {
            north: 1,
            east: 2,
            west: -1,
            south: -2
          }
        },
        {
          name: 'witch4',
          style: {
            top: 0,
            left: firstGutter,
            active: false
          },
          data: {
            north: 1,
            east: 2,
            west: -1,
            south: -2
          }
        },
        {
          name: 'witch5',
          style: {
            top: firstGutter,
            left: firstGutter,
            active: false
          },
          data: {
            north: 1,
            east: 2,
            west: -1,
            south: -2
          }
        },
        {
          name: 'witch6',
          style: {
            top: secondGutter,
            left: firstGutter,
            active: false
          },
          data: {
            north: 1,
            east: 2,
            west: -1,
            south: -2
          }
        },
        {
          name: 'witch7',
          style: {
            top: 0,
            left: secondGutter,
            active: false
          },
          data: {
            north: 1,
            east: 2,
            west: -1,
            south: -2
          }
        },
        {
          name: 'witch8',
          style: {
            top: firstGutter,
            left: secondGutter,
            active: false
          },
          data: {
            north: 1,
            east: 2,
            west: -1,
            south: -2
          }
        },
        {
          name: 'witch9',
          style: {
            top: secondGutter,
            left: secondGutter,
            active: false
          },
          data: {
            north: 1,
            east: 2,
            west: -1,
            south: -2
          }
        }
      ] as Witch[],
      witchSmall: false,
      valid: false,
      dragging: false,
      witchIndex: 1,
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      difficulty: 1,
      helpWitch: {
        north: 1,
        east: 2,
        west: -1,
        south: -2
      } as WitchData,
      showHelp: false
    }
  },
  computed: {
    scaleFactor () {
      if (this.witchSmall) return 2
      else return 1
    }
  },
  methods: {
    mouseMove (event: any) { // MouseEvent | TouchEvent
      this.dragging = true
      const currentWitch = this.witches[this.witchIndex]
      currentWitch.style.left = Math.min(Math.max((event.clientX || event.pageX) * this.scaleFactor - this.x, 0), secondGutter)
      currentWitch.style.top = Math.min(Math.max((event.clientY || event.pageY) * this.scaleFactor - this.y, 0), secondGutter)
      for (const witch of this.witches) {
        if (currentWitch.name === witch.name) {
          continue
        }
        const top = currentWitch.style.top < firstTest ? 0 : currentWitch.style.top < secondTest ? firstGutter : secondGutter
        const left = currentWitch.style.left < firstTest ? 0 : currentWitch.style.left < secondTest ? firstGutter : secondGutter
        if (top === witch.style.top && left === witch.style.left) {
          witch.style.top = this.top
          witch.style.left = this.left
          this.top = top
          this.left = left
          break
        }
      }
    },
    startDrag (event: any, index: number): void {
      window.removeEventListener('mousemove', this.mouseMove)
      window.removeEventListener('touchmove', this.mouseMove)
      if (this.valid) {
        return
      }

      this.witchIndex = index
      const witchStyle = this.witches[index].style
      this.x = (event.clientX || event.pageX) * this.scaleFactor - witchStyle.left
      this.y = (event.clientY || event.pageY) * this.scaleFactor - witchStyle.top
      this.left = witchStyle.left
      this.top = witchStyle.top
      witchStyle.active = true
      window.addEventListener('mousemove', this.mouseMove)
      window.addEventListener('touchmove', this.mouseMove)
    },
    stopDrag (): void {
      window.removeEventListener('mousemove', this.mouseMove)
      window.removeEventListener('touchmove', this.mouseMove)
      const style = this.witches[this.witchIndex].style
      style.active = false
      this.$nextTick(() => {
        style.top = style.top < firstTest ? 0 : style.top < secondTest ? firstGutter : secondGutter
        style.left = style.left < firstTest ? 0 : style.left < secondTest ? firstGutter : secondGutter
        this.checkValid()
        this.dragging = false
      })
    },
    turnWitch (index: number): void {
      if (this.dragging || this.valid) {
        return
      }
      const witchData = this.witches[index].data
      const helpData = witchData.north
      witchData.north = witchData.east
      witchData.east = witchData.south
      witchData.south = witchData.west
      witchData.west = helpData
      this.checkValid()
    },
    newGame (): void {
      this.valid = false
      const witchArray = [-2, -1, 1, 2]
      if (this.difficulty > 1) {
        witchArray.push(3)
        witchArray.push(-3)
      }
      if (this.difficulty > 2) {
        witchArray.push(4)
        witchArray.push(-4)
      }
      const witchArrayLength = witchArray.length
      const dataArray = []

      const shuffeWitch = (witch: WitchData) => {
        const helpData = witch.north
        witch.north = witch.east
        witch.east = witch.south
        witch.south = witch.west
        witch.west = helpData
      }

      dataArray.push({
        north: witchArray[Math.floor(Math.random() * witchArrayLength)],
        south: witchArray[Math.floor(Math.random() * witchArrayLength)],
        east: witchArray[Math.floor(Math.random() * witchArrayLength)],
        west: witchArray[Math.floor(Math.random() * witchArrayLength)]
      })

      dataArray.push({
        north: witchArray[Math.floor(Math.random() * witchArrayLength)],
        south: witchArray[Math.floor(Math.random() * witchArrayLength)],
        east: dataArray[0].west * -1,
        west: witchArray[Math.floor(Math.random() * witchArrayLength)]
      })

      dataArray.push({
        north: witchArray[Math.floor(Math.random() * witchArrayLength)],
        south: witchArray[Math.floor(Math.random() * witchArrayLength)],
        east: dataArray[1].west * -1,
        west: witchArray[Math.floor(Math.random() * witchArrayLength)]
      })
      // 2nd row
      dataArray.push({
        north: dataArray[0].south * -1,
        south: witchArray[Math.floor(Math.random() * witchArrayLength)],
        east: witchArray[Math.floor(Math.random() * witchArrayLength)],
        west: witchArray[Math.floor(Math.random() * witchArrayLength)]
      })
      this.helpWitch = {
        north: dataArray[1].south * -1,
        south: witchArray[Math.floor(Math.random() * witchArrayLength)],
        east: dataArray[3].west * -1,
        west: witchArray[Math.floor(Math.random() * witchArrayLength)]
      }
      dataArray.push(_.cloneDeep(this.helpWitch))

      dataArray.push({
        north: dataArray[2].south * -1,
        south: witchArray[Math.floor(Math.random() * witchArrayLength)],
        east: dataArray[4].west * -1,
        west: witchArray[Math.floor(Math.random() * witchArrayLength)]
      })
      // 3rd row
      dataArray.push({
        north: dataArray[3].south * -1,
        south: witchArray[Math.floor(Math.random() * witchArrayLength)],
        east: witchArray[Math.floor(Math.random() * witchArrayLength)],
        west: witchArray[Math.floor(Math.random() * witchArrayLength)]
      })

      dataArray.push({
        north: dataArray[4].south * -1,
        south: witchArray[Math.floor(Math.random() * witchArrayLength)],
        east: dataArray[6].west * -1,
        west: witchArray[Math.floor(Math.random() * witchArrayLength)]
      })

      dataArray.push({
        north: dataArray[5].south * -1,
        south: witchArray[Math.floor(Math.random() * witchArrayLength)],
        east: dataArray[7].west * -1,
        west: witchArray[Math.floor(Math.random() * witchArrayLength)]
      })

      for (const data of dataArray) {
        let times = Math.floor(Math.random() * 4)
        while (times > 0) {
          times--
          shuffeWitch(data)
        }
      }

      for (const witch of this.witches) {
        const index = Math.floor(Math.random() * dataArray.length)
        witch.data = dataArray[index]
        dataArray.splice(index, 1)
      }
    },
    checkValid (): void {
      const validHorizontal = [
        [0, 0, 0],
        [0, 0, 0]
      ]
      const validVertical = [
        [0, 0],
        [0, 0],
        [0, 0]
      ]
      let valid = true
      for (const witch of this.witches) {
        if (!valid) {
          return
        }
        if (witch.style.top === 0) {
          if (witch.style.left === 0) {
            if (validHorizontal[0][0] === 0) {
              validHorizontal[0][0] = witch.data.south
            } else if (validHorizontal[0][0] !== witch.data.south * -1) {
              valid = false
            }
            if (validVertical[0][0] === 0) {
              validVertical[0][0] = witch.data.east
            } else if (validVertical[0][0] !== witch.data.east * -1) {
              valid = false
            }
          } else if (witch.style.left === firstGutter) {
            if (validHorizontal[0][1] === 0) {
              validHorizontal[0][1] = witch.data.south
            } else if (validHorizontal[0][1] !== witch.data.south * -1) {
              valid = false
            }
            if (validVertical[0][0] === 0) {
              validVertical[0][0] = witch.data.west
            } else if (validVertical[0][0] !== witch.data.west * -1) {
              valid = false
            }
            if (validVertical[0][1] === 0) {
              validVertical[0][1] = witch.data.east
            } else if (validVertical[0][1] !== witch.data.east * -1) {
              valid = false
            }
          } else if (witch.style.left === secondGutter) {
            if (validHorizontal[0][2] === 0) {
              validHorizontal[0][2] = witch.data.south
            } else if (validHorizontal[0][2] !== witch.data.south * -1) {
              valid = false
            }
            if (validVertical[0][1] === 0) {
              validVertical[0][1] = witch.data.west
            } else if (validVertical[0][1] !== witch.data.west * -1) {
              valid = false
            }
          }
        } else if (witch.style.top === firstGutter) {
          if (witch.style.left === 0) {
            if (validHorizontal[1][0] === 0) {
              validHorizontal[1][0] = witch.data.south
            } else if (validHorizontal[1][0] !== witch.data.south * -1) {
              valid = false
            }
            if (validHorizontal[0][0] === 0) {
              validHorizontal[0][0] = witch.data.north
            } else if (validHorizontal[0][0] !== witch.data.north * -1) {
              valid = false
            }
            if (validVertical[1][0] === 0) {
              validVertical[1][0] = witch.data.east
            } else if (validVertical[1][0] !== witch.data.east * -1) {
              valid = false
            }
          } else if (witch.style.left === firstGutter) {
            if (validHorizontal[1][1] === 0) {
              validHorizontal[1][1] = witch.data.south
            } else if (validHorizontal[1][1] !== witch.data.south * -1) {
              valid = false
            }
            if (validHorizontal[0][1] === 0) {
              validHorizontal[0][1] = witch.data.north
            } else if (validHorizontal[0][1] !== witch.data.north * -1) {
              valid = false
            }
            if (validVertical[1][0] === 0) {
              validVertical[1][0] = witch.data.west
            } else if (validVertical[1][0] !== witch.data.west * -1) {
              valid = false
            }
            if (validVertical[1][1] === 0) {
              validVertical[1][1] = witch.data.east
            } else if (validVertical[1][1] !== witch.data.east * -1) {
              valid = false
            }
          } else if (witch.style.left === secondGutter) {
            if (validHorizontal[1][2] === 0) {
              validHorizontal[1][2] = witch.data.south
            } else if (validHorizontal[1][2] !== witch.data.south * -1) {
              valid = false
            }
            if (validHorizontal[0][2] === 0) {
              validHorizontal[0][2] = witch.data.north
            } else if (validHorizontal[0][2] !== witch.data.north * -1) {
              valid = false
            }
            if (validVertical[1][1] === 0) {
              validVertical[1][1] = witch.data.west
            } else if (validVertical[1][1] !== witch.data.west * -1) {
              valid = false
            }
          }
        } else if (witch.style.top === secondGutter) {
          if (witch.style.left === 0) {
            if (validHorizontal[1][0] === 0) {
              validHorizontal[1][0] = witch.data.north
            } else if (validHorizontal[1][0] !== witch.data.north * -1) {
              valid = false
            }
            if (validVertical[2][0] === 0) {
              validVertical[2][0] = witch.data.east
            } else if (validVertical[2][0] !== witch.data.east * -1) {
              valid = false
            }
          } else if (witch.style.left === firstGutter) {
            if (validHorizontal[1][1] === 0) {
              validHorizontal[1][1] = witch.data.north
            } else if (validHorizontal[1][1] !== witch.data.north * -1) {
              valid = false
            }
            if (validVertical[2][0] === 0) {
              validVertical[2][0] = witch.data.west
            } else if (validVertical[2][0] !== witch.data.west * -1) {
              valid = false
            }
            if (validVertical[2][1] === 0) {
              validVertical[2][1] = witch.data.east
            } else if (validVertical[2][1] !== witch.data.east * -1) {
              valid = false
            }
          } else if (witch.style.left === secondGutter) {
            if (validHorizontal[1][2] === 0) {
              validHorizontal[1][2] = witch.data.north
            } else if (validHorizontal[1][2] !== witch.data.north * -1) {
              valid = false
            }
            if (validVertical[2][1] === 0) {
              validVertical[2][1] = witch.data.west
            } else if (validVertical[2][1] !== witch.data.west * -1) {
              valid = false
            }
          }
        }
      }
      this.valid = valid
    }
  }
})

</script>
<style lang="scss" scoped>
@import '~settings';
.witch {
  position: relative;
  display: inline-block;
  width: 604px;
  height: 604px;
  padding: 25px;
  background-color: $--color-2;
  &.valid {
    background-color: $--color-3;
  }
}
.witch--small {
  transform: scale(0.5) translate(-50%, -50%);
}
.witch__element {
  width: 200px;
  height: 200px;
  position: absolute;
  background: white;
  cursor: grab;
}
.witch__picture {
  position: absolute;
  width: 60%;
  height: 60%;
  background-size: contain;
  background-repeat: no-repeat;
  &--north {
    left: 50%;
    top: 0%;
    transform: translateX(-50%) rotate(180deg);
    transform: translateX(-50%);
    &.witch__picture--up {
      transform: translateX(-50%) rotate(180deg);
      background-position-y: 100%;
    }
  }
  &--east {
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    &.witch__picture--up {
      background-position-y: 100%;
      transform: translateY(-50%) rotate(270deg);
    }
  }
  &--west {
    left: 0;
    top: 50%;
    transform: translateY(-50%) rotate(270deg);
    &.witch__picture--up {
      transform: translateY(-50%) rotate(90deg);
      background-position-y: 100%;
    }
  }
  &--south {
    left: 50%;
    bottom: 0%;
    transform: translateX(-50%) rotate(180deg);
    &.witch__picture--up {
      transform: translateX(-50%);
      background-position-y: 100%;
    }
  }
}
.witch1up {
  background-image: url('./img/hexen/hexe1_oben.png');
}
.witch1down {
  background-image: url('./img/hexen/hexe1_unten.png');
}
.witch2up {
  background-image: url('./img/hexen/hexe2_oben.png');
}
.witch2down {
  background-image: url('./img/hexen/hexe2_unten.png');
}
.witch3up {
  background-image: url('./img/hexen/hexe3_oben.png');
}
.witch3down {
  background-image: url('./img/hexen/hexe3_unten.png');
}
.witch4up {
  background-image: url('./img/hexen/hexe4_oben.png');
}
.witch4down {
  background-image: url('./img/hexen/hexe4_unten.png');
}
.description {
  padding-left: 25px;
  display: inline-block;
  vertical-align: top;
}
.showHelp {
  position: fixed;
  background-color: rgba(0,0,0,0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
}
</style>
