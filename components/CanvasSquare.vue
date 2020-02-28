<template>
  <v-tooltip left>
    <template v-slot:activator="{ on }">
      <canvas class="nopad" ref="canvas" v-on="on"></canvas>
    </template>
    <span v-html="tooltip"></span>
  </v-tooltip>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Square, Hero, Item } from "~/ts/Types";
import GameSquareContent from "~/ts/GameSquareContent";
const sout = console.log;
@Component
export default class CanvasSquare extends Vue {
  @Prop() width!: number;
  @Prop() height!: number;
  @Prop() gametick!: number;
  @Prop() bordercolor!: string;
  @Prop() gamesquarecontent!: GameSquareContent;
  canvas!: HTMLCanvasElement;
  c!: CanvasRenderingContext2D;
  tooltip: string = "";
  mounted() {
    this.setUpCanvas();
    sout("gamesquarecontent:", this.gamesquarecontent);
    // this.drawGrid(10, 10);
    this.tooltip = `x: ${this.gamesquarecontent.x}, y:${this.gamesquarecontent.y}`;
  }

  calcTipText(): string {
    const heroes = this.heroes;
    const items = this.items;
    let str = `x: ${this.gamesquarecontent.x}, y:${this.gamesquarecontent.y}`;
    if (heroes.length > 0) {
      str += "<br>Heroes: <br>";
      for (let i = 0; i < heroes.length; i++) {
        const hero = heroes[i];
        str += hero.name;
        str += "<br>hp: " + hero.hp + "/" + hero.maxHp;
        if (hero.enemy) {
          str += "<br> fighting: " + hero.enemy;
        }
        str += "<hr>";
      }
    }
    if (items.length > 0) {
      str += "<br>Items: ";
      for (let i = 0; i < items.length; i++) {
        str += "<br>" + items[i].name;
      }
    }
    return str;
  }
  get heroes(): Hero[] {
    return this.gamesquarecontent.heroes;
  }
  get items(): Item[] {
    return this.gamesquarecontent.items;
  }
  @Watch("gametick")
  gametickchanged(newnum: number, oldnum: number) {
    // sout("game tick changed");
    setTimeout(this.drawHeroes, 0);
    setTimeout(this.drawItems, 0);
    this.tooltip = this.calcTipText();
  }
  drawHeroes(heroes: Hero[] = this.heroes) {
    const c = this.c;
    const heroWidth = Math.min(
      this.canvas.width / this.heroes.length,
      this.canvas.width / 2
    );
    const height = this.canvas.height / 2;
    c.clearRect(0, 0, c.canvas.width, height);

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
  drawItems(items: Item[] = this.items) {
    const c = this.c;
    const itemWidth = Math.min(
      this.canvas.width / items.length,
      this.canvas.width / 2
    );
    const height = this.canvas.height / 2;
    c.clearRect(0, height, c.canvas.width, height);

    let x = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // const color = this.getColor(hero);
      const color = item.color;
      c.fillStyle = color;
      c.strokeStyle = "white";
      //draw the item:
      const triangle = new Path2D();
      // c.beginPath();

      triangle.moveTo(x + itemWidth / 2, height);

      triangle.lineTo(x, this.canvas.height);
      triangle.lineTo(x + itemWidth, this.canvas.height);
      // c.lineTo(x + itemWidth / 2, height);

      triangle.closePath();

      c.fill(triangle);
      c.stroke(triangle);

      x += itemWidth;
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
