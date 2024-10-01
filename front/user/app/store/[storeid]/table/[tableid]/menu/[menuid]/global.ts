let globalMenuPk: number = 0;
let globalStorePk: number = 0;
let globalUserPk: number = 0;
let globalCartPk: number = 0;

export const setGlobalMenuPk = (pk: number) => {
  globalMenuPk = pk;
};

export const getGlobalMenuPk = () => {
  return globalMenuPk;
};

export const setGlobalStorePk = (pk: number) => {
  globalStorePk = pk;
};

export const getGlobalStorePk = () => {
  return globalStorePk;
};

export const setGlobalUserPk = (pk: number) => {
  globalUserPk = pk;
};

export const getGlobalUserPk = () => {
  return globalUserPk;
};

export const setGlobalCartPk = (pk: number) => {
  globalCartPk = pk;
};

export const getGlobalCartPk = () => {
  return globalCartPk;
};