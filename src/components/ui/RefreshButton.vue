<script lang="ts">
import { DateTime } from "luxon";
import { defineComponent } from "vue";
import UIButton from "./UIButton.vue";

export default defineComponent({
  name: "RefreshButton",
  components: { UIButton },
  filters: {},
  props: {
    usable: {
      type: Boolean,
      default: false,
    },
    fetching: {
      type: Boolean,
      default: false,
    },
    lastUpdate: {
      type: Date,
      default: "0",
    },
    aurasShown: {
      type: Number,
      default: 0,
    },
    isSettingsOk: {
      type: Boolean,
      default: false,
    },
    isVersionSelected: {
      type: [String, Object],
      default: "",
    },
    isAccountSelected: {
      type: [String, Object],
      default: "",
    },
    isSvOk: {
      type: Boolean,
      default: false,
    },
    isAddonsOk: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["gotoconfig", "refresh"],
  setup(props, { emit }) {
    const gotoconfig = () => {
      emit("gotoconfig");
    };

    const refresh = () => {
      emit("refresh");
    };
    return {
      gotoconfig,
      refresh,
    };
  },
  data() {
    return {
      lastUpdateTimer: null,
    };
  },
  watch: {
    fetching() {
      this.scheduleTimer();
    },
  },
  beforeUnmount() {
    clearInterval(this.lastUpdateTimer);
  },
  methods: {
    fromNow(value, locale) {
      if (!value) return "n/a";
      return DateTime.fromJSDate(value).toRelative({
        locale: locale,
      });
    },
    olderThan30s() {
      return (
        DateTime.local().diff(DateTime.fromJSDate(this.lastUpdate)).valueOf() >
        30000
      );
    },
    scheduleTimer() {
      if (this.lastUpdateTimer) clearInterval(this.lastUpdateTimer);

      this.lastUpdateTimer = setInterval(() => {
        this.$forceUpdate();
      }, 1000 * 60);
    },
  },
  mount() {
    this.scheduleTimer();
  },
});
</script>

<template>
  <div
    id="sync"
    :class="{ top: aurasShown > 0 }"
  >
    <UIButton
      v-if="isSettingsOk && isSvOk && isAddonsOk && aurasShown > 0"
      :class="{ spin: fetching }"
      type="refresh"
      @click="$emit('refresh')"
    >
      <span class="sync i-mdi-sync align-middle text-4xl"></span>
      <span>{{ $t("app.refreshbutton.label" /* Fetch Updates */) }}</span>
    </UIButton>
    <UIButton
      v-else-if="!isSettingsOk"
      type="issue"
      @click="$emit('gotoconfig')"
    >
      <span
        class="i-mdi-error-outline mr-2 align-middle text-4xl -mt-[2px]"
      ></span>
      <span>{{ $t("app.refreshbutton.finishsetup" /* Finish Setup */) }}</span>
    </UIButton>
    <label
      v-else-if="!isVersionSelected"
      class="label-issue text-status-issue"
    >
      <span
        class="i-mdi-error-outline mr-2 align-middle text-2xl -mt-[2px]"
      ></span>
      <span>{{
        $t(
          "app.refreshbutton.selectversion" /* Please select your WoW Version! */,
        )
      }}</span>
    </label>
    <label
      v-else-if="!isAccountSelected"
      class="label-issue text-status-issue"
    >
      <span
        class="i-mdi-error-outline mr-2 align-middle text-2xl -mt-[2px]"
      ></span>
      <span>{{
        $t(
          "app.refreshbutton.selectaccount" /* Please select your Account Name! */,
        )
      }}</span>
    </label>
    <label
      v-else-if="!isSvOk"
      class="label-issue text-status-issue"
    >
      <span
        class="i-mdi-error-outline mr-2 align-middle text-2xl -mt-[2px]"
      ></span>
      <span>{{
        $t(
          "app.refreshbutton.incorrectsv" /* No AddOn data found for this account. */,
        )
      }}</span>
    </label>
    <label
      v-if="
        isSettingsOk &&
        isSvOk &&
        isAddonsOk &&
        isVersionSelected &&
        isAccountSelected &&
        aurasShown === 0
      "
      class="label-issue text-status-issue"
    >
      <span
        class="i-mdi-error-outline mr-2 align-middle text-2xl -mt-[2px]"
      ></span>
      <span>{{
        $t(
          "app.refreshbutton.noAurasInstalled" /* No updateable auras installed on this account. */,
        )
      }}</span>
    </label>
    <label
      v-if="
        isSettingsOk && !isAddonsOk && isVersionSelected && isAccountSelected
      "
      class="label-issue text-status-issue"
    >
      <span
        class="i-mdi-error-outline mr-2 align-middle text-2xl -mt-[2px]"
      ></span>
      <span>{{
        $t(
          "app.refreshbutton.addonNotFound" /* No supported AddOn installed. */,
        )
      }}</span>
    </label>
    <label
      v-if="!isAddonsOk && isAccountSelected"
      class="label-issue text-status-issue"
    >
      <span>
        <a
          class="download"
          href="https://www.curseforge.com/wow/addons/weakauras-2"
          target="_blank"
        >
          <i
            class="i-social-curse align-middle text-xl -mt-[2px]"
            title="CurseForge"
          />
          {{ $t("app.footer.getweakauras" /* Get WeakAuras! */) }}
        </a>
      </span>
    </label>
    <div
      v-if="lastUpdate && isAddonsOk && isSvOk && olderThan30s()"
      id="lastupdate"
    >
      {{ $t("app.refreshbutton.lastupdate" /* last update: */) }}
      <b>{{ fromNow(lastUpdate, $i18n.locale) }}</b>
    </div>
  </div>
</template>

<style scoped lang="css">
#sync {
  text-align: center;
  width: 100%;
  margin: auto;
  transition: all 0.4s ease-in-out;
}

#sync.top {
  position: relative;
  top: 10px;
}

#lastupdate {
  margin-top: 10px;
  font-size: small;
  color: #e6e6e6;
}

.download {
  clear: both;
  display: block;
  margin-top: 10px;
}

.btn-refresh.spin {
  background: #ababab;
  border-color: transparent;
  color: #313131;
}

/* Spin Animation */
.spin .sync {
  animation-name: spin;
  animation-duration: 800ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

.btn-refresh {
  padding: 12px 15px;
  padding-left: 13px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}

.label-issue {
  font-size: 16px;
  vertical-align: top;
  line-height: 32px;
  transition: all 0.1s ease-in-out;
}
</style>
