import type { Response } from "got";
import got from "got";
import hash from "./hash";
import type { StashStore } from "@/stores/auras";
import type { ConfigState, Version } from "@/stores/config";

interface WagoApiResponse {
  data: string;
  status: number;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [Symbol.iterator](): Iterator<any>;
}

export async function wagoPushHandler(
  config: ConfigState,
  slug: string,
  stash: StashStore,
  versionSelected: Version,
) {
  const existingAuraIndex = stash.auras.findIndex((aura) => aura.slug === slug);

  const getAccountHash = () => {
    if (versionSelected) {
      const { account } = versionSelected;
      return hash.hashFnv32a(account, true);
    }
    return null;
  };

  const getGotOptions = () => ({
    http2: true,
    headers: {
      "Identifier": getAccountHash(),
      "api-key": config.wagoApiKey || "",
    },
    crossdomain: true,
    timeout: {
      request: 30000,
    },
  });

  if (existingAuraIndex === -1) {
    try {
      const response: Response<WagoApiResponse> = await got(
        `https://data.wago.io/api/check/?ids=${slug}`,
        {
          ...getGotOptions,
          responseType: "json",
        },
      );
      const data: WagoApiResponse = response.body;

      for (const wagoData of data) {
        const aura = {
          slug: wagoData.slug,
          name: wagoData.name,
          author: wagoData.username,
          wagoVersion: wagoData.version,
          wagoSemver: wagoData.versionString,
          versionNote: wagoData.changelog,
          encoded: null,
          auraType:
            wagoData.type === "WEAKAURA"
              ? "WeakAuras"
              : wagoData.type === "PLATER"
                ? "Plater"
                : undefined,
          wagoid: wagoData._id,
          source: "Wago",
        };

        const response2 = await got(
          `https://data.wago.io/api/raw/encoded?id=${wagoData._id}`,
          {
            ...getGotOptions,
            responseType: "text",
          },
        );

        const data2 = response2.body;
        aura.encoded = data2;
        stash.add(aura);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
