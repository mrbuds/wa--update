<template>
  <div id="wrapper">
    <div
      class="main-container"
      :class="{ blurred: reportIsShown || updateAuraIsShown }"
    >
      <header>
        <div class="app-logo">
          <img
            src="../../src/assets/weakauras.png"
            class="logo-img"
          />
          <span>{{ $t("app.main.companion" /* Companion */) }}</span>
        </div>
        <div class="menu-btns">
          <UIButton
            type="menu"
            :class="{ active: configStep === 0 }"
            @click="configStep = 0"
            :title="$t('app.menu.main')"
          >
            <span class="material-icons">sync</span>
          </UIButton>
          <UIButton
            type="menu"
            :class="{ active: configStep === 4 }"
            @click="configStep = 4"
            :title="$t('app.footer.stopmotion')"
          >
            <span class="material-icons">movie</span>
          </UIButton>
          <UIButton
            type="menu"
            :class="{ active: configStep === 1 }"
            @click="configStep = 1"
            :title="$t('app.menu.settings')"
          >
            <span class="material-icons">settings</span>
          </UIButton>
          <UIButton
            type="menu"
            :class="{ active: configStep === 2 }"
            @click="configStep = 2"
            :title="$t('app.menu.help')"
          >
            <span class="material-icons">help</span>
          </UIButton>
          <UIButton
            type="menu"
            :class="{ active: configStep === 3 }"
            @click="configStep = 3"
            :title="$t('app.menu.about')"
          >
            <span class="material-icons">info</span>
          </UIButton>
        </div>
      </header>
      <main>
        <template v-if="configStep === 0">
          <div id="selectors">
            <div
              v-if="config.wowpath.validated && config.wowpath.versions"
              id="version-selector"
            >
              <Dropdown
                v-model:value="config.wowpath.version"
                :options="versionOptions"
                :label="$t('app.wowpath.version' /* Version */)"
                @change="doCompareSVwithWago()"
              />
            </div>
            <div
              v-if="config.wowpath.validated && versionSelected"
              id="account-selector"
            >
              <Dropdown
                v-model:value="versionSelected.account"
                :options="accountOptions"
                :label="$t('app.wowpath.account' /* Account */)"
                @change="doCompareSVwithWago()"
              />
            </div>
          </div>
          <div
            v-if="allAddonConfigs.length > 1"
            id="addonbttns"
          >
            <label
              :key="addonSelected"
              class="btn-label"
            >
              {{ $t("app.main.addons" /* Addons */) }}
            </label>
            <span style="margin-left: 5px" />
            <UIButton
              v-for="(addon, index) in allAddonConfigs"
              :key="index"
              type="addon"
              :class="{ active: addonSelected === addon.addonName }"
              :disabled="!addon.isInstalled"
              @click="addonSelected = addon.addonName"
            >
              {{ addon.addonName }}
            </UIButton>
          </div>
          <div id="dashboard">
            <RefreshButton
              @refresh="doCompareSVwithWago()"
              @gotoconfig="configStep = 1"
              :is-settings-ok="config.wowpath.validated"
              :is-version-selected="versionSelected"
              :is-account-selected="accountSelected"
              :is-sv-ok="getWeakAurasSaved() || getPlaterSaved()"
              :fetching="fetching"
              :last-update="accountSelected && accountSelected.lastWagoUpdate"
              :auras-shown="aurasSortedForView.length"
              :is-addons-ok="getIsAddonInstalled('WeakAuras') || getIsAddonInstalled('Plater')"
            >
            </RefreshButton>
            <br />
            <template v-if="aurasSortedForView.length > 0 && !fetching">
              <AuraHeaders
                :sorted-column="sortedColumn"
                :sort-descending="sortDescending"
                :addon-selected-config="addonSelectedConfig"
                @sort-by="sortBy"
              />
              <div id="aura-list">
                <Aura
                  v-for="aura in aurasSortedForView"
                  :key="aura.slug"
                  :aura="aura"
                />
              </div>
            </template>
          </div>
        </template>
        <Config
          v-else-if="configStep === 1"
          :default-w-o-w-path="defaultWOWPath"
        />
        <Help v-else-if="configStep === 2" />
        <About v-else-if="configStep === 3" />
        <StopMotion
          v-else-if="configStep === 4"
          :wowVersions="versionOptions"
        />
      </main>
      <footer>
        <a
          class="getweakauras"
          href="https://www.curseforge.com/wow/addons/weakauras-2"
          target="_blank"
        >
          <img
            src="/social-icons/curse.svg"
            class="logo"
            title="CurseForge"
          />
          {{ $t("app.footer.getweakauras" /* Get WeakAuras! */) }}
        </a>
        <a
          class="browsewago"
          href="https://wago.io/weakauras"
          target="_blank"
        >
          <img
            src="/social-icons/wago.svg"
            class="logo"
            title="Wago"
          />
          {{ $t("app.footer.browsewago" /* Browse Wago for more auras! */) }}
        </a>
        <a
          class="reportbug"
          @click="toggleReport"
        >
          {{ $t("app.footer.reportbug" /* Found a bug? */) }}
          <img
            src="/social-icons/bug_report.svg"
            class="logo invert"
            title="Bug"
          />
        </a>
        <div
          class="ready-to-install"
          v-if="stash.auras.length > 0"
          @click="toggleUpdatedAuraList()"
        >
          <span>
            {{ $t("app.footer.readytoinstall" /* Ready To Install */) }}
            ({{ stash.auras.length }})
          </span>
          <i
            v-tooltip="{
              strategy: 'fixed',
              theme: 'info-tooltip',
              html: true,
              content: `${$t('app.main.readyForInstall' /* Ready for Install */)}${readyForInstallTooltip}`,
            }"
            class="material-icons update-available update-auras"
          >
            download
          </i>
        </div>
        <div class="app-update">
          <a
            :href="updater.path"
            target="_blank"
            v-if="updater.status === 'update-available'"
          >
            <i
              v-if="updater.status === 'update-available'"
              v-tooltip="{
                strategy: 'fixed',
                theme: 'info-tooltip',
                html: true,
                content: `${$t('app.main.installUpdate' /* Install client update */)}: v${updater.version} ${
                  updater.releaseNotes
                }`,
              }"
              class="material-icons update-available"
            >
              system_update_alt
            </i>
          </a>
          <i
            v-if="updater.status === 'update-downloaded'"
            v-tooltip="{
              strategy: 'fixed',
              theme: 'info-tooltip',
              content: `${$t('app.main.installUpdate' /* Install client update */)}: v${updater.version}`,
            }"
            class="material-icons update-available"
            @click="installUpdates"
          >
            system_update_alt
          </i>
          <div
            v-if="updater.status === 'checking-for-update'"
            class="updating"
          >
            <i class="material-icons icon">sync</i>
          </div>
          <div
            v-if="updater.status === 'download-progress'"
            class="updating"
          >
            <span class="progress">{{ updater.progress }}%</span>
            <i class="material-icons icon">sync</i>
          </div>
        </div>
      </footer>
    </div>
    <Report v-if="reportIsShown" />
    <UpdatedAuraList v-if="updateAuraIsShown" />
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import fs from "fs";
import path from "path";
import { defineComponent } from "vue";

