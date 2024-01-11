<script lang="ts">
import { ipcRenderer } from "electron";
import { defineComponent } from "vue";
import UIButton from "./UIButton.vue";

export default defineComponent({
  components: { UIButton },
  methods: {
    minBtn() {
      ipcRenderer.invoke("minimize");
    },
    closeBtn() {
      ipcRenderer.invoke("close");
    },
  },
});
</script>

<template>
  <div id="ui-titlebar">
    <div id="ui-titletext" />
    <div id="ui-titlecontrols">
      <UIButton
        class="ui-btn minimize"
        @click="minBtn"
      >
        <svg
          x="0px"
          y="0px"
          viewBox="0 0 10.2 1"
        >
          <rect
            x="0"
            y="50%"
            width="10.2"
            height="1"
          />
        </svg>
      </UIButton>
      <UIButton
        class="ui-btn close"
        @click="closeBtn"
      >
        <svg viewBox="0 0 10 10">
          <polygon
            points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1"
          />
        </svg>
      </UIButton>
    </div>
  </div>
</template>

<style scoped lang="css">
#ui-titlebar {
  display: flex;
  position: fixed;
  float: right;
  top: 0;
  right: 0;
  width: 100px;
  height: 28px;
  margin-left: auto;
  user-select: none;
  cursor: default;
  z-index: 999;
  border-radius: 8px;
  -webkit-app-region: no-drag;
}

#ui-titletext {
  max-height: 12px;
  flex: auto;
  color: #ffffff;
  text-indent: 10px;
}

#ui-titlecontrols {
  max-width: 144px;
  max-height: 28px;
  text-align: right;
}

#ui-titlecontrols .ui-btn {
  margin: 0;
  width: 40px;
  height: 100%;
  border: 0;
  border-radius: 0 8px 0 0;
  outline: 0;
  background: transparent;
}

#ui-titlecontrols .ui-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

#ui-titlecontrols .ui-btn.close:hover {
  background: #e81123;
}

#ui-titlecontrols .ui-btn svg {
  width: 9px;
  height: 9px;
}

#ui-titlecontrols .ui-btn svg path,
#ui-titlecontrols .ui-btn svg rect,
#ui-titlecontrols .ui-btn svg polygon {
  fill: #ffffff;
}

#ui-titlecontrols .ui-btn:first-child {
  border-radius: 0;
}
</style>
