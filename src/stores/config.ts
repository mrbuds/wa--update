import path from "node:path";

import { defineStore } from "pinia";

import userDataPath from "@/libs/user-data-folder";

export interface WowPath {
  validated: boolean;
  value: string;
  version: string;
  versions: Version[];
}

export interface Account {
  auras: AuraType[];
  lastWagoUpdate: Date | null;
  name: string;
  numAuras: number;
  savedvariableSizeForAddon: {
    fileSize: number;
    addonName: string;
  }[];
}

export interface AccountOptions {
  text: string;
  value: string;
}

export interface AddonConfig {
  addonName: string;
  wagoAPI: string;
  addonDependency: string;
  isInstalled: boolean;
  hasTypeColumn: boolean;
  svPathFunction: (
    config: ConfigState,
    version: Version,
    account: Account,
  ) => string | false;
  parseFunction: (WeakAurasSavedData: any, config: AddonConfig) => any[];
  ignoreOwnAuras?: boolean;
  wagoUsername?: string | null;
}

export interface AuraType {
  addonConfig?: AddonConfig;
  auraType: string | undefined;
  auraTypeDisplay?: string | undefined; // dead?
  auraTypeDisplayName?: string | undefined;
  author: string;
  changelog?: {
    format: string;
    text: string;
  };
  code?: string;
  created?: Date | null;
  description?: string;
  encoded: string;
  id?: string;
  ids?: string[];
  ignoreWagoUpdate?: boolean;
  logo?: string;
  modified?: Date | null;
  name: string;
  regionType?: string | undefined; // dead?
  semver?: string;
  slug: string;
  source: string;
  uid?: string;
  uids?: string[];
  version?: number;
  versionNote?: string;
  wagoid?: string;
  wagoSemver: string;
  wagoVersion: number;
}

export interface Version {
  account: string;
  accounts: Account[];
  name: string;
}

export interface VersionOptions {
  text: string;
  value: string;
}

export interface Versions {
  account: string;
  accounts: Account[];
  name: string;
}

export interface Backup {
  active: boolean;
  defaultBackupPath: string;
  maxSize: number;
  path: string;
}

export interface ConfigState {
  autostart: boolean;
  autoupdate: boolean;
  backup: Backup;
  beta: boolean;
  ignoreOwnAuras: boolean;
  lang: string;
  notify: boolean;
  startminimize: boolean;
  wagoApiKey: string | null;
  wagoUsername: string | null;
  wowpath: WowPath;
  selectedVersion: Version | undefined;
}

export const useConfigStore = defineStore("configStore", {
  state: (): ConfigState => {
    return {
      wowpath: {
        value: "",
        versions: [],
        version: "",
        validated: false,
      },
      wagoUsername: null,
      wagoApiKey: null,
      ignoreOwnAuras: true,
      autostart: true,
      startminimize: false,
      notify: false,
      lang: "en",
      autoupdate: true,
      beta: false,
      backup: {
        active: true,
        path: path.join(userDataPath, "WeakAurasData-Backup"),
        maxSize: 100,
        defaultBackupPath: path.join(userDataPath, "WeakAurasData-Backup"),
      },
      selectedVersion: undefined,
    };
  },
  actions: {
    setSelectedVersion(version: Version) {
      this.selectedVersion = version;
    },
    initializeSelectedVersion() {
      if (this.wowpath.versions.length > 0) {
        this.selectedVersion = this.wowpath.versions[0];
      }
    },
  },
});