import { buildAccountList } from "@/libs/build-account-list";
import { compareSVwithWago } from "@/libs/compare-sv-with-wago";
import contacts from "@/libs/contacts";
import { PlaterSaved, WeakAurasSaved } from "@/libs/grab-sv-files";
import hash from "@/libs/hash";
import { isAddonInstalled } from "@/libs/is-addon-installed";
import { parsePlaterSVdata, parseWeakAurasSVdata } from "@/libs/parse-sv-data";
import {
  createSortByAuthor,
  createSortByString,
  createSortByTime,
  createSortByType,
  createSortByUpdate,
} from "@/libs/sort";
import userDataPath from "@/libs/user-data-folder";
import { wowDefaultPath } from "@/libs/utilities";
import { validateWowPath } from "@/libs/validate-wow-path";
import { writeAddonData } from "@/libs/write-addon-data";

import { useStashStore } from "../stores/auras";
import { Account, AuraType, Version, useConfigStore } from "../stores/config";

import { wagoPushHandler } from "@/libs/wago-push-handler";
import About from "./UI/About.vue";
import Aura from "./UI/Aura.vue";
import AuraHeaders from "./UI/AuraHeaders.vue";
import Config from "./UI/Config.vue";
import Dropdown from "./UI/Dropdown.vue";
import Help from "./UI/Help.vue";
import RefreshButton from "./UI/RefreshButton.vue";
import Report from "./UI/Report.vue";
import StopMotion from "./UI/StopMotion.vue";
import TitleBar from "./UI/TitleBar.vue";
import UIButton from "./UI/UIButton.vue";
import UpdatedAuraList from "./UI/UpdatedAuraList.vue";

