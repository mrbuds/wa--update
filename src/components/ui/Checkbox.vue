<script lang="ts">
export default {
  name: "Checkbox",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    triggerInputClick() {
      (this.$refs.checkbox as HTMLInputElement).click();
    },
  },
};
</script>

<template>
  <div
    class="checkbox"
    @click="triggerInputClick"
  >
    <input
      ref="checkbox"
      type="checkbox"
      :checked="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
    />
    <div
      class="checkbox__box border border-brand-grey-dark border-solid bg-brand-grey-darkest hover:border-brand-grey-dark hover:border-brand-grey-darker"
      :class="{ 'checkbox__box--checked': modelValue }"
    />
    <label>
      <slot />
    </label>
  </div>
</template>

<style scoped lang="css">
input[type="checkbox"] {
  display: none;
}

input[type="checkbox"]:disabled + .checkbox__box {
  background-color: #dddddd;
  box-shadow: none;
  cursor: auto;
}

input[type="checkbox"] + .checkbox__box:focus {
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
}

.checkbox {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  user-select: none;
  margin-top: 10px;
}

.checkbox__box {
  border-radius: 2px;
  height: 20px;
  margin-right: 10px;
  width: 20px;
}

.checkbox__box--checked {
  background-color: #191919;
  background-image: url("../../assets/checkmark.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 15px;
}
</style>
