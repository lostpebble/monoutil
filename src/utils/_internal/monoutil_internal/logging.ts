import { EMonoutilId } from "../../../monoutil.types";

export const logError = (utilId: EMonoutilId, error: unknown) => {
  console.error(`[monoutil] [${utilId}]`, error);
};

export const logWarning = (utilId: EMonoutilId, warning: string, ...more: unknown[]) => {
  console.warn(`[monoutil] [${utilId}]`, warning);
};

export const logInfo = (utilId: EMonoutilId, ...log: unknown[]) => {
  console.info(`[monoutil] [${utilId}]`, ...log);
};

export const logDefault = (utilId: EMonoutilId, ...log: unknown[]) => {
  console.log(`[monoutil] [${utilId}]`, ...log);
};

export const createLogger = (utilId: EMonoutilId) => {
  return {
    error: (error: unknown) => logError(utilId, error),
    info: (...log: unknown[]) => logInfo(utilId, ...log),
    warning: (warning: string, ...more: unknown[]) => logWarning(utilId, warning, ...more),
    log: (...log: unknown[]) => logDefault(utilId, ...log),
  };
};
