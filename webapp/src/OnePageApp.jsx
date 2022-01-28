/**
 * Components
 * _ App
 *  |_ Mint [load mintable characters, render them with description and button 'Mint', event onMintDone]
 *      |_
 *  
 * |_ Character list [load user owned characters, render them, propose to pool for Cop attach, sell, ]  
 *      |_ 
 * 
 * |_ Market Place [list buyable characters ]  
 * 
 * 
 * 
 */

import { useEffect, useState } from "react";
import {
    Button, Image, ImageBackground, Text, View
} from "react-native";
import { userNFTsWithIndexNoKey, userNFTsWithIndex, transformCopData } from "./Interactions/Constant";
import { getGameContract, getMintableCharacters, mintCharacterNFT, getUserNFTList, getCop } from "./Interactions/ContractInteractions";
import { connectWallet, getCurrentWalletConnected, installMetaMaskMessage } from "./Interactions/WalletInteractions";


/** APP ROOT :: START */
function OnePageApp() {

    const backgroundImageSource = "http://img.over-blog-kiwi.com/1/18/22/61/20141011/ob_bab9dd_sin-city-a-dame-to-kill-for-marv-poste.jpg";

    return (
        <ImageBackground source={backgroundImageSource}>
            {/* Cop Boss */}
            <View>
                <CopCharacter />
            </View>
            {/* Connection Button */}
            <View>
                <ConnectWallet />
            </View>
            {/* Template characters */}
            <View>
                <Mint />
            </View>
            {/* User owned */}
            <View>
                <UserCharacters />
            </View>
        </ImageBackground>
    )
}
/** APP ROOT :: START */





/** CONNECT WALLET :: START */
function ConnectWallet() {
    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        async function process() {
            console.log("ConnectWallet => wallet connection");
            const { address, } = await getCurrentWalletConnected();
            setWalletAddress(address);
            addWalletListener(setWalletAddress);
            console.log('ConnectWallet => ', address);
        }

        process();
    }, []);

    function addWalletListener(setWalletAddress) {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    console.log("👆🏽 Write a message in the text-field above.");
                } else {
                    setWalletAddress("");
                    console.log("🦊 Connect to Metamask using the top right button.");
                }
            });
        } else {
            console.log(installMetaMaskMessage);
        }
    };

    return (
        <Button onPress={() => connectWallet()} title={walletAddress ? walletAddress : 'Connect'} />
    )

}
/** CONNECT WALLET :: END */





