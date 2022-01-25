/**
 * - Ensure connectivity
 * - Get a list of the mintable NFT (the template if any)
 * - On each of them offer a 'Mint' button
 */
import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, installMetaMaskMessage, addWalletListener } from "../Interactions/WalletInteractions.js";
import { getGameContract, getMintableCharacters, mintCharacterNFT } from '../Interactions/ContractInteractions.js'
import { transformCharacterData } from '../Interactions/Constant.js';
import '../Mint/Mint.js';

const Mint = (setUserNFTs) => {

    // State variables
    const [walletAddress, setWalletAddress] = useState("");
    const [mintableNFTs, setMintableNFTs] = useState("");
    // const [userNFTs, setUserNFTs] = useState("");

    /** Lifecycle */
    // wallet connection
    useEffect(async () => {
        async function process() {
            console.log("1. useEffect => wallet connection");
            const { address, } = await getCurrentWalletConnected();
            setWalletAddress(address);
            addWalletListener(setWalletAddress);

            console.log('address: ', address);
        }

        process();
    }, []);

    // list of mintable characters
    useEffect(async () => {

        async function process() {
            console.log("2. useEffect => list of mintable characters");
            const { prototypeCharacters, } = await getMintableCharacters();
            setMintableNFTs(prototypeCharacters);

            console.log('2. prototypeCharacters: ', prototypeCharacters);
        }

        process();
    }, []);

    // register and clean on mint event listener
    useEffect(async () => {
        async function process() {
            console.log("3. useEffect => register and clean on mint event listener");
            const { contract, } = await getGameContract();
            console.log("3. useEffect => ", contract);
            contract.on("CharacterNFTMinted", onMintDone);

            return () => {
                contract.off("CharacterNFTMinted", onMintDone);
            }
        }

        process();

    }, []);


    /** User interaction */
    const onConnectWalletPressed = async () => {
        console.log("4. onConnectWalletPressed");
        const { address, } = await connectWallet();
        setWalletAddress(address);
    };

    const onMintPressed = async (characterId) => {
        console.log('5. onMintPressed => ', characterId);
        mintCharacterNFT(characterId);
    };

    const onMintDone = async (sender, tokenId, characterIndex) => {
        console.log(
            `6. CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
        );
        try {
            const { contract, } = await getGameContract();
            const characterNFTs = await contract.getUserOwnedNFTs();
            const updatedUserNFTs = characterNFTs.map((characterNFT) => transformCharacterData(characterNFT));

            setUserNFTs(updatedUserNFTs);
        }
        catch (error) {
            console.error(error);
        }
    }

    /** Render */
    const renderMintableCharacters = () => {
        return mintableNFTs.map((character) => {
            <div className="character-item" key={character.name}>
                <div className="name-container">
                    <p>{character.name}</p>
                    <p>{character.charisma}</p>
                    <p>{character.streetCred}</p>
                </div>
                <img src={character.imageURI} alt={character.name} />
                <button
                    type="button"
                    className="character-mint-button"
                    onClick={() => onMintPressed(character.index)}
                >{`Mint ${character.name}`}</button>
            </div>
        }
        );
    }


    const renderAll = () => {
        console.log("8. render");
        return (
            <div className="Minter">
                <button id="walletButton" onClick={onConnectWalletPressed}>
                    {walletAddress.length > 0 ? (
                        "Connected: " +
                        String(walletAddress).substring(0, 6) +
                        "..." +
                        String(walletAddress).substring(38)
                    ) : (
                        <span>Connect Wallet</span>
                    )}
                </button>
                <br></br>
                {console.log('trying to render mintable characters')}
                <div className="character-grid">
                    {mintableNFTs.length}
                    {mintableNFTs && mintableNFTs.map((character, index) => { 
                        return <div className="character-item" key={character.name}>
                            <div className="name-container">
                                <p>NAME: {character.name}</p>
                                <p>CHARISMA: {character.charisma}</p>
                                <p>STREET CRED: {character.streetCred}</p>
                                <p>INDEX: {character.index}</p>
                                <p>ID: {character.id}</p>
                            </div>
                            <img className="character-image" src={character.imageURI} alt={character.name} />
                            <button
                                type="button"
                                className="character-mint-button"
                                onClick={() => onMintPressed(index)}
                            >{`Mint ${character.name}`}</button>
                        </div>
                    }
                    )}
                    {/* {mintableNFTs.map(function(c, i) {return <div>XYZ</div>})} */}
                </div>


            </div>
        );
    }

    return renderAll();
}

export default Mint;