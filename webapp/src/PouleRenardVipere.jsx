
import { useEffect, useState } from "react";
import {
    Button, Image, ImageBackground, Text, View, Dimensions, StyleSheet
} from "react-native";
import { userNFTsWithIndexNoKey, userNFTsWithIndex, transformCopData } from "./Interactions/Constant";
import { getGameContract, getMintableCharacters, mintCharacterNFT, getUserNFTList, getCop, addToRaid } from "./Interactions/ContractInteractions";
import { connectWallet, getCurrentWalletConnected, installMetaMaskMessage } from "./Interactions/WalletInteractions";
import './OnePageApp.css'


const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const styles = StyleSheet.create({
    appContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    }
});

function PouleRenardVipere() {
    let randomNumber = Math.floor(Math.random() * 100) + 1;
    let userName = document.querySelector('.userName');

    const [playerNames, setPlayerNames] = setState([]);
    const [poules, setPoules]           = setSate([]);
    const [renards, setPoules]          = setSate([]);
    const [viperes, setPoules]          = setSate([]);
    const [playerPoules , set]          = setSate({});
    const [playerRenards, set]          = setSate({});
    const [playerViperes, set]          = setSate({});


    function generateOneAnimal() {
        let ran = randomNumber;

        if (ran <= 33) return 1; // Poule
        else if (ran <= 66) return 2; // Renard
        else return 3; // Vipere
    }

    function generatePlayerAnimals(playerName) {
        // on genre 20 elements par joueur
        for (i in 20) {
            let kind = generateOneAnimal();
            if (kind == 1) {
                let id = poules.push("Poule" + i);
                if (playerName in playerPoules) {
                    playerPoules[playerName].push(id);
                }
                else {
                    playerPoules[playerName] = [id];
                }
            }
            else if (kind == 2) {
                let id = renards.push("Renard" + i);
                if (playerName in playerRenards) {
                    playerRenards[playerName].push(id);
                }
                else {
                    playerRenards[playerName] = [id];
                }
            } else {
                let id = viperes.push("Renard" + i);
                if (playerName in playerViperes) {
                    playerViperes[playerName].push(id);
                }
                else {
                    playerViperes[playerName] = [id];
                }
            }
        }
    }

    return (
        <div>
            <div>
                <Button title="Your Name ?" onPress={() => onCreatePlayerPressed()} />

            </div>
        </div>
    )
}