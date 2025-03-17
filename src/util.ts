export const assertNever = (arg: never): never => {
  throw new Error(`Should have been never but got ${arg} instead`);
};
