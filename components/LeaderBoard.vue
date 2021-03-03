<template>
  <div class="main ma-3 pa-3">
    <h3>LeaderBoard</h3>
    <v-data-table
      v-if="heroes && heroes.length>0"
      :headers="headers"
      :items="heroes"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Square, Hero, Item } from "~/ts/Types";
import GameSquareContent from "~/ts/GameSquareContent";
const sout = console.log;
@Component
export default class CanvasSquare extends Vue {
  @Prop() heroes!: Hero[];
  headers: any[] = [
    { text: "Name", value: "name" },
    { text: "HP remaining", value: "hp" },
    { text: "Type", value: "type" },
    { text: "Kills", value: "kills" },
    { text: "X", value: "x" },
    { text: "Y", value: "y" }
  ];
}
</script>
<style scoped>
.main {
  border: 1px solid white;
  border-radius: 6px;
}
</style>