interface WeakAurasMetadata {
  name: string;
  url: string;
  displayName: string;
}

interface WagoMetadata {
  name: string;
  url: string;
  displayName: string;
}

const weakauras: WeakAurasMetadata[] = contacts.weakauras;
const wago: WagoMetadata[] = contacts.wago;

export default defineComponent({
  name: "LandingPage",
  components: {
    RefreshButton,
    Aura,
    AuraHeaders,
    Config,
    About,
    Help,
    Report,
    UpdatedAuraList,
    UIButton,
    Dropdown,
    StopMotion,
  },
  data() {
    return {
      configStep: 0,
      addonSelected: "WeakAuras",
      reportIsShown: false,
      updateAuraIsShown: false,
      fetching: false, // use for avoid spamming refresh UIButton and show spinner
      sortedColumn: "modified",
      sortDescending: false,
      schedule: {
        id: null, // 1h setTimeout id
      },
      medias: { weakauras, wago },
      updater: {
        status: null, // checking-for-update, update-available, update-not-available, error, download-progress, update-downloaded
        progress: null,
        scheduleId: null, // for 2h auto-updater
        version: null,
        path: null,
        releaseNotes: null,
      },
      isMac: process.platform === "darwin",
      accountOptions: [],
      versionOptions: [],
      defaultWOWPath: "",
    };
  },
  setup() {
    const config = useConfigStore();
    const stash = useStashStore();
    return {
      config,
      stash,
    };
  },
  computed: {
    readyForInstallTooltip() {
      return this.stash.tohtml();
    },
    accountHash() {
      if (this.versionSelected) {
        const { account } = this.versionSelected;
        return hash.hashFnv32a(account, true);
      }
      return null;
    },
    allAddonConfigs() {
      const addonConfigs = [
        {
          addonName: "WeakAuras",
          wagoAPI: "https://data.wago.io/api/check/",
          addonDependency: "WeakAuras",
          svPathFunction: WeakAurasSaved,
          isInstalled: this.getIsAddonInstalled("WeakAuras"),
          parseFunction: parseWeakAurasSVdata,
          hasTypeColumn: false,
        },
        {
          addonName: "Plater",
          wagoAPI: "https://data.wago.io/api/check/",
          addonDependency: "Plater",
          svPathFunction: PlaterSaved,
          isInstalled: this.getIsAddonInstalled("Plater"),
          parseFunction: parsePlaterSVdata,
          hasTypeColumn: true,
        },
      ];
      return addonConfigs;
    },
    addonsInstalled() {
      return this.allAddonConfigs.filter((addonConfig) => addonConfig.isInstalled);
    },
    addonSelectedConfig() {
      if (!this.addonSelected) return null;
      return this.allAddonConfigs.find(
        (addonConfig) => addonConfig.addonName.toLowerCase() === this.addonSelected.toLowerCase()
      );
    },
    versionSelected(): Version | undefined {
      if (!this.config.wowpath.version || !this.config.wowpath.versions) {
        return undefined;
      }

      const selectedVersion = this.config.wowpath.versions.find(
        (version) => version.name === this.config.wowpath.version
      );

      return selectedVersion || undefined;
    },
    accountSelected(): Account {
      const versionSelected = this.versionSelected;

      if (typeof versionSelected === "object") {
        return versionSelected.accounts.find((account) => account.name === versionSelected.account);
      }
      return null;
    },
    aurasWithData() {
      return this.auras.filter(
        (aura) => !!aura.encoded && !(this.config.ignoreOwnAuras && aura.author === this.config.wagoUsername)
      );
    },
    aurasWithUpdate() {
      return this.aurasWithData.filter((aura) => aura.wagoVersion > aura.version && !aura.ignoreWagoUpdate);
    },
    aurasSortedForView() {
      return this.auras
        .filter((aura) => !(this.config.ignoreOwnAuras && aura.author === this.config.wagoUsername))
        .filter((aura) => aura.auraType === this.addonSelected)
        .sort(this.sortFunction);
    },
    sortFunction() {
      const dir = this.sortDescending ? -1 : 1;
      const hasTypeColumn = this.addonSelectedConfig && this.addonSelectedConfig.hasTypeColumn;

      if (!this.sortedColumn || this.sortedColumn === "modified") return createSortByTime(dir);
      else if (this.sortedColumn === "auraTypeDisplay") {
        return createSortByType(dir);
      } else if (this.sortedColumn === "update") {
        return createSortByUpdate(dir, hasTypeColumn);
      } else if (this.sortedColumn === "author") {
        return createSortByAuthor(dir, hasTypeColumn);
      }

      return createSortByString(dir, this.sortedColumn);
    },
    auras: {
      get(): AuraType[] {
        return (
          (this.config.wowpath.validated &&
            this.config.wowpath.version &&
            this.accountSelected &&
            this.accountSelected.auras) ||
          []
        );
      },
      set(newValue) {
        this.accountSelected.auras = newValue;
      },
    },
  },
  watch: {
    "stash.auras": {
      handler() {
        writeAddonData(this.config, this.addonsInstalled, this.aurasWithData, this.stash);
      },
      deep: true,
    },
    "config.wowpath.value": function () {
      validateWowPath(this.config, this.versionOptions, this.accountOptions, this.versionSelected, this.auras);
    },
    "config.wowpath.version": function () {
      buildAccountList(this.config, this.accountOptions, this.versionSelected, this.auras);
    },
  },
  async mounted() {
    ipcRenderer.on("setAllowPrerelease", (_event, allowPrerelease) => {
      this.config.beta = allowPrerelease;
    });

    // refresh on event (tray icon)
    ipcRenderer.on("refreshWago", () => {
      this.doCompareSVwithWago();
    });

    ipcRenderer.on("linkHandler", async (_event, link) => {
      const pattern = /weakauras-companion:\/\/wago\/push\/([^/]+)/;

      if (link) {
        const result = link.match(pattern);
        let slug;

        if (result) {
          ({ 1: slug } = result);
        }

        if (slug) {
          await wagoPushHandler(this.config, slug, this.stash, this.versionSelected);
        }
      }
    });

    ipcRenderer.on("updaterHandler", (_event, status, arg) => {
      console.log(`updaterHandler: ${status}`);

      if (status === "checkForUpdates") {
        this.updater.version = arg.updateInfo.version;
        return;
      }
      this.updater.status = status;

      if (status === "download-progress") {
        this.updater.progress = Math.floor(arg.percent);
      }

      if (status === "update-available") {
        this.updater.path = `https://github.com/WeakAuras/WeakAuras-Companion/releases/download/v${arg.version}/${arg.path}`;
        this.updater.releaseNotes = arg.releaseNotes || "";
        console.log(JSON.stringify(arg));
      }
    });

    // set default wow path
    if (!this.config.wowpath.validated) {
      try {
        let wowpath = await wowDefaultPath();
        this.defaultWOWPath = wowpath;

        if (!this.config.wowpath.validated) {
          this.config.wowpath.value = wowpath;
          validateWowPath(this.config, this.versionOptions, this.accountOptions, this.versionSelected, this.auras);
        }
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    }

    // create default backup folder
    fs.mkdir(path.join(userDataPath, "WeakAurasData-Backup"), () => {
      console.log("Creating default directory");
    });

    // check updates
    setTimeout(compareSVwithWago, 3);

    // check for app updates in 2 hours
    setTimeout(this.checkCompanionUpdates, 1000 * 3600 * 2);
  },
  methods: {
    getGotOptions() {
      return {
        http2: true,
        headers: {
          Identifier: this.accountHash,
          "api-key": this.config.wagoApiKey || "",
        },
        crossdomain: true,
        timeout: {
          request: 30000,
        },
      };
    },
    readyForInstallFlush() {
      this.stash.$reset();
    },
    checkCompanionUpdates() {
      ipcRenderer.invoke("checkUpdates", this.config.beta);

      // check for app updates in 2 hours
      if (this.updater.scheduleId) clearTimeout(this.updater.scheduleId);

      this.updater.scheduleId = setTimeout(this.checkCompanionUpdates, 1000 * 3600 * 2);
    },
    getWeakAurasSaved() {
      return WeakAurasSaved(this.config, this.versionSelected, this.accountSelected);
    },
    getPlaterSaved() {
      return PlaterSaved(this.config, this.versionSelected, this.accountSelected);
    },
    getIsAddonInstalled(addon: string) {
      return isAddonInstalled(this.config, addon, this.versionSelected, this.accountSelected);
    },
    getAddonConfig(addonName: string) {
      const lowerAddonName = addonName.toLowerCase();

      for (const addonConfig of this.allAddonConfigs) {
        if (addonConfig.addonName.toLowerCase() === lowerAddonName) {
          return addonConfig;
        }
      }
      return null;
    },
    reset() {
      this.config.$reset();
    },
    async doCompareSVwithWago() {
      return compareSVwithWago(
        this.config,
        this.versionSelected,
        this.accountSelected,
        this.fetching,
        this.addonsInstalled,
        this.addonSelected,
        this.auras,
        this.aurasWithData,
        this.stash
      );
    },
    toggleReport() {
      this.reportIsShown = !this.reportIsShown;
    },
    toggleUpdatedAuraList() {
      this.updateAuraIsShown = !this.updateAuraIsShown;
    },
    installUpdates() {
      ipcRenderer.invoke("installUpdates");
    },
    sortBy(columnName) {
      if (this.sortedColumn == columnName) {
        if (this.sortDescending) {
          this.sortDescending = false;
          this.sortedColumn = "modified";
        } else {
          this.sortDescending = true;
        }
      } else {
        this.sortDescending = false;
        this.sortedColumn = columnName;
      }
    },
  },
});
</script>

<style lang="scss">
@import "../assets/fonts/fonts.scss";
@import "../assets/css/tooltip.scss";
@import "../assets/css/globals.scss";
@import "../assets/css/common.scss";

$iconDefaultColor: #51ae42;

/* Companion logo */
.app-logo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 25px;
  left: 2.35vw;
  -webkit-app-region: drag;
}

