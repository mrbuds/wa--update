<script lang="js">
import { defineComponent } from "vue";
import UIButton from "./UIButton.vue";

export default defineComponent({
  components: { UIButton },
  methods: {
    close() {
      this.$parent.toggleReport();
    },
  },
});
</script>

<template>
  <div
    id="report"
    class="absolute z-75 h-full w-full bg-black bg-opacity-70 text-center"
    @click="close"
  >
    <div
      class="relative top-1/3 mx-auto w-96 rounded-lg bg-black bg-opacity-30 p-4 pb-6"
    >
      <h1 class="mb-8 text-gray-200">
        {{ $t("app.report.title" /* Report a bug */) }}
      </h1>
      <div class="links">
        <UIButton
          type="link"
          class="mx-auto mt-2 block h-10 w-48 p-0 transition-colors duration-200 ease-in-out"
        >
          <a
            href="https://github.com/WeakAuras/WeakAuras-Companion/issues/new?template=bug_report.md"
            target="_blank"
            class="block h-full w-full bg-cover text-lg text-gray-200 leading-9"
          >
            {{ $t("app.report.companion" /* Companion */) }}
          </a>
        </UIButton>
        <UIButton
          type="link"
          class="mx-auto mt-2 block h-10 w-48 p-0 transition-colors duration-200 ease-in-out"
        >
          <a
            href="https://github.com/WeakAuras/WeakAuras2/issues/new"
            target="_blank"
            class="block h-full w-full bg-cover text-lg text-gray-200 leading-9"
          >
            {{ $t("app.report.addon" /* AddOn */) }}
          </a>
        </UIButton>
      </div>
    </div>
  </div>
</template>
