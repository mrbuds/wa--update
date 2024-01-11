<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AuraHeaders",
  props: {
    sortedColumn: {
      type: String,
      required: true,
    },
    sortDescending: Boolean,
    addonSelectedConfig: { type: Object, default: null },
  },
  emits: ["sortBy"],
});
</script>

<template>
  <div class="m-0 mb-2.5 flex flex-row text-left text-sm">
    <div
      class="sortable flex-1 cursor-pointer pl-8"
      :class="{
        'sorted': sortedColumn === 'name',
        'sort-desc': sortDescending,
      }"
      @click="() => $emit('sortBy', 'name')"
    >
      {{ $t("app.aura.name" /* Name */) }}
      <span class="sort-icon i-mdi-arrow-down text-xl">arrow_downward</span>
    </div>
    <div
      class="sortable cursor-pointer pr-2"
      :class="{
        'sorted': sortedColumn === 'update',
        'sort-desc': sortDescending,
      }"
      @click="() => $emit('sortBy', 'update')"
    >
      {{ $t("app.aura.update" /* Updates */) }}
      <span class="sort-icon i-mdi-arrow-down text-xl">arrow_downward</span>
    </div>
    <div
      v-if="addonSelectedConfig && addonSelectedConfig.hasTypeColumn"
      class="sortable cursor-pointer pl-2.5 pr-5"
      :class="{
        'sorted': sortedColumn === 'auraTypeDisplay',
        'sort-desc': sortDescending,
      }"
      @click="() => $emit('sortBy', 'auraTypeDisplay')"
    >
      {{ $t("app.aura.auraType" /* Type */) }}
      <span class="sort-icon i-mdi-arrow-down text-xl">arrow_downward</span>
    </div>
    <div
      class="sortable cursor-pointer pl-2.5 pr-8"
      :class="{
        'sorted': sortedColumn === 'author',
        'sort-desc': sortDescending,
      }"
      @click="() => $emit('sortBy', 'author')"
    >
      {{ $t("app.aura.author" /* Author */) }}
      <span class="sort-icon i-mdi-arrow-down text-xl">arrow_downward</span>
    </div>
    <div
      class="sortable cursor-pointer pl-2.5 pr-16"
      :class="{
        'sorted': sortedColumn === 'version',
        'sort-desc': sortDescending,
      }"
      @click="() => $emit('sortBy', 'version')"
    >
      {{ $t("app.aura.version" /* Version */) }}
      <span class="sort-icon i-mdi-arrow-down text-xl">arrow_downward</span>
    </div>
  </div>
</template>

<style scoped lang="css">
.sortable:hover .sort-icon {
  opacity: 0.86 !important;
}

.sorted .sort-icon {
  opacity: 0.86 !important;
}

.sort-desc .sort-icon {
  transform: rotate(180deg);
  padding-bottom: 0px;
  padding-top: 2px;
}

.sort-icon {
  opacity: 0;
  font-size: 14px;
  vertical-align: middle;
  padding-bottom: 2px;
}
</style>