.logo-img {
  height: 50px;
  transition: all 0.2s ease-in-out;
}

.app-logo span {
  font-weight: 300;
  font-size: 22px;
  margin-left: 5px;
  color: #e4e4e4;
  transition: all 0.2s ease-in-out;
}

.main-container {
  -webkit-app-region: drag;
  // background-color: #101010;
  border-radius: 8px;
}

/* Menu */
.btn.btn-menu {
  background: transparent;
  -webkit-app-region: no-drag;
  color: #e6e6e6;
  padding: 0 18px;
  text-align: center;
  width: auto;
  height: 100%;
  border: none;
  border-radius: 0;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 3px solid transparent;
  transition: background-color 0.2s ease-in-out, border-bottom 0.2s ease-in-out, font-size 0.2s ease-in-out;
}

.btn.btn-menu span {
  position: relative;
  top: 3px;
}

.btn.btn-menu:hover {
  // background-color: #1f1f1f;
  border-bottom: 3px solid #c4c4c4;
}

.btn-menu.active {
  // background-color: #171717;
  border-bottom: 3px solid #c4c4c4;
}

/* Main page container */
#dashboard {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* WoW addon selection */
#addonbttns {
  position: absolute;
  left: 30px;
  top: 30px;
  z-index: 999;
  text-align: left;
  height: 65px;
}

