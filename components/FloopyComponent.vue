<template>
  <div>
    <div>Connection Status: {{status()}}</div>
    <div class="d-flex flex-row">
      <div class="mr-3">messages</div>
      <div v-if="grid && grid.length > 0" class="d-flex flex-column nopad">
        <div>GameTick: {{gametick}}</div>
        <div
          class="d-flex flex-row nopad"
          :style="'height:' + cellSize + 'px;'"
          v-for="(row, index) in grid"
          :key="'row' + index"
        >
          <div
            class="flex-item nopad"
            v-for="(item, j) in row"
            :key="'cell' + index + ' ' + j"
            :style="'width:' + (cellSize - 1) + 'px;'"
          >
            <CanvasSquare
              class="nopad"
              :gametick="gametick"
              :width="cellSize"
              :height="cellSize"
              :gamesquarecontent="grid[index][j]"
              bordercolor="white"
            />
            <!-- {{ index + "" + j }} -->
          </div>
        </div>
      </div>
      <div class="d-flex flex-column ml-3">
        <v-btn class="mt-3" v-on:click="onRestart" :disabled="!isConnected()">Restart</v-btn>
        <v-btn class="mt-3" v-on:click="onStep" :disabled="!isConnected()">Step</v-btn>
        <v-btn class="mt-3" v-on:click="onGo" :disabled="!isConnected()">Go!</v-btn>
        <v-btn class="mt-3" v-on:click="onStop" :disabled="!isConnected()">Stop!</v-btn>
        <span style="min-width:120px;" :disabled="!isConnected()">Delay: {{delay}}ms</span>
        <v-slider
          v-model="delay"
          min="1"
          max="10000"
          v-on:mouseup="onSetDelay"
          :disabled="!isConnected()"
        ></v-slider>
      </div>
    </div>
    <LeaderBoard :heroes="currentHeroList"></LeaderBoard>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CanvasSquare from "~/components/CanvasSquare.vue";
import LeaderBoard from "~/components/LeaderBoard.vue";
import { Square, Hero } from "~/ts/Types";
import GameSquareContent from "~/ts/GameSquareContent";
const sout = console.log;
@Component({ components: { CanvasSquare, LeaderBoard } })
export default class FloopyComponent extends Vue {
  canvas!: HTMLCanvasElement;
  c!: CanvasRenderingContext2D;
  grid: GameSquareContent[][] = [];
  socket: WebSocket = null as any;
  currentHeroList: Hero[] = [];
  connectingStatus: string[] = ["connecting", "connecting..", "connecting..."];
  connectionAttempts: number = 0;
  port: number = 8887;
  cellSize: number = 65;
  delay: number = 1000;
  all: Square[] = [];
  gametick: number = 0;
  isConnected(): boolean {
    // sout(this.getSocket().readyState);
    return this.getSocket() && this.getSocket().readyState == 1;
  }
  status() {
    if (this.getSocket()) {
      switch (this.getSocket().readyState) {
        case 0:
          // return "CONNECTING";
          return this.connectingStatus[
            this.connectionAttempts % this.connectingStatus.length
          ];
        case 1:
          return "OPEN";
        case 2:
          return "CLOSING";
        case 3:
          return "CLOSED";

        default:
          return "????";
      }
    } else {
      return "no socket. Make sure your program is running and refresh this page.";
    }
  }
  mounted() {
    this.setUpSocket();
    // this.setUpCanvas();
    const r = location.search.match(/w=(\d+)/);
    if (r) {
      this.cellSize = parseInt(r[1], 10);
    }
    this.drawGrid(10, 10);
  }
  onStep() {
    this.sendMessage({ oneStep: true });
  }
  onGo() {
    this.sendMessage({ start: true, delay: this.delay });
  }
  onRestart() {
    this.sendMessage({ restart: true, delay: this.delay });
  }
  onStop() {
    this.sendMessage({ stop: true });
  }
  onSetDelay() {
    setTimeout(() => {
      sout("Setting delay: " + this.delay);
      this.sendMessage({ delay: this.delay });
    }, 10);
  }
  sendMessage(message: any) {
    this.socket.send(JSON.stringify(message));
  }
  getSocket() {
    return this.socket;
  }
  setUpSocket() {
    this.connectionAttempts++;
    this.socket = new WebSocket(`ws://lvh.me:${this.port}`);
    this.socket.onmessage = (ev: MessageEvent) => {
      // sout("Message received!", ev.data);
      sout("Message parsed is:", JSON.parse(ev.data));
      try {
        this.handleMessage(JSON.parse(ev.data));
      } catch (e) {
        sout("could not parse received message: ", ev.data, e);
      }
      return ev;
    };
    this.socket.onclose = (ev: Event) => {
      sout("socket was closed!!", ev);
      if (this.socket) {
        // (this.socket as any).onerror(ev);
        this.socket.close();
        this.socket = null as any;
      }
    };
    this.socket.onerror = (ev: Event) => {
      sout("there was an error. Attempting reconnection...", ev);
      if (this.socket) {
        this.socket.close();
      }
      setTimeout(() => {
        this.setUpSocket();
      }, 3000);
    };
  }
  handleMessage(obj: any) {
    if (obj.width && obj.height) {
      this.drawGrid(obj.width, obj.height);
    }
    if (obj.board) {
      this.all = obj.board as Square[];
      this.handleNewBoard(obj.board as Square[]);
      // sout("gametick:" + obj.gametick);
      if (obj.gametick) {
        this.gametick = obj.gametick;
      }
      // sout("all has been set to:", this.all);
    }
  }
  handleNewBoard(squares: Square[]) {
    this.currentHeroList = [];
    for (let i = 0; i < squares.length; i++) {
      const sq = squares[i];
      const g = this.grid[sq.y][sq.x];
      if (sq.heroes.length > 0) {
        // sout("square has heroes: i,j: " + sq.y, sq.x, sq.heroes);
      }
      // Array.prototype.splice.apply(arr, [0, anotherArr.length].concat(anotherArr));
      // g.heroes = sq.heroes;
      this.currentHeroList.push(...sq.heroes);
      g.heroes.splice(0, g.heroes.length, ...sq.heroes);
      g.items.splice(0, g.items.length, ...sq.items);
    }
  }
  drawHeroes() {}
  drawGrid(width: number, height: number) {
    // sout("drawing grid");
    this.grid = new Array(height);
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array(width);
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j] = new GameSquareContent(i, j);
      }
    }
  }
}
</script>
<style scoped>
canvas {
  border: 1px solid green;
  background: black;
}
.nopad {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
