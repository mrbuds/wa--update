<script lang="ts">
import { ipcRenderer } from "electron";
import { defineComponent } from "vue";

export default defineComponent({
  name: "FileSelect",
  props: {
    path: {
      type: String,
      default: "",
      required: false,
    },
    createDirectory: {
      type: Boolean,
      default: false,
    },
    defaultPath: {
      type: String,
      default: "",
    },
    openDirectory: {
      type: Boolean,
      default: false,
    },
    openFile: {
      type: Boolean,
      default: false,
    },
    filters: {
      type: Array,
      default: () => [],
    },
    dragndrop: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:path"],
  data() {
    return {
      dialogOpen: false,
    };
  },
  methods: {
    async handleInputClick() {
      if (!this.dialogOpen) {
        this.dialogOpen = true;

        const dialogOptions = {
          properties: [],
          defaultPath: this.path || this.defaultPath,
          filters: [],
        };

        if (this.openDirectory) {
          dialogOptions.properties.push("openDirectory");
        }

        if (this.openFile) {
          dialogOptions.properties.push("openFile");
        }

        if (this.createDirectory) {
          dialogOptions.properties.push("createDirectory");
        }

        if (this.filters) {
          dialogOptions.filters = this.filters;
        }

        ipcRenderer
          .invoke("openDialog", dialogOptions)
          .then((result) => {
            if (result.filePaths && result.filePaths.length) {
              this.$emit("update:path", result.filePaths[0]);
            }
          })
          .catch((error) => {
            console.error(error);
          });
        this.dialogOpen = false;
      }
    },
    drop(event) {
      if (this.dragndrop === true) {
        event.preventDefault();

        this.$emit("update:path", event.dataTransfer.files[0].path);
      }
    },
  },
});
</script>

<template>
  <div
    v-if="dragndrop"
    class="cursor-pointer border-2 border-brand-accent rounded-md border-dotted p-5 pl-50 pr-50 text-center"
    @dragenter.prevent
    @dragover.prevent
    @drop="drop"
    @click="handleInputClick"
  >
    <label class="file-select">
      <span class="flex flex-col items-center justify-center gap-5">
        <slot />
      </span>
    </label>
  </div>
  <label
    v-else
    class="file-select"
    @click="handleInputClick"
  >
    <span>
      <p class="text-brand-grey-lightest">
        <slot />
      </p>
      <div
        class="fakeinput ml-1.5 mr-0.5 mt-2 h-7.5 w-67.5 inline-table table-fixed cursor-pointer whitespace-nowrap border-1 border-brand-grey-dark rounded-md border-solid bg-brand-grey-darkest px-7.5 py-1.5 pl-2.5 text-sm text-brand-grey-lightest hover:bg-brand-grey-darker hover:text-brand-grey-lightest"
      >
        <span
          class="wow-path table-cell overflow-hidden text-ellipsis align-middle"
          >{{ path }}</span
        >
      </div>
      <i class="i-mdi-settings ml-1 mt-3 cursor-pointer text-2xl">settings</i>
    </span>
  </label>
</template>

<style scoped lang="css">
/* Don't forget to hide the original file input! */
.file-select > input[type="file"] {
  display: none;
}

.fakeinput:hover {
  transition: all 0.1s ease-in-out;
}

.wow-path:empty::before {
  content: "\00a0";
}
</style>
