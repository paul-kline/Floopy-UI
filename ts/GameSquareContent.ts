import { Hero, Item } from "./Types";

export default class GameSquareContent {
  heroes: Hero[] = [];
  items: Item[] = [];
  x: number = -1;
  y: number = -1;
  constructor(i: number, j: number) {
    this.x = j;
    this.y = i;
  }
}
