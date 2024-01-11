<script lang="ts">
import fs from "node:fs";
import path from "node:path";
import { defineComponent } from "vue";
import { useStopMotionStore } from "../../stores/stopmotion";
import DiscordPicker from "./DiscordPicker.vue";
import FileSelect from "./FileSelect.vue";
import UIButton from "./UIButton.vue";
import gif2tga from "@/libs/gif2tga";

export default defineComponent({
  name: "StopMotionWelcome",
  components: {
    FileSelect,
    UIButton,
    DiscordPicker,
  },
  emits: ["next"],
  setup() {
    const { gif } = useStopMotionStore();
    return {
      gif,
    };
  },
  data() {
    return {
      apiKey: "NL8TDPRU0T4Y",
    };
  },
  methods: {
    async setTenor(url, title, tenorID) {
      console.log(url);

      try {
        title = title.replace(" GIF", "");
        const res = await fetch(url);
        const imageBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);
        const meta = await gif2tga.getMetaData(buffer);
        this.gif.meta.width = meta.width;
        this.gif.meta.height = meta.pageHeight;
        this.gif.meta.frames = meta.pages;
        this.gif.meta.name = title;
        this.gif.path = title;
        this.gif.tenor = true;
        this.gif.tenorID = tenorID;
        this.gif.buffer = buffer;
        this.$emit("next");
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    },
    async update(filepath) {
      if (
        filepath !== "" &&
        fs.existsSync(filepath) &&
        path.parse(filepath).ext.toLowerCase() === ".gif"
      ) {
        try {
          // check for error loading metadata
          const meta = await gif2tga.getMetaData(filepath);
          this.gif.meta.width = meta.width;
          this.gif.meta.height = meta.pageHeight;
          this.gif.meta.frames = meta.pages;
          this.gif.meta.name = path.basename(filepath);
          this.gif.path = filepath;
          this.gif.tenor = false;
          this.$emit("next");
        } catch (e) {
          console.log(JSON.stringify(e));
        }
      }
    },
  },
});
</script>

<template>
  <div id="StopMotionWelcome">
    <div class="mt-10 flex flex-col items-center justify-center gap-5">
      <FileSelect
        :create-directory="false"
        :open-file="true"
        :dragndrop="true"
        :filters="[{ name: 'Animation', extensions: ['gif'] }]"
        @update:path="update"
      >
        {{ $t("stopmotion.select.dropagif" /* Drop a GIF */) }}

        <i>{{ $t("stopmotion.select.or" /* or */) }}</i>

        <UIButton class="btn-ok">
          {{
            $t("stopmotion.select.computer" /* Choose one on your Computer */)
          }}
        </UIButton>
      </FileSelect>
      <div class="relative inline-block text-center">
        <i>{{ $t("stopmotion.select.or" /* or */) }}</i>
        <DiscordPicker
          :api-key="apiKey"
          @gif="setTenor"
        >
          <UIButton class="btn-ok">
            {{ $t("stopmotion.select.tenor" /* Choose one from Tenor */) }}
          </UIButton>
        </DiscordPicker>
      </div>
    </div>
  </div>
</template>
