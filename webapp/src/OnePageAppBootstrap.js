
import { useEffect, useState } from "react";
import { userNFTsWithIndexNoKey, userNFTsWithIndex, transformCopData } from "./Interactions/Constant";
import { getGameContract, getMintableCharacters, mintCharacterNFT, getUserNFTList, getCop, addToRaid } from "./Interactions/ContractInteractions";
import { connectWallet, getCurrentWalletConnected, installMetaMaskMessage } from "./Interactions/WalletInteractions";

import BsButton from 'react-bootstrap/Button';
import BsImage from 'react-bootstrap/Image';
import { Container, Row, Col, CardGroup, Card, ProgressBar, Table } from 'react-bootstrap';


import {
    Button, Image, ImageBackground, Text, View, Dimensions, StyleSheet
} from "react-native";

import './OnePageAppBootstrap.css';

/** APP ROOT :: START */
function OnePageAppBootstrap() {

    // const backgroundImageSource = "https://static.fnac-static.com/multimedia/Images/FR/NR/ee/7a/50/5274350/1507-1/tsp20190624101242/J-ai-tue-pour-elle.jpg";
    // const backgroundImageSource = "http://img.over-blog-kiwi.com/1/18/22/61/20141011/ob_bab9dd_sin-city-a-dame-to-kill-for-marv-poste.jpg";
    const backgroundImageSource = "https://static.wikia.nocookie.net/sincity/images/2/2b/With_the_broads.jpg/revision/latest/scale-to-width-down/819?cb=20140118220525";
    const [selectedCharacterList, updateSelectedCharacterList] = useState([]);
    const [userNFTs, setUserNFTs] = useState([]);

    return (
        // <ImageBackground source={backgroundImageSource}>
        <Container>
            <Row>
                <Col>
                    <ConnectWallet />
                </Col>
            </Row>
            <Row>
                <br />
                <br />
                <br />
            </Row>
            <Row>
                {/* <Col>
                    <BsImage src={require("./POLICE_FIGHT.png")}></BsImage>
                </Col> */}
                <Col>
                    <CopCharacter />
                </Col>
            </Row>
            <Container>
                <Row>
                    <h1> Mintable characters</h1>
                </Row>
                <Row>
                    <Mint />
                </Row>
                <Row>
                    <h1> Your characters</h1>
                </Row>
                <Row>
                    <UserCharacters 
                    selectedCharacterList={selectedCharacterList} 
                    updateSelectedCharacterList={updateSelectedCharacterList}
                    userNFTs={userNFTs}
                    setUserNFTs={setUserNFTs}
                    />
                </Row>
                <Row>
                    {console.table('table =>', selectedCharacterList)}
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>HP</th>
                            </tr>
                        </thead>
                        <tbody>
                        {selectedCharacterList.map(function (c, i) {
                            let character = userNFTs[c];
                            return(
                                <tr>
                                  <td>{i}</td>
                                  <td>{character.name}</td>
                                  <td>{character.hp}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </Container>
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
        <BsButton
            variant="dark"
            bsClass='connect-wallet-button'
            onClick={() => connectWallet()} >{walletAddress ? walletAddress : 'Connect'}</BsButton>
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
        <CardGroup>
            <MintableCharacters onMintPressed={onMintPressed} list={mintableNFTs} />
        </CardGroup>

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
    )
}
function MintableCharacter({ name, hp, maxHp, imageURI, charisma, streetCred, characterIndex, id, onMintPressed }) {

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={require("./c" + (characterIndex + 1) + ".png")} />
            {/* <Card.Img variant="top" src={imageURI} /> */}
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{hp}</Card.Subtitle>
                <ProgressBar animated now={100 * hp / maxHp} />
            </Card.Body>
            <BsButton onClick={() => onMintPressed(characterIndex)} >💸 Mint 💸</BsButton>
        </Card>
    )
}
/** HANDLE MINTABLE CHARACTERS :: END */





/** HANDLE USER CHARACTERS :: START */
function UserCharacters({ selectedCharacterList, updateSelectedCharacterList, userNFTs, setUserNFTs }) {
    // const [userNFTs, setUserNFTs] = useState([]);
    // const [selectedCharacterList, updateSelectedCharacterList] = useState([]);

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

        async function process() {
            const addToRaidTxn = await addToRaid(key);
            // await addToRaidTxn.wait();

            var array = [...selectedCharacterList];
            var index = array.indexOf(key);
            if (index !== -1) {
                array.splice(index, 1);
                updateSelectedCharacterList(arr => array);
            } else {
                updateSelectedCharacterList(arr => [...arr, key]);
            }
        }

        process();
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

        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={require("./c" + (characterIndex + 1) + ".png")} />
            {/* <Card.Img variant="top" src={imageURI} /> */}
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{hp}</Card.Subtitle>
                <ProgressBar animated now={100 * hp / maxHp} />
            </Card.Body>
            <BsButton onClick={() => onSelectCharacter(id)} >🤜 Ready to fight 🤛</BsButton>
        </Card>
    )
}
/** HANDLE USER CHARACTERS :: END */





/** HANDLE COP :: START */
function CopCharacter() {
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
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={require("./cop1.png")} />
            {/* <Card.Img variant="top" src={cop.imageURI} /> */}
            <Card.Body>
                <Card.Title>{cop.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{cop.hp}</Card.Subtitle>
                <ProgressBar animated now={100 * cop.hp / cop.hpMax} />
            </Card.Body>
        </Card>
    )
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





/** HANDLE Attack :: START */
function Attack() {

    async function attack() {

    }


}

export default OnePageAppBootstrap