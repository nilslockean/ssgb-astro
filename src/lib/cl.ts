type ClArg =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, boolean>
  | ClArg[];

function parseArg(arg: ClArg): string[] {
  if (typeof arg === "string") {
    return [arg];
  }

  if (typeof arg === "number") {
    return [String(arg)];
  }

  if (typeof arg === "boolean") {
    return [];
  }

  if (arg === null || arg === undefined) {
    return [];
  }

  if (Array.isArray(arg)) {
    return arg.flatMap(parseArg);
  }

  if (typeof arg === "object") {
    return Object.entries(arg)
      .filter(([, value]) => value)
      .map(([key]) => key);
  }

  return [];
}

export function cl(...rest: ClArg[]): string[] {
  return rest.flatMap(parseArg);
}

export default cl;
