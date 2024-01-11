<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UIButton",
  props: {
    type: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
  },
});
</script>

<template>
  <button
    class="btn rounded-md"
    :class="[
      { 'btn-default': type === 'info' },
      { 'btn-positive': type === 'ok' },
      { 'btn-negative': type === 'error' },
      { 'btn-mini': size === 'mini' },
      { 'btn-menu': type === 'menu' },
      { 'btn-refresh': type === 'refresh' },
      { 'btn-issue': type === 'issue' },
      { 'btn-reset': type === 'reset' },
      { 'btn-link': type === 'link' },
      { 'btn-addon': type === 'addon' },
    ]"
    :title="title"
  >
    <slot />
  </button>
</template>

<style lang="css">
.btn {
  font-family: inherit;
  display: inline-block;
  padding: 3px 8px;
  font-size: 12px;
  height: 25px;
  line-height: 1.4;
  text-align: center;
  white-space: nowrap;
  vertical-align: top;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);
  background-color: #e6e6e6;
  color: #101010;
}

.btn-ok {
  display: inline-block;
  padding: 0px 8px;
  font-size: 12px;
  height: 26px;
  line-height: 26px;
  cursor: pointer;
  border-radius: 4px;
  background-color: rgba(18, 18, 18, 0.95);
  border: 1px solid #ffffff;
  color: #ffffff;
  font-weight: 600;
  vertical-align: middle;
  margin-top: -2px;
  margin-left: 6px;
}

.btn-ok:hover {
  background-color: #ffffff;
  color: #2d2c2c;
  transition: all 0.1s ease-in-out;
}

.btn:focus {
  outline: none;
  box-shadow: none;
}

.btn-large {
  padding: 6px 12px;
}

.btn-issue,
.btn-refresh {
  background-color: rgba(18, 18, 18, 0.95);
  border: 1px solid #ffffff;
  padding: 15px;
  height: 60px;
  font-size: 16px;
  color: #ffffff;
  font-weight: 600;
  vertical-align: top;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
}

.btn-refresh:hover {
  background-color: #ffffff;
  color: #2d2c2c;
}

.btn-addon {
  background-color: rgba(18, 18, 18, 0.95);
  border: 1px solid #2c2c2c;
  height: 30px;
  font-size: 14px;
  color: #e6e6e6;
  font-weight: 600;
  vertical-align: top;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
  text-align: center;
  margin-right: 4px;
  padding: 0 10px;
}

.btn-addon:hover {
  background-color: #ffffff;
  color: #2d2c2c;
}

.btn-addon.active {
  background-color: #ffffff;
  color: #1a1a1a;
}

.btn-addon:disabled {
  background-color: rgba(36, 36, 36, 0.95);
  color: #6e6e6e;
  cursor: default;
}

.btn-menu {
  width: 60px;
  height: auto;
  color: #333333;
  border-top-color: #c2c0c2;
  border-right-color: #c2c0c2;
  border-bottom-color: #a19fa1;
  border-left-color: #c2c0c2;
  background-color: #757474;
}

.btn-menu:hover {
  background-color: #dddddd;
}

.btn-mini {
  padding: 2px 6px;
  width: 18px;
  height: 18px;
  color: transparent;
}

.btn-default {
  color: #333333;
  border-top-color: #c2c0c2;
  border-right-color: #c2c0c2;
  border-bottom-color: #a19fa1;
  border-left-color: #c2c0c2;
  background-color: #fcfcfc;
}

.btn-default:active {
  background-color: #dddddd;
  background-image: none;
}

.btn-primary {
  border-color: #388df8;
  border-bottom-color: #0866dc;
  background-color: #6eb4f7;
}

.btn-primary:active {
  background-color: #3e9bf4;
}

.btn-positive {
  border-color: #023008;
  border-radius: 2px;
  background-size: contain;
}

.btn-positive:active {
  background-color: #34c84a;
}

.btn-negative {
  border-color: #b61b15;
  border-bottom-color: #fb1710;
  background-size: contain;
}

.btn-negative:active {
  background-color: #ff5b56;
}

.btn-reset {
  background-color: #a80000;
  color: #ffffff;
  height: 30px;
}

.btn-reset:hover {
  background-color: #f30707;
}

.btn-link {
  background: #171717;
}

.btn-link:hover {
  background: #101010;
}
</style>
