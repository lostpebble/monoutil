export function isObject(obj: unknown): obj is Record<PropertyKey, unknown> {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}
