const CONTRACT_ADDRESS = '0x00C7fd0737Ca4D0717f152efABE5b7ed137E02b3';
const RINKEBY_CHAIN_ID = ';'
/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    charisma: characterData.charisma.toNumber(),
    streetCred: characterData.streetCred.toNumber(),
  };
};

export { CONTRACT_ADDRESS, RINKEBY_CHAIN_ID, transformCharacterData };