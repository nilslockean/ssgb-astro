export function cl(...rest: unknown[]): string[] {
  return rest.reduce<string[]>((acc, curr) => {
    if (typeof curr === "string") {
      return acc.concat(curr);
    }

    if (typeof curr === "number") {
      return acc.concat(String(curr));
    }

    if (typeof curr === "object") {
      for (const key in curr) {
        const value = curr[key];
        if (value) {
          return acc.concat(String(key));
        }
      }
    }

    if (!curr) {
      return acc
    }
  }, []);
}

export default cl;
