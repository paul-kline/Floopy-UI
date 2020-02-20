<template>
  <canvas class="nopad" ref="canvas"></canvas>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Square, Hero, Item } from "~/ts/Types";
const sout = console.log;
@Component
export default class CanvasSquare extends Vue {
  @Prop() width!: number;
  @Prop() height!: number;
  @Prop() x!: number;
  @Prop() y!: number;
  @Prop() bordercolor!: string;
  @Prop() all: Square[] = [];
  canvas!: HTMLCanvasElement;
  c!: CanvasRenderingContext2D;
  mounted() {
    this.setUpCanvas();
    // this.drawGrid(10, 10);
  }
  get mySquare(): Square | undefined {
    return this.all.find(v => v.x == this.x && v.y == this.y);
  }
  get heroes(): Hero[] {
    const sq = this.mySquare;
    return sq ? sq.heroes : [];
  }
  @Watch("heroes")
  onPropertyChanged(newHeroes: Hero[], oldValue: Hero[]) {
    // sout("my heroes changed: ", newHeroes);
    this.drawHeroes(newHeroes);
  }
  drawHeroes(heroes: Hero[] = this.heroes) {
    const c = this.c;
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    const heroWidth = Math.min(
      this.canvas.width / this.heroes.length,
      this.canvas.width / 2
    );
    const height = this.canvas.height / 2;
    const healthHeight = height / 4;
    let x = 0;
    for (let i = 0; i < heroes.length; i++) {
      const hero = this.heroes[i];
      // const color = this.getColor(hero);
      const color = hero.color;
      //draw the fellow:
      c.fillStyle = color;
      c.fillRect(x, 0, heroWidth, height);
      c.strokeStyle = "white";
      c.strokeRect(x, 0, heroWidth, height);
      //draw the health
      c.fillStyle = "red";
      c.fillRect(x, 0, heroWidth, healthHeight);
      c.fillStyle = "green";
      const healthleft = (hero.hp / hero.maxHp) * heroWidth;
      c.fillRect(x, 0, healthleft, healthHeight);
      x += heroWidth;
    }
  }
  // getColor(hero: Hero) {
  //   switch (hero.type) {
  //     case "healer":
  //       return "dark-green";
  //     case "tanker":
  //       return "brown";
  //     default:
  //       return "pink";
  //   }
  // }
  drawGrid(width: number, height: number) {
    const w = this.canvas.width / width;
    const ch = this.canvas.height;
    const h = ch / height;
    const c = this.c;
    let x = 0;
    let y = 0;
    c.moveTo(x, y);
    c.strokeStyle = "white";
    while (x < this.canvas.width) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, ch);
      c.stroke();
      x += w;
    }
    while (y < this.canvas.height) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(x, ch);
      c.stroke();
      x += w;
    }
  }
  setUpCanvas() {
    this.canvas = this.$refs["canvas"] as HTMLCanvasElement;
    this.c = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    // sout("context is", this.c);
    const c = this.c;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.border = `1px solid ${this.bordercolor || "white"}`;
  }
}
</script>
<style scoped>
canvas {
  background: black;
}
.nopad {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
