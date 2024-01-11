<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  inheritAttrs: false,
  props: {
    value: { type: [String, Number, Object], default: "" },
    options: {
      type: [Array, Object],
      default() {
        return [];
      },
    },
    label: { type: [String, null], default: null },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["update:value", "change"],
  data() {
    return {
      selected:
        this.value === ""
          ? this.placeholder ||
            this.$t("app.dropdown.placeholder" /* Select... */)
          : this.getLabel(this.value),
      showMenu: false,
      height: this.options.length * 30,
    };
  },
  watch: {
    value() {
      this.selected =
        this.value === ""
          ? this.placeholder ||
            this.$t("app.dropdown.placeholder" /* Select... */)
          : this.getLabel(this.value);
    },
    options() {
      this.height = this.options.length * 30;
    },
  },
  methods: {
    toggleDropdown() {
      this.showMenu = !this.showMenu;
    },
    selectItem(option) {
      this.showMenu = false;
      this.selected = option.text;
      this.$emit("update:value", option.value);
      this.$emit("change");
    },
    getLabel(value) {
      const index = this.options.findIndex((option) => option.value === value);

      if (index === -1) return value;
      return this.options[index].text;
    },
  },
});
</script>

<template>
  <div class="dropdown">
    <label
      v-if="label"
      class="dropdown__label text-brand-grey-lightest"
      >{{ label }}</label
    >
    <div
      class="dropdown__toggle hover:bg-brand-grey-darkest"
      :class="{ 'dropdown__toggle--toggled': showMenu }"
      @click="toggleDropdown()"
    >
      <span>{{ getLabel(selected) }}</span>
      <i
        :class="{ open: showMenu }"
        class="i-mdi-keyboard-arrow-down text-2xl"
        >keyboard_arrow_down</i
      >
    </div>
    <div
      :style="{ height: showMenu ? `${height}px` : '0px' }"
      :class="{ 'dropdown__options--toggled': showMenu }"
      class="dropdown__options"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="dropdown__option hover:bg-brand-grey-darkest"
        :title="option.text"
        @click="selectItem(option)"
      >
        <span>{{ option.text }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="css">
:root {
  --button-color-bg: #101010;
  --border-color-separate: #0d0d0d;
  --highlight-color-text: #ffffff;
  --text-color: #e6e6e6;
  --border-color: #2c2c2c;
  --border-color-expand: #2c2c2c;
  --max-width: 230px;
  --min-width: 140px;
}

.dropdown {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  width: var(--max-width);
  margin: 10px 4px 10px 0;
}

.dropdown__label {
  font-size: 15px;
  z-index: 1;
  position: relative;
}

.dropdown__toggle {
  z-index: 1;
  position: relative;
  width: 100%;
  min-width: var(--min-width);
  max-width: var(--max-width);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  height: 30px;
  background: var(--button-color-bg);
  padding: 5px 30px 5px 10px;
  margin-top: 5px;
  margin-left: 5px;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition:
    border-color 0.3s ease-in-out,
    border-radius 0.3s cubic-bezier(1, -0.21, 1, -1.65);
}

.dropdown__toggle--toggled {
  border-radius: 4px 4px 0 0;
  border-color: var(--border-color-expand);
  border-bottom-color: transparent;
  transition: border-radius 0.3s cubic-bezier(0, 1.95, 0, 1.93);
}

.dropdown__toggle:hover {
  color: var(--highlight-color-text);
}

.dropdown__toggle i {
  position: absolute;
  top: 3px;
  right: 4px;
  display: inline-block;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.dropdown__toggle i.open {
  transform: rotate(180deg);
}

.dropdown__toggle span {
  cursor: pointer;
}

.dropdown__options {
  width: 100%;
  position: absolute;
  cursor: pointer;
  border-radius: 0 0 4px 4px;
  max-width: var(--max-width);
  background: var(--button-color-bg);
  transition:
    height 0.3s ease-in-out,
    border-color 0.2s ease-in-out;
  overflow: hidden;
  border: 1px solid transparent;
  margin-left: 5px;
  opacity: 0;
}

.dropdown__options--toggled {
  opacity: 1;
  border-color: var(--border-color-expand);
  border-top-color: var(--border-color-separate);
}

.dropdown__option {
  cursor: pointer;
  z-index: 50;
  background-color: black;
  width: 100%;
  height: 30px;
  padding: 5px 25px 5px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown__option:last-child {
  border-radius: 0 0 4px 4px;
}

.dropdown__option span {
  cursor: pointer;
  padding: 0 5px;
}
</style>
