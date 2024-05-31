import fs from "node:fs";
import path from "node:path";

import { buildAccountList } from "./build-account-list";
import { buildVersionList } from "./build-version-list";

import type {
  AccountOptions,
  AuraType,
  ConfigState,
  Version,
  VersionOptions,
} from "@/stores/config";

export function validateWowPath(
  config: ConfigState,
  versionOptions: VersionOptions[],
  accountOptions: AccountOptions[],
  versionSelected: Version,
  auras: AuraType[],
) {
  console.log("validateWowPath");
  config.wowpath.validated = false;

  if (config.wowpath.value) {
    const wowPath = config.wowpath.value;
    const dataFolder = path.join(wowPath, "Data");

    // test if ${wowPath}\Data exists
    try {
      fs.accessSync(dataFolder, fs.constants.F_OK);
      const files = fs.readdirSync(wowPath);
      let validated = false;

      files
        .filter(
          (versionDir) =>
            versionDir.match(/^_.*_$/) &&
            fs.statSync(path.join(wowPath, versionDir)).isDirectory(),
        )
        .forEach((versionDir) => {
          if (!validated) {
            const accountFolder = path.join(
              wowPath,
              versionDir,
              "WTF",
              "Account",
            );

            if (fs.existsSync(accountFolder)) {
              try {
                fs.accessSync(accountFolder, fs.constants.F_OK);
                validated = true;
                config.wowpath.validated = true;
                buildVersionList(config, versionOptions, accountOptions);

                buildAccountList(
                  config,
                  accountOptions,
                  versionSelected,
                  auras,
                );
              } catch (err) {
                console.error("No Read access", err);
              }
            }
          }
        });
    } catch (err) {
      console.log(err);
    }
  }
}
