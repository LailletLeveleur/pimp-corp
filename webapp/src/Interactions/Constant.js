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

const userNFTsWithIndex = (list) => {
  return list.map((characterData, index) => {
    return {
        key: index,
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp,
        maxHp: characterData.maxHp,
        charisma: characterData.charisma,
        streetCred: characterData.streetCred,
      }
    }
  )
}

export { CONTRACT_ADDRESS, RINKEBY_CHAIN_ID, transformCharacterData, userNFTsWithIndex };