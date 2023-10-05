// ace serializer function from wowhead https://wow.zamimg.com/js/WeakAuraExport.js

// EncodeForPrint forked from https://github.com/LetsTimeIt/mdt-compression under GPL-3.0 license
// this version was fixed by Vardex

import zlib from "node:zlib";
import { Buffer } from "node:buffer";

const StopMotionTemplate = {
  d: {
    tenorID: undefined,
    xOffset: 0,
    yOffset: 0,
    foregroundColor: [1, 1, 1, 1],
    desaturateBackground: false,
    animationType: "loop",
    sameTexture: true,
    startPercent: 0,
    actions: {
      start: {},
      init: {},
      finish: {},
    },
    customForegroundRows: 16,
    frameRate: 15,
    internalVersion: 51,
    animation: {
      start: {
        type: "none",
        easeStrength: 3,
        duration_type: "seconds",
        easeType: "none",
      },
      main: {
        type: "none",
        easeStrength: 3,
        duration_type: "seconds",
        easeType: "none",
      },
      finish: {
        type: "none",
        easeStrength: 3,
        duration_type: "seconds",
        easeType: "none",
      },
    },
    customForegroundFileHeight: 0,
    customBackgroundRows: 16,
    customForegroundFileWidth: 0,
    rotation: 0,
    subRegions: [
      {
        type: "subbackground",
      },
    ],
    height: 128,
    rotate: true,
    load: {
      size: {
        multi: {},
      },
      spec: {
        multi: {},
      },
      class: {
        multi: {},
      },
      talent: {
        multi: {},
      },
    },
    endPercent: 1,
    backgroundTexture: "placeholder",
    customBackgroundColumns: 16,
    foregroundTexture: "placeholder",
    backgroundPercent: 1,
    selfPoint: "CENTER",
    mirror: false,
    backgroundColor: [0.5, 0.5, 0.5, 0.5],
    regionType: "stopmotion",
    discrete_rotation: 0,
    blendMode: "BLEND",
    anchorPoint: "CENTER",
    anchorFrameType: "SCREEN",
    customForegroundColumns: 16,
    config: {},
    customForegroundFrames: 0,
    customForegroundFrameWidth: 0,
    hideBackground: true,
    customBackgroundFrames: 0,
    id: "placeholder",
    uid: "placeholder",
    customForegroundFrameHeight: 0,
    frameStrata: 1,
    width: 128,
    authorOptions: {},
    inverse: false,
    desaturateForeground: false,
    conditions: {},
    information: {},
    triggers: {
      1: {
        trigger: {
          type: "unit",
          use_absorbHealMode: true,
          subeventSuffix: "_CAST_START",
          use_absorbMode: true,
          event: "Conditions",
          subeventPrefix: "SPELL",
          spellIds: {},
          use_alwaystrue: true,
          use_unit: true,
          names: {},
          unit: "player",
          debuffType: "HELPFUL",
        },
        untrigger: {},
      },
      activeTriggerMode: -10,
    },
  },
  m: "d",
  s: "WA-Companion",
  v: 1421,
};

const mappingTable = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "(",
  ")",
];

const convertByteTo6bit = function (chr: number) {
  return mappingTable[chr].charCodeAt(0);
};

// EncodeForPrint encodes a buffer of bytes into an ASCII string that can be printed.
// The string is encoded by converting each 6 bits into a printable ASCII character.
const EncodeForPrint = function (input: Buffer): string {
  if (input.length === 0) {
    return "";
  }

  const strlen = input.length;
  const lenMinus2 = strlen - 2;
  let i = 0;
  let j = 0;
  const buffer = Buffer.alloc(Math.ceil((strlen * 4) / 3));

  while (i < lenMinus2) {
    const x1 = input[i];
    const x2 = input[i + 1];
    const x3 = input[i + 2];
    i += 3;
    const cache = x1 + x2 * 256 + x3 * 65536;
    const b1 = cache % 64;
    const b2 = ((cache - b1) / 64) % 64;
    const b3 = ((cache - b1 - b2 * 64) / (64 * 64)) % 64;
    const b4 = ((cache - b1 - b2 * 64 - b3 * 64 * 64) / (64 * 64 * 64)) % 64;

    buffer[j++] = convertByteTo6bit(b1);
    buffer[j++] = convertByteTo6bit(b2);
    buffer[j++] = convertByteTo6bit(b3);
    buffer[j++] = convertByteTo6bit(b4);
  }
  let cache = 0;
  let cache_bitlen = 0;

  while (i < strlen) {
    const x = input[i];
    cache += x * 2 ** cache_bitlen;
    cache_bitlen += 8;
    i += 1;
  }

  while (cache_bitlen > 0) {
    const bit6 = cache % 64;
    buffer[j++] = convertByteTo6bit(bit6);
    cache = (cache - bit6) / 64;
    cache_bitlen -= 6;
  }
  return buffer.toString();
};

const deflate = function (input: zlib.InputType) {
  return zlib.deflateRawSync(input, { level: 9 });
};

const encode = function (
  input: ArrayBuffer | Buffer | { valueOf(): ArrayBuffer | SharedArrayBuffer },
) {
  return EncodeForPrint(Buffer.from(input));
};

// Serialization mapping
type SerializationMapping = [RegExp, string][];

const serializationMapping: SerializationMapping = [
  [/\^/g, "}"],
  [/~/g, "~|"],
  [/\s/g, "~`"],
];

function replaceNonASCIICharacters(inputString: string): string {
  // eslint-disable-next-line no-control-regex
  // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
  return inputString.replace(/[^\x00-\x7F]/g, "?");
}

function applySerializationMapping(inputString: string): string {
  let result = inputString;

  for (const [search, replace] of serializationMapping) {
    result = result.replace(search, replace);
  }

  return result;
}

function serializeValue(
  value: typeof StopMotionTemplate | string | number,
  serializedArray: string[],
): void {
  const valueType = typeof value;

  if (valueType === "string") {
    const processedValue = applySerializationMapping(
      replaceNonASCIICharacters(value as string),
    );
    serializedArray.push("^S", processedValue);
  } else if (valueType === "number") {
    serializedArray.push(`^N${value}`);
  } else if (valueType === "boolean") {
    serializedArray.push(value ? "^B" : "^b");
  } else if (valueType === "object" || Array.isArray(value)) {
    serializedArray.push("^T");

    for (const key of Object.keys(value)) {
      const parsedKey = /^\d+$/.test(key)
        ? Number.parseInt(key).toString()
        : key;
      serializeValue(parsedKey, serializedArray);
      serializeValue(value[key], serializedArray);
    }

    serializedArray.push("^t");
  } else {
    console.log(`Cannot serialize a value of type "${valueType}"`);
  }
}

function serialize(input: typeof StopMotionTemplate): string {
  const serializedArray: string[] = ["^1"];
  serializeValue(input, serializedArray);
  return `${serializedArray.join("")}^^`;
}

function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
}

function generateUniqueID(): string {
  const uid: string[] = new Array<string>(11);
  const tableLen = mappingTable.length;

  for (let i = 0; i < 11; i++) {
    uid[i] = mappingTable[getRandomInt(0, tableLen - 1)];
  }

  return uid.join("");
}

export { StopMotionTemplate, serialize, deflate, encode, generateUniqueID };
