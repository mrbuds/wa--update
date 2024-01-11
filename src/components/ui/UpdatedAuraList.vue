<script lang="js">
import { defineComponent } from "vue";
import { useStashStore } from "../../stores/auras";
import UIButton from "./UIButton.vue";
import Aura from "./Aura.vue";

export default defineComponent({
  components: { UIButton, Aura },
  setup() {
    const stash = useStashStore();

    return {
      stash,
    };
  },
  methods: {
    close() {
      this.$parent.toggleUpdatedAuraList();
    },
    clearList(event) {
      event.preventDefault();
      event.stopPropagation();
      this.stash.$reset();
      this.$parent.toggleUpdatedAuraList();
    },
  },
});
</script>

<template>
  <div
    id="updatedAuraList"
    class="absolute h-full w-full bg-black bg-opacity-70 text-center"
    @click="close"
  >
    <div
      class="relative top-1/3 mx-auto w-9/10 rounded-md bg-black bg-opacity-30 p-4 pb-6"
    >
      <h1 class="mb-8 text-gray-200">
        {{ $t("app.updatedAuraList.title" /* Ready to install */) }}
      </h1>
      <div class="w-full">
        <Aura
          v-for="aura in stash.auras"
          :key="aura.slug"
          :aura="aura"
        />
      </div>
      <div class="mt-4">
        <UIButton
          type="reset"
          @click="clearList"
        >
          Clear list
        </UIButton>
      </div>
    </div>
  </div>
</template>
