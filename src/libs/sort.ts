import { DateTime } from "luxon";

// Added explicit type annotations to function parameters
function getUpdateValueWithAllAuras(aura: { ignoreWagoUpdate: boolean; version: number; wagoVersion: number }): number {
  if (aura.ignoreWagoUpdate) {
    return 2;
  } else if (aura.version < aura.wagoVersion) {
    return 0;
  }
  return 3;
}

// Added explicit type annotations to function parameters
export function createSortByTime(dir: number): (a: { modified: Date; }, b: { modified: Date; }) => number {
  return (a, b) => {
    return (
      DateTime.fromJSDate(b.modified)
        .diff(DateTime.fromJSDate(a.modified))
        .valueOf() * dir
    );
  };
}

// Added explicit type annotations to function parameters
export function createSortByString(dir: number, column: string): (a: { [x: string]: any; }, b: { [x: string]: any; }) => number {
  return (a, b) => {
    let A = a[column] || "";
    let B = b[column] || "";

    [A, B] = [A, B].map((s) => `${s}`.toLocaleString().toLowerCase());
    return A < B ? -1 * dir : A === B ? 0 : dir;
  };
}

// Added explicit type annotations to function parameters
export function createSortByType(dir: number): (a: any, b: any) => number {
  const sortByType = createSortByString(dir, "auraTypeDisplay");
  const sortByName = createSortByString(1, "name");

  return (a, b) => sortByType(a, b) || sortByName(a, b);
}

// Added explicit type annotations to function parameters
export function createSortByAuthor(dir: number, hasTypeColumn: boolean): (a: any, b: any) => number {
  const sortByAuthor = createSortByString(dir, "author");
  const secondarySortFunction = hasTypeColumn
    ? createSortByType(1)
    : createSortByString(1, "name");

  return (a, b) => sortByAuthor(a, b) || secondarySortFunction(a, b);
}

// Added explicit type annotations to function parameters
export function createSortByUpdate(dir: number, hasTypeColumn: boolean): (a: any, b: any) => number {
  const getUpdateValue = getUpdateValueWithAllAuras;
  const secondarySortFunction = hasTypeColumn
    ? createSortByType(1)
    : createSortByString(1, "name");

  return (a, b) => {
    const A = getUpdateValue(a);
    const B = getUpdateValue(b);

    return A < B ? -1 * dir : A > B ? dir : secondarySortFunction(a, b);
  };
}
