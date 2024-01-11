<script lang="ts">
import { shell } from "electron";
import path from "node:path";
import { defineComponent } from "vue";
import { useStashStore } from "../../stores/auras";
import { useStopMotionStore } from "../../stores/stopmotion";
import {
  StopMotionTemplate,
  deflate,
  encode,
  generateUniqueID,
  serialize,
} from "@/libs/stopmotion";

export default defineComponent({
  name: "StopMotionResult",
  setup() {
    const { result, gif } = useStopMotionStore();
    const stash = useStashStore();
    return {
      gif,
      result,
      stash,
    };
  },
  computed: {
    weakauras_string() {
      const SMtemplate = Object.assign({}, StopMotionTemplate);
      SMtemplate.d.id = `StopMotion ${this.gif.meta.name}`;
      SMtemplate.d.foregroundTexture = this.stopMotionInput;
      SMtemplate.d.backgroundTexture = this.stopMotionInput;
      SMtemplate.d.uid = generateUniqueID();

      if (this.gif.tenor === true) {
        SMtemplate.d.tenorID = this.gif.tenorID;
      } else {
        delete SMtemplate.d.tenorID;
      }
      const serialized = serialize(SMtemplate);
      const compressed = deflate(serialized);
      const encoded = encode(compressed);
      return `!WA:1!${encoded}`;
    },
    stopMotionInput() {
      return path.join(
        "Interface",
        "AddOns",
        "WeakAurasCompanion",
        "animations",
        path.parse(this.result.destination).base,
      );
    },
    resultFolder() {
      return (
        path.join("Interface", "AddOns", "WeakAurasCompanion", "animations") +
        path.sep
      );
    },
    resultFile() {
      return path.parse(this.result.destination).base;
    },
    preview() {
      return `data:image/png;base64, ${this.result.preview}`;
    },
  },
  mounted() {
    this.stash.add({
      slug: `StopMotion ${this.gif.meta.name}`,
      name: `StopMotion ${this.gif.meta.name}`,
      author: "WeakAuras Companion",
      wagoVersion: 1,
      wagoSemver: "1.0.0",
      auraType: "WeakAuras",
      source: "WeakAuras Companion",
      encoded: this.weakauras_string,
      logo: "Interface\\AddOns\\WeakAuras\\Media\\Textures\\logo_64_nobg.tga",
    });
    console.log(`added aura to stash: "${this.gif.meta.name}"`);
  },
  methods: {
    openDestDir() {
      shell.openPath(path.parse(this.result.destination).dir);
    },
    openDestFile() {
      shell.openPath(this.result.destination);
    },
  },
});
</script>

<template>
  <div id="StopMotionResult">
    <div class="flex flex-col justify-center gap-2 text-center align-middle">
      <img
        :src="preview"
        class="h-xs w-full object-contain"
      />
      <div class="text-center">
        {{
          $t("app.stopmotion.auraready" /*  WeakAuras is Ready For Install */)
        }}
        <i
          v-tooltip="{
            content:
              '<img width=&quot;300px=&quot; src=&quot;src/assets/ready-for-install-example.png&quot; />',
            html: true,
            strategy: 'fixed',
            theme: 'info-tooltip',
          }"
          class="i-mdi-help-circle"
          >help</i
        >
        <div class="glow my-4">
          {{
            $t("app.stopmotion.restartwow2" /*  Restart World of Warcraft */)
          }}
        </div>
      </div>
      <div class="filename">
        <a
          class="mt-5 cursor-pointer font-size-3 text-brand-accent font-semibold hover:underline"
          :title="$t('app.config.backup.openfolder' /* Open Folder */)"
          @click="openDestDir()"
          >{{ resultFolder }}</a
        >
        <a
          class="mt-5 cursor-pointer font-size-3 text-brand-accent font-semibold hover:underline"
          :title="$t('app.config.backup.openfile' /* Open File */)"
          @click="openDestFile()"
          >{{ resultFile }}</a
        >
      </div>
    </div>
  </div>
</template>
