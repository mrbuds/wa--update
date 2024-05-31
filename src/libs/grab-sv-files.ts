import fs from "node:fs";
import path from "node:path";

import type { Account, ConfigState, Version } from "@/stores/config";

function getSavedVariable(
  config: ConfigState,
  version: string,
  accountName: string,
  addonName: string,
) {
  const savedVariable = path.join(
    config.wowpath.value,
    version,
    "WTF",
    "Account",
    accountName,
    "SavedVariables",
    `${addonName}.lua`,
  );

  try {
    fs.accessSync(savedVariable, fs.constants.F_OK);
    return savedVariable;
  } catch (e) {
    console.log(`Error testing ${addonName} SV access\n${JSON.stringify(e)}`);
    return false;
  }
}

export function WeakAurasSaved(
  config: ConfigState,
  version: Version,
  account: Account,
) {
  if (config && version && account) {
    return getSavedVariable(config, version.name, account.name, "WeakAuras");
  }

  return false;
}

export function PlaterSaved(
  config: ConfigState,
  version: Version,
  account: Account,
) {
  if (config && version && account) {
    return getSavedVariable(config, version.name, account.name, "Plater");
  }

  return false;
}
