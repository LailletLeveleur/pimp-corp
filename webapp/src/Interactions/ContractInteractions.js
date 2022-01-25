import { CONTRACT_ADDRESS, transformCharacterData } from './Constant';
import pimpGame from '../PimpGame.json';
import { ethers } from 'ethers';


/**
 * 
 * @returns Isolated interactions with the contract
 * I suppose this is not performance effective not to store the contract instance for example
 * Will give it a try as it seems cleaner
 * 
 */

export const getGameContract = async () => {
    
    if (window.ethereum) { 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            pimpGame.abi,
            signer
        );

        console.log('Contract found! ', contract);
        return {
            contract: contract,
            status: 'Ok'
        }
    } else {
        console.log('Ethereum object not found');
        return {
            contract: "",
            status: 'Ethereum object not found'
        }
    }
}

export const getMintableCharacters = async () => {
    try {
        console.log('Getting contract characters to mint');
        const {contract, status} = await getGameContract();             
        const prototypeCharactersTxn = await contract.getAllPrototypeCharacters();
        console.log('charactersTxn:', prototypeCharactersTxn);
        const prototypeCharacters = prototypeCharactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        return {
            prototypeCharacters: prototypeCharacters,
            status: "Ok"
        }
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
        return {
            prototypeCharacters: [],
            status: error
        }
      }
}

export const getUserNFTList = async () => {
    try {        
        const { contract, } = await getGameContract();
        const characterNFTs = await contract.getUserOwnedNFTs();
        const updatedUserNFTs = characterNFTs.map((characterNFT) => transformCharacterData(characterNFT));
        // console.table(updatedUserNFTs);

        return {
            userNFTList: updatedUserNFTs,
            status: ""
        }
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
        return {
            userNFTList: [],
            status: error
        }
      }
}

export const mintCharacterNFT = async (characterId) => {
    try {
        const {contract, status} = await getGameContract();
        console.log('Minting character in progress...');
        const mintTxn = await contract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
        return {
            status: ""
        }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    }
  };
