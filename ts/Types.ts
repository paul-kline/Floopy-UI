export interface Square {
  x: number;
  y: number;
  heroes: Hero[];
  items: Item[];
}
export interface Hero {
  hp: number;
  maxHp: number;
  kills: number;
  maxDamage: number;
  inventorySize: number;
  color: string;
  name: string;
  type: string;
  x: number;
  y: number;
}
export interface Item {
  name: string;
  type: string;
  color: string;
}
