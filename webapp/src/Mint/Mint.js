/**
 * - Ensure connectivity
 * - Get a list of the mintable NFT (the template if any)
 * - On each of them offer a 'Mint' button
 */
import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, installMetaMaskMessage, addWalletListener } from "../Interactions/WalletInteractions.js";
import { getGameContract, getMintableCharacters, mintCharacterNFT, getUserNFTList } from '../Interactions/ContractInteractions.js'
import { transformCharacterData, userNFTsWithIndex, userNFTsWithIndexNoKey } from '../Interactions/Constant.js';
import MintableCharacters from "../MintableCharacters/MintableCharacters.js";
import {
    FlatList,
    View,
    Dimensions,
    Text,
    StyleSheet,
    Image,
    Button,
    VirtualizedList,
    SafeAreaView
} from "react-native";





function Mint({ setUserNFTs, setCount }) {

    // State variables
    const [walletAddress, setWalletAddress] = useState("");
    const [mintableNFTs, setMintableNFTs] = useState([]);




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
        setCount(currentCount => currentCount + 1);
    }, []);

    // list of mintable characters
    useEffect(async () => {

        async function process() {
            console.log("2. useEffect => list of mintable characters");
            const { prototypeCharacters, } = await getMintableCharacters();
            setMintableNFTs(userNFTsWithIndexNoKey(prototypeCharacters));

            // console.log('2. prototypeCharacters: setMintableNFTs', mintableNFTs);
            // console.log('2. prototypeCharacters: ', prototypeCharacters);
            setCount(currentCount => currentCount + 1);
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

    // devrait sans doute etre dans PimpList
    const onMintDone = async (sender, tokenId, characterIndex) => {
        console.log(
            `6. CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
        );

        const response = await getUserNFTList();
        setUserNFTs(userNFTsWithIndex(response.userNFTList));
    }
    /** Render */
    /**    const renderMintableCharacters = () => {
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
                    </div>
                </div>
            ); */
    /**
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
            </div>
        </div>
    );
} */
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            // marginTop: StatusBar.currentHeight,
        },
        item: {
            backgroundColor: '#7f8c8d',
            height: 150,
            justifyContent: 'center',
            marginVertical: 8,
            marginHorizontal: 16,
            padding: 20,
        },
        title: {
            fontSize: 26,
        },
    });

    const getItem = (data, index) => {
        // console.log("getItem.data => ", data);
        return {
            id: `${index}`,
            characterIndex: data.characterIndex,
            name: `${data.name}`,
            hp: `${data.hp}`,
            maxHp: `${data.maxHp}`,
            imageURI: `${data.imageURI}`,
        }
    };

    const getItemCount = (data) => data.length;

    const Item = ({ name, hp, maxHp, imageURI, characterIndex, id }) => (
        <View style={{ flexDirection: "row", height: 100, padding: 20 }}>
            <View style={{ backgroundColor: "#7f8c8d", flex: 0.3 }} >
                <Button onPress={() => onMintPressed(() => characterIndex.toNumber())} title="Mint" color="#7f8c8d" />
            </View>
            <View style={{ backgroundColor: "grey", flex: 0.1 }} >
                <Image style={{ width: 100, height: 53 }} source={{
                    uri: "https://store.playstation.com/store/api/chihiro/00_09_000/container/AR/es/99/UP1004-BLUS30557_00-AVAMP3SAOPAUGIRL/0/image?_version=00_09_000&platform=chihiro&bg_color=000000&opacity=100&w=720&h=720"
                }}
                ></Image>
            </View>
            <View style={{ backgroundColor: "grey", flex: 0.1 }} >
                <Text style={styles.title}>name {name}</Text>
            </View>
            <View style={{ backgroundColor: "#FFC300", flex: 0.1 }} >
                <Text style={styles.title}>{hp / maxHp}</Text>
            </View>
        </View>
    );


    const WalletButton = () => (
        <Button onPress={onConnectWalletPressed} title={walletAddress.length > 0 ? (
            "Connected: " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
        ) : (
            <span>Connect Wallet</span>
        )} color="black" />
    )

    return (
        <View>
            <SafeAreaView>
                <View style={{ flexDirection: "row", padding: 20 }}>
                    <MintableCharacters onMintPressed={onMintPressed} list={mintableNFTs} />
                </View>
            </SafeAreaView>
            <SafeAreaView style={styles.container}>
                <View>
                    <View >
                        <WalletButton />
                    </View>
                </View >
            </SafeAreaView>
        </View>
    );
}

export default Mint;