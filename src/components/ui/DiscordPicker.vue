<script lang="js">
import { defineComponent } from "vue";
import GifPicker from "./GifPicker.vue";
import clickOutside from "@/libs/click-outside";

export default defineComponent({
  components: { GifPicker },
  directives: {
    clickOutside,
  },
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    apiKey: {
      type: String,
      default: null,
    },
  },
  emits: ["gif"],
  data() {
    return {
      opened: false,
    };
  },
  methods: {
    close() {
      if (this.opened) {
        this.opened = false;
      }
    },
    send(url, title, tenorID) {
      // console.log(`send() ${url}`)
      this.$emit("gif", url, title, tenorID);
    },
    open() {
      this.opened = !this.opened;
    },
  },
});
</script>

<template>
  <div v-click-outside="close">
    <div>
      <div
        :class="{ 'opacity-0': !opened }"
        class="discord-picker"
      >
        <GifPicker
          v-if="opened"
          :api-key="apiKey"
          @send="({ url, title, tenorID }) => send(url, title, tenorID)"
        />
      </div>
      <div class="mt4">
        <div>
          <span @click="open">
            <slot />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.discord-picker {
  max-width: max-content;
  height: 500px;
  width: 600px;
  overflow: hidden;
  position: absolute;
  left: -150px;
  bottom: -150px;
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-duration: 200ms;
  transform: translate-y(200px);
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .discord-picker {
    width: 400px;
    height: 400px;
  }
}
</style>
