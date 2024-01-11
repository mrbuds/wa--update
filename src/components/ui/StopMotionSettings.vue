<script>
import path from "node:path";
import { defineComponent } from "vue";
import { useConfigStore } from "../../stores/config";
import { useStopMotionStore } from "../../stores/stopmotion";
import UIButton from "./UIButton.vue";
import Checkbox from "./Checkbox.vue";
import Dropdown from "./Dropdown.vue";
import gif2tga from "@/libs/gif2tga";

export default defineComponent({
  name: "StopMotionSettings",
  components: {
    UIButton,
    Checkbox,
    Dropdown,
  },
  props: {
    wowVersions: {
      type: Array,
      required: true,
    },
  },
  emits: ["next"],
  setup() {
    const config = useConfigStore();
    const { gif, result } = useStopMotionStore();
    gif.settings.wowVersion = config.wowpath.version;
    return {
      config,
      gif,
      result,
    };
  },
  watch: {
    "gif": {
      handler() {
        this.calc();
      },
      deep: true,
    },
    "gif.settings.wowVersion": function () {
      this.config.wowpath.version = this.gif.settings.wowVersion;
    },
  },
  mounted() {
    if (this.gif.tenor) {
      this.gif.settings.coalesce = true;
    }

    this.auto_scaling();
    this.calc();
  },
  methods: {
    auto_scaling() {
      try {
        for (let scaling = 1; scaling > 0; scaling = scaling - 0.01) {
          const { size } = gif2tga.calculateFileSize(
            this.gif.meta.width,
            this.gif.meta.height,
            this.gif.meta.frames,
            scaling,
            this.gif.settings.skips,
            this.gif.settings.skips_value,
          );

          if (size / 1024 <= 16) {
            this.gif.settings.scaling = scaling;
            break;
          }
        }
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    },
    calc() {
      try {
        const info = gif2tga.calculateFileSize(
          this.gif.meta.width,
          this.gif.meta.height,
          this.gif.meta.frames,
          this.gif.settings.scaling,
          this.gif.settings.skips,
          this.gif.settings.skips_value,
        );
        this.result.cols = info.cols;
        this.result.rows = info.rows;
        this.result.height = info.height;
        this.result.width = info.width;
        this.result.height = info.height;
        this.result.frames = info.frames;
        this.result.size = info.size;
        const frameWidth = Math.floor(
          this.gif.meta.width * this.gif.settings.scaling,
        );
        const frameHeight = Math.floor(
          this.gif.meta.height * this.gif.settings.scaling,
        );
        const prefix = path.parse(this.gif.meta.name).name;
        const filename = `${prefix}.x${info.rows}y${info.cols}f${info.frames}w${frameWidth}h${frameHeight}W${info.width}H${info.height}.tga`;

        this.result.destination = path.join(
          this.config.wowpath.value,
          this.gif.settings.wowVersion,
          "Interface",
          "AddOns",
          "WeakAurasCompanion",
          "animations",
          filename,
        );

        this.result.computing = false;
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    },
    async generate() {
      if (this.result.size / 1024 > 16) {
        console.error(
          "File will be too big with this settings, reduce scaling and/or skip frames",
        );
      } else {
        this.result.computing = true;

        try {
          const { destFile, preview } = await gif2tga.convert(
            this.gif.path,
            this.gif.settings.scaling,
            this.gif.settings.coalesce,
            this.gif.settings.skips,
            this.gif.settings.skips_value,
            path.join(
              this.config.wowpath.value,
              this.gif.settings.wowVersion,
              "Interface",
              "AddOns",
              "WeakAurasCompanion",
              "animations",
            ),
            this.gif.tenor ? this.gif.buffer : undefined,
          );
          this.result.computing = false;
          this.result.destination = destFile;
          this.result.preview = preview;
          this.$emit("next");
        } catch (e) {
          console.log(JSON.stringify(e));
          this.result.computing = false;
          this.result.fileCreated = false;
          console.error("error");
        }
      }
    },
  },
});
</script>

<template>
  <div id="StopMotionSettings">
    <div
      v-if="!gif.tenor"
      class="config-row"
    >
      <div class="config-row-item">
        <div class="title">
          {{ $t("app.stopmotion.fileinformation" /* File Information */) }}
        </div>
        <div class="block">
          {{ $t("app.stopmotion.name" /* Name */) }}: {{ gif.meta.name }}<br />
          {{ $t("app.stopmotion.size" /* Size */) }}: {{ gif.meta.width }}px x
          {{ gif.meta.height }}px<br />
          {{ $t("app.stopmotion.frames" /* Frames */) }}: {{ gif.meta.frames
          }}<br />
        </div>
      </div>
      <div class="config-row-item">
        <div class="title">
          {{ $t("app.stopmotion.destination" /* Destination */) }}
        </div>
        <div class="block">
          <div>
            <Dropdown
              v-model:value="gif.settings.wowVersion"
              :options="wowVersions"
              :label="$t('app.wowpath.version' /* Version */)"
            />
          </div>
        </div>
      </div>
      <div class="config-row-item">
        <div class="title">
          {{ $t("app.stopmotion.output.settings" /* Output Settings */) }}
        </div>
        <div class="block">
          <label for="scaling">{{
            $t("app.stopmotion.scaling" /* Scaling */)
          }}</label>
          <input
            id="scaling"
            v-model="gif.settings.scaling"
            type="range"
            name="scaling"
            min="0.1"
            max="1"
            step="0.01"
          />
          {{ Math.round(gif.settings.scaling * 100) }}%
          <br />
          <Checkbox v-model="gif.settings.coalesce">
            {{ $t("app.stopmotion.coalesce" /* Coalesce (movie animation) */) }}
          </Checkbox>
          <Checkbox v-model="gif.settings.skips">
            {{ $t("app.stopmotion.skipframes" /* Skip Frames */) }}
          </Checkbox>
          <span v-if="gif.settings.skips">
            <label for="skips_value">{{
              $t("app.stopmotion.skipevery" /* Skip every */)
            }}</label>
            <input
              id="skips_value"
              v-model="gif.settings.skips_value"
              type="range"
              name="skips_value"
              min="2"
              max="10"
              step="1"
            />
            <label for="skips_value"
              >{{ gif.settings.skips_value }}
              {{ $t("app.stopmotion.frames" /* frames */) }}</label
            >
          </span>
        </div>
      </div>
      <div class="config-row-item">
        <div class="title">
          {{ $t("app.stopmotion.output.information" /* Output Information */) }}
        </div>
        <div class="block">
          <div>
            {{ $t("app.stopmotion.row.columns" /* Rows x Columns */) }}:
            {{ result.rows }} x {{ result.cols }}<br />
            {{ $t("app.stopmotion.frame.size" /* Frame Size */) }}:
            {{ Math.floor(gif.meta.width * gif.settings.scaling) }}px x
            {{ Math.floor(gif.meta.height * gif.settings.scaling) }}px<br />
            {{ $t("app.stopmotion.output.size" /* Output Size */) }}:
            {{ result.width }}px x {{ result.height }}px<br />
            {{ $t("app.stopmotion.Frames" /* Frames */) }}: {{ result.frames
            }}<br /><br />
            {{ $t("app.stopmotion.size" /* Size */) }}:
            <span
              :class="{
                'text-status-issue': result.size / 1024 > 16,
                'text-status-ok': result.size / 1024 <= 16,
              }"
              >{{ result.size / 1024 }}</span
            >
            <span v:if="result.size > 0">MB</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="gif.tenor"
      class="setting-destination-dropdown"
    >
      <Dropdown
        v-model:value="gif.settings.wowVersion"
        :options="wowVersions"
        :label="$t('app.wowpath.version' /* Version */)"
      />
    </div>
    <div id="mid">
      <UIButton
        v-if="result.size / 1024 <= 16"
        :class="{ spin: result.computing }"
        type="refresh"
        @click="generate()"
      >
        <i class="sync i-mdi-sync align-top text-3xl">sync</i>
        <span>{{
          $t(
            "app.stopmotion.generatestopMotionanimation" /* Generate StopMotion Animation */,
          )
        }}</span>
      </UIButton>
      <UIButton
        v-if="result.size / 1024 > 16"
        :class="{ spin: result.computing }"
        type="issue"
        @click="generate()"
      >
        <i
          v-if="result.size / 1024 > 16"
          class="i-mdi-error-outline align-top text-3xl text-status-issue"
          >error_outline</i
        >
        <span>{{
          $t(
            "app.stopmotion.generatestopMotionanimation" /* Generate StopMotion Animation */,
          )
        }}</span>
      </UIButton>
    </div>
  </div>
</template>

<style scoped lang="css">
.setting-destination-dropdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
}

#mid {
  text-align: center;
  width: 100%;
  margin: auto;
  transition: all 0.4s ease-in-out;
  span {
    position: relative;
    bottom: 11px;
    line-height: 50px;
    cursor: pointer;
  }
}

.config-row {
  display: flex;
  flex-wrap: wrap;
}

.config-row-item {
  flex: 50%;
  margin-bottom: 30px;
}

/* Spin Animation */
.spin .sync {
  animation-name: spin;
  animation-duration: 800ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
</style>