.btn-label {
  display: block;
  margin-bottom: 5px;
  margin-left: 1px;
  cursor: default;
  color: #eeeeee;
  font-size: 15px;
  font-family: Montserrat, sans-serif;
  font-weight: 500;
}

/* WoW Version & Account selection */
#selectors {
  position: absolute;
  top: 20px;
  right: 20px;

  option,
  select {
    background: #191919;
    color: #e6e6e6;
    margin: 0 5px;
    border-radius: 6px;
    width: 120px;

    &:focus {
      outline: none;
    }
  }
}

#version-selector {
  position: absolute;
  top: 0px;
  right: 10px;
}

#account-selector {
  position: absolute;
  top: 55px;
  right: 10px;
}

/* Aura list */
#aura-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 65%;
  text-align: center;
  margin: 0 2.35vw 15px;
  border-radius: 8px;
  transition: height 0.4s ease-in-out;
}

/* Scrollbar */
::-webkit-scrollbar {
  position: relative;
  width: 10px;
  background: #212121;
  border-radius: 35px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #292828;
  border-radius: 35px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #c4c4c4;
  border: 2px solid #212121;
  border-radius: 5px;
  width: 8px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555555;
}

/* Report Page */
.reportbug {
  font-size: 12px;
  color: #e6e6e6;
  vertical-align: bottom;
  line-height: 25px;
  float: right;
  text-shadow: #000000 1px 0;
  font-weight: 600;
  opacity: 0.5;
}