/** HANDLE MINTABLE CHARACTERS :: START */
function Mint() {
    const [mintableNFTs, setMintableNFTs] = useState([]);

    // fetch mintable characters
    useEffect(() => {
        async function process() {
            const { prototypeCharacters, } = await getMintableCharacters();
            setMintableNFTs(userNFTsWithIndexNoKey(prototypeCharacters));
        }

        process();
    }, []);

    // register and clean on mint event listener
    useEffect(() => {
        async function process() {
            const { contract, } = await getGameContract();
            contract.on("CharacterNFTMinted", onMintDone);
            return () => {
                contract.off("CharacterNFTMinted", onMintDone);
            }
        }

        process();
    }, []);

    async function onMintDone(sender, tokenId, characterIndex) {
        console.log(
            `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
        );
    }

    async function onMintPressed(characterId) {
        console.log('5. onMintPressed => ', characterId);
        await mintCharacterNFT(characterId);
    };

    return (
        <View style={{ flexDirection: "row", padding: 20 }}>
            <MintableCharacters onMintPressed={onMintPressed} list={mintableNFTs} />
        </View>
    )
}
function MintableCharacters({ list, onMintPressed }) {
    return (
        list.map(function (item, index) {
            return <MintableCharacter
                name={item.name}
                hp={item.hp}
                maxHp={item.maxHp}
                imageURI={item.imageURI}
                characterIndex={item.characterIndex}
                id={item.id}
                onMintPressed={onMintPressed} />
        })
    );
}
function MintableCharacter({ name, hp, maxHp, imageURI, charisma, streetCred, characterIndex, id, onMintPressed }) {
    return (
        <View>
            <View>
                <Text>name {name}</Text>
            </View>
            <View>
                <Text>hp {hp}</Text>
            </View>
            <View>
                <Text>maxHp {maxHp}</Text>
            </View>
            <View>
                <Text>charisma {charisma}</Text>
            </View>
            <View>
                <Text>streetCred {streetCred}</Text>
            </View>
            <View >
                <Image source={{ uri: imageURI }} style={{ width: 100, height: 100 }} />
            </View>
            <View >
                <Button onPress={() => onMintPressed(() => characterIndex)} title="Mint" />
            </View>
        </View>
    )
}
/** HANDLE MINTABLE CHARACTERS :: END */





/** HANDLE USER CHARACTERS :: START */
function UserCharacters() {
    const [userNFTs, setUserNFTs] = useState([]);
    const [selectedCharacterList, updateSelectedCharacterList] = useState([]);

    useEffect(() => {
        async function process() {
            const response = await getUserNFTList();
            const listWithIndex = userNFTsWithIndexNoKey(response.userNFTList)
            setUserNFTs(listWithIndex);
        }
        console.log('UserCharacters => get user owned NFTs');
        process();
    }, [])

    function onSelectCharacter(key) {
        console.log('update selected w/ ', key);

        var array = [...selectedCharacterList];
        var index = array.indexOf(key);
        if (index !== -1) {
            array.splice(index, 1);
            updateSelectedCharacterList(arr => array);
        }

        else updateSelectedCharacterList(arr => [...arr, key]);

    }

    function isAlreadySelected(key) {
        return selectedCharacterList.includes(key);
    }

    return (
        userNFTs.map(function (item, index) {
            return <UserCharacter
                name={item.name}
                hp={item.hp}
                maxHp={item.maxHp}
                imageURI={item.imageURI}
                characterIndex={item.characterIndex}
                id={item.id}
                onSelectCharacter={onSelectCharacter} />
        })
    );
}
function UserCharacter({ name, hp, maxHp, imageURI, charisma, streetCred, characterIndex, id, onSelectCharacter }) {
    return (
        <View>
            <View>
                <Text>name {name}</Text>
            </View>
            <View>
                <Text>hp {hp}</Text>
            </View>
            <View>
                <Text>maxHp {maxHp}</Text>
            </View>
            <View>
                <Text>charisma {charisma}</Text>
            </View>
            <View>
                <Text>streetCred {streetCred}</Text>
            </View>
            <View>
                <Text>id {id}</Text>
            </View>
            <View >
                <Image source={{ uri: imageURI }} style={{ width: 100, height: 100 }} />
            </View>
            <View >
                <Button onPress={() => onSelectCharacter(id)} title="🤜 Ready to fight 🤛" />
            </View>
        </View>
    )
}
/** HANDLE MINTABLE CHARACTERS :: END */





/** HANDLE COP :: START */
function CopCharacter(){
    const [cop, setCop] = useState({});

    useEffect(() => {
        async function process() {
            const response = await getCop();
            const copCharacter = response.copCharacter;
            setCop(copCharacter);
        }
        console.log('Cop => fetch');
        process();
    }, [])

    return (
        <View>
            <View>
                <Text>name {cop.name}</Text>
            </View>
            <View>
                <Text>hp {cop.hp}</Text>
            </View>
            <View>
                <Text>maxHp {cop.maxHp}</Text>
            </View>
            <View>
                <Text>streetCred {cop.streetCred}</Text>
            </View>
            <View >
                <Image source={{ uri: cop.imageURI }} style={{ width: 100, height: 100 }} />
            </View>
        </View>
    )
 
}
/** HANDLE COP :: END */


export default OnePageApp