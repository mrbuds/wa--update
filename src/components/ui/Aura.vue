<script lang="ts">
import { DateTime } from "luxon";
import { defineComponent } from "vue";
import sanitize from "@/libs/sanitize";

export default defineComponent({
  props: {
    aura: { type: Object, default: null },
  },
  data() {
    return {
      timeElapsed: "n/a",
    };
  },
  computed: {
    children(): string {
      let output = "";

      if (this.aura.ids) {
        const { changelog, ids } = this.aura;

        if (changelog?.text) {
          if (changelog.format === "bbcode") {
            output += sanitize.bbcode(changelog.text);
          } else if (changelog.format === "markdown") {
            output += sanitize.markdown(changelog.text);
          }
          output += "\n\n";
        }
        output += ids.sort().join("\n");
      }
      return output;
    },
  },
  methods: {
    updateCurrentTime(): void {
      if (!this.aura.modified) {
        this.timeElapsed = "n/a";
        return;
      }

      // sometimes this function triggers after the tooltip
      // set n/a as default value in case DateTime return null
      this.timeElapsed =
        DateTime.fromJSDate(this.aura.modified)
          .setLocale(this.$i18n.locale)
          .toRelative() || "n/a";
    },
    wagoURL(value: string | undefined): string {
      if (!value) return "";
      return `https://wago.io/${value}`;
    },
    wagoAuthorURL(author: string | undefined): string {
      if (!author) return "";
      return `https://wago.io/p/${author}`;
    },
  },
});
</script>

<template>
  <div
    class="aura text-brand-accent"
    :class="{
      notAnUpdate: aura.version === aura.wagoVersion,
    }"
  >
    <span
      v-if="aura.source === 'WeakAuras Companion'"
      class="companion-icon"
    />
    <a
      v-if="aura.source === 'Wago'"
      v-tooltip="{
        content: wagoURL(aura.slug),
        html: false,
        strategy: 'fixed',
        theme: 'info-tooltip',
      }"
      class="wago-icon"
      target="_blank"
      :href="wagoURL(aura.slug)"
    />

    <div class="aura-name-container">
      <span
        v-tooltip="{
          content: children,
          html: false,
          strategy: 'fixed',
          theme: 'info-tooltip',
        }"
        class="aura-name"
        >{{ aura.name }}
      </span>
    </div>
    <div
      v-if="aura.ignoreWagoUpdate"
      class="ignored"
    >
      {{ $t("app.aura.updatedisabled" /* updates disabled */) }}
    </div>
    <div
      v-else-if="aura.version < aura.wagoVersion"
      class="update-ready"
    >
      {{ $t("app.aura.updateready" /* update ready */) }}
    </div>
    <div
      v-else
      class="uptodate text-brand-green"
    >
      {{ $t("app.aura.uptodate" /* up to date */) }}
    </div>
    <span
      v-if="aura.auraTypeDisplay"
      class="tag"
    >
      {{ aura.auraTypeDisplay }}
    </span>
    <a
      v-if="aura.source !== 'Wago'"
      class="author"
    >
      {{ aura.author }}
    </a>
    <a
      v-else
      v-tooltip="{
        content: wagoAuthorURL(aura.author),
        popperClass: ['small'],
        html: false,
        strategy: 'fixed',
        theme: 'info-tooltip',
      }"
      class="author"
      target="_blank"
      :href="wagoAuthorURL(aura.author)"
    >
      {{ aura.author }}
    </a>
    <div class="upgrade-text">
      <div class="current-version">
        <span v-if="aura.semver">
          v<span v-if="aura.semver">{{ aura.semver }}-{{ aura.version }}</span>
          <span v-else>{{ aura.version }}</span>
        </span>
      </div>
      <div
        v-tooltip="{
          content: timeElapsed,
          popperClass: ['small'],
          strategy: 'fixed',
          theme: 'info-tooltip',
        }"
        class="wago-version"
        @mouseenter="updateCurrentTime()"
      >
        v<span v-if="aura.wagoSemver">{{ aura.wagoSemver }}</span>
        <span v-else>{{ aura.wagoVersion }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.aura {
  background-color: #101010c9;
  border: 1px solid #101010;
  margin: 1px;
  height: 36px;
  padding: 2px 10px;
  vertical-align: middle;
  white-space: nowrap;
  display: flex;
  overflow: hidden;
  font-size: 11px;
  flex-direction: row;
  border-radius: 4px;
  transition: background-color ease-in-out 0.2s;

  &:hover {
    background-color: #161616c9;
  }
}

.aura-name-container {
  text-align: left;
  flex: 1;
  overflow: hidden;
}

.aura-name {
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 10px;
  display: inline-block;
  font-weight: 600;
  font-size: 12px;
  text-shadow: #000000 0 1px 0;
  text-align: left;
  line-height: 32px;
}

.update-ready {
  float: right;
  line-height: 32px;
  padding-right: 5px;
  width: 90px;
}

.uptodate {
  float: right;
  line-height: 32px;
  padding-right: 5px;
  text-align: center;
  width: 90px;
}

.ignored {
  float: right;
  line-height: 32px;
  color: #808080;
  padding-right: 5px;
  width: 90px;
}

.wago-icon {
  height: 90%;
  margin: auto;
  vertical-align: bottom;
  display: inline-block;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  content: url("../../assets/wago_plain.png");
}

.companion-icon {
  height: 9px;
  width: 27px;
  margin: auto;
  vertical-align: bottom;
  display: inline-block;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  content: url("../../assets/weakauras.png");
}

.author {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 10px;
  font-size: 12px;
  text-align: left;
  line-height: 32px;
}

.author:before {
  content: "@";
}

.upgrade-text {
  font-weight: 600;
  text-shadow: #000000 0 1px 0;
  display: flex;
}

.current-version {
  font-size: 9px;
  color: #777777;
  width: 55px;
  line-height: 32px;
  text-align: left;
  padding-top: 1px;
}

.wago-version {
  text-shadow: rgba(219, 185, 50, 0.267) 0 0 5px;
  text-align: right;
  width: 55px;
  line-height: 32px;
}

.tag {
  line-height: 17px;
  background: transparent;
  color: #efefef;
  font-weight: 600;
  padding: 0 10px;
  border: 1px solid #4a4a4a;
  border-radius: 10px;
  height: 20px;
  display: inline-block;
  position: relative;
  top: 6px;
}
</style>