.reportbug:hover {
  opacity: 1;
}

.ready-to-install {
  font-size: 12px;
  color: #e6e6e6;
  vertical-align: bottom;
  line-height: 25px;
  float: right;
  text-shadow: #000000 1px 0;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  padding-right: 15px;

  & span {
    cursor: pointer;
    opacity: 0.8;
    margin-right: 5px;
  }
}

.ready-to-install:hover span {
  opacity: 1;
}

.invert {
  filter: invert(100%);
}

/* Get WeakAuras */
.getweakauras {
  font-size: 12px;
  color: #e6e6e6;
  vertical-align: bottom;
  line-height: 25px;
  float: left;
  text-shadow: #000000 1px 0;
  font-weight: 600;
  opacity: 0.5;
}

.getweakauras:hover {
  opacity: 1;
}

/* Browse Wago & Stopmotion */
.browsewago,
.stopmotion {
  font-size: 12px;
  color: #e6e6e6;
  vertical-align: bottom;
  line-height: 25px;
  float: left;
  text-shadow: #000000 1px 0;
  font-weight: 600;
  opacity: 0.5;
  margin-left: 10px;
}

.browsewago:hover,
.stopmotion:hover {
  opacity: 1;
}

.exclamationmark {
  color: #fcff3d;
}

/* WoW Version & Account selection */
main {
  position: relative;
}

select {
  padding: 5px;
  font-size: small;
  border-radius: 2px;
  border: none;
  background-color: #e6e6e6;
  color: #010101;
}

// Update Icon
.app-update {
  // color: #777;
  float: right;
  margin-right: 15px;
  height: 25px;
  position: relative;
  bottom: 2px;

  .updating {
    display: inline;

    .icon {
      animation: spin;
      animation-duration: 3000ms;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
    }

    .progress {
      font-size: 14px;
      font-weight: 500;
      margin: auto;
      vertical-align: middle;
      position: relative;
      bottom: 7px;
    }
  }
}

.update-available {
  animation: pulse 2s infinite;
  cursor: pointer;
  color: $iconDefaultColor;

  &.update-auras {
    --pulse-color: rgba(102, 255, 0, 1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}

@keyframes pulse {
  0% {
    text-shadow: 0 0 0 var(--pulse-color, rgba(255, 255, 255, 0.4));
  }

  70% {
    text-shadow: 0 0 40px var(--pulse-color, rgba(238, 255, 4, 0));
  }

  100% {
    text-shadow: 0 0 0 var(--pulse-color, rgba(255, 255, 255, 0));
  }
}
</style>
