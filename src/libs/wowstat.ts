import type { Stats } from "node:fs";
import fs from "node:fs";
import path from "node:path";
import { Tail } from "tail";

interface VersionConfig {
  name: string;
  account: string;
}

interface AfterReloadConfig {
  value: string;
  version: string;
  versions: VersionConfig[];
}

type AfterReloadCallback = () => void;

const clientlog: { [key: string]: Tail } = {};

export async function isOpen(
  wowpath: string,
  version: string,
): Promise<boolean> {
  const logfile = path.join(wowpath, version, "Logs", "Client.log");
  const renametest = path.join(wowpath, version, "Logs", "Client.log.test");

  try {
    await fs.promises.rename(logfile, renametest);
    await fs.promises.rename(renametest, logfile);
    return false;
  } catch (err) {
    console.log(err);
    return true;
  }
}

export async function afterReload(
  config: AfterReloadConfig,
  callback: AfterReloadCallback,
) {
  const { value: wowpath, version, versions } = config;
  const versionConfig = versions.find((v) => v.name === version);

  if (!versionConfig) {
    throw new Error(`Version configuration not found for version: ${version}`);
  }
  const { account } = versionConfig;

  const wacompanionsvfile = path.join(
    wowpath,
    version,
    "WTF",
    "Account",
    account,
    "SavedVariables",
    "WeakAurasCompanion.lua",
  );

  let mtime: number;

  try {
    const stats: Stats = await fs.promises.stat(wacompanionsvfile);
    mtime = stats.mtimeMs;
  } catch {
    throw new Error(`Failed to get file stats for: ${wacompanionsvfile}`);
  }

  const watcher = fs.watch(wacompanionsvfile, { persistent: false }, () => {
    fs.promises
      .stat(wacompanionsvfile)
      .then((stats: Stats) => {
        if (stats.mtimeMs !== mtime) {
          watcher.close();
          callback();
        }
      })
      .catch(() => {
        throw new Error(`Failed to get file stats for: ${wacompanionsvfile}`);
      });
  });
}

export function afterRestart(
  wowpath: string,
  version: string,
  callback: () => void,
) {
  const logfile = path.join(wowpath, version, "Logs", "Client.log");

  if (!clientlog[version]) {
    clientlog[version] = new Tail(logfile);
  } else {
    clientlog[version].watch();
  }

  clientlog[version].on("line", (data: string) => {
    const event = data.split(/ {2}/)[1];

    if (event === "Client Destroy") {
      clientlog[version].unwatch();
      callback();
    }
  });
}
