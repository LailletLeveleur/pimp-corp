/**
 * 
 *  Jeu de la vie à 2 joueurs
 *  La vie et mort est identique au jeu originel
 *  Lors les cellules des joueurs se situent sur le meme emplacement
 *  La forme ayant le plus de cellules voisins autour d elle gagne
 *  En cas d egalité elle se neutralisent et l emplacement vide
 * 
 * @dev chaque joueur dispose d'une matrice indépendante
 * lors du rendu
 * definition d'un emplacement {state, owner}
 *  
 */

import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas.js';


function MultiPlayerLifeGame() {
    const players = {};
    const X = 50;
    const Y = 50;
    const [matrix, setMatrix] = useState(createRandomMatrix());
    const [run, setRun] = useState(false);
    const intervalRef = useRef();

    /** LIFECYCLE */
    useEffect(() => {
        let id;
        id = setInterval(() => {
            if (run) {
                const newMatrix = next(matrix);
                setMatrix(newMatrix);  
            }
        }, 1000);
        intervalRef.current = id;

        return () => {
            clearInterval(intervalRef.current);
        };
    });
    function stop() {
        setRun(false);
        clearInterval(intervalRef.current);
    }
    function start() {
        if (intervalRef.current) {
            console.log('! start -> ' + intervalRef.current);
            clearInterval(intervalRef.current);
        }
        const id = setInterval(() => {
            const newMatrix = next(matrix);
            setMatrix(newMatrix);  
        }, 1000);
        intervalRef.current = id;
        console.log('! start -> ' + intervalRef.current);
        setRun(true);
    }

    /** INIT */
    function emptyMatrix() {
        return Array(X).fill().map(() => Array(Y).fill({ "state": 0, "owner": 0 }));
    }
    function randomCell() {
        let state = Math.round(Math.random() * 1);
        let owner;
        if(state == 0){
            owner = 0;
        } else {
            owner = Math.round(Math.random() * 2);
        }

        return { "state": state, "owner": owner };
    }
    function createRandomMatrix() {
        const m = Array(X).fill().map(() => Array(Y).fill().map(randomCell));
        return m;
    }

    /** UTILS */
    function getFirstPropFromObj(obj){
        return Object.keys[0];
    }

    /** COMPUTE */
    function next(matrix) {
        let join = emptyMatrix();

        matrix.forEach((row, x) => {
            row.forEach((val, y) => {

                // neigbor list
                let neighbors = getNeighbors(matrix, x, y);
                let newOwner = {
                    "owner": 0,
                    "state": 0
                }

                if (atLeastOneAlive(neighbors)) {
                    // which owner has the most neighbors
                    let winnerName = getFirstPropFromObj(winner(neighbors));

                    newOwner = {
                        "owner": winnerName,
                        "state": 0
                    };
                }
                
                join[x][y] = newOwner;
            })
        })
        // console.log('+++++++++++++++++++JOIN++++++++++++++++++++');
        // console.table(join);
        // console.log('+++++++++++++++++++JOIN++++++++++++++++++++');
        return join;
    }
    function atLeastOneAlive(n) {
        return n.filter(x => x.state == 1).length > 0;
    }
    function winner(n) {

        var ownerNeighborsCount = {};
        // get distinct player names
        let players = [...new Set(n.map(item => item.owner))];
        // set 
        players.forEach((p) => { ownerNeighborsCount[p] = 0; });

        n.forEach((val, x) => {
            // player already exists
            if (val.owner in ownerNeighborsCount) {
                // increment owner count
                let newCount = ownerNeighborsCount[val.owner] + 1;
                ownerNeighborsCount[val.owner] = newCount;
            }
            // not already listed
            else {
                ownerNeighborsCount[val.owner] = 1;
            }
        })

        console.log('ownerNeighborsCount:' + JSON.stringify(ownerNeighborsCount));
        // players name 0,1,n

        // console.log('players:' + players);

        // winner init 
        let firstPlayerName = Object.keys(ownerNeighborsCount)[0];
        var winner = {};
        // console.log('ownerNeighborsCount[0]:' + JSON.stringify(ownerNeighborsCount[0]));
        winner[firstPlayerName] = ownerNeighborsCount[0];
        let currentWinnerName = Object.keys(winner)[0];
        // console.log('init winner:' + JSON.stringify(winner));

        // console.log('init currentWinnerName:' + currentWinnerName);
        // iterate players
        players.forEach((p) => {


            let currentWinnerName = Object.keys(winner);
            let currentWinnerValue = winner[currentWinnerName];
            let currentPlayerValue = ownerNeighborsCount[p];
            // current player count > current winner, replacing winner
            if (currentWinnerValue < currentPlayerValue) {
                let newWinner = {};
                newWinner[p] = currentPlayerValue;
                winner = newWinner;
            }
            // equality, this is tricky, the winner is the death !!!
            else if (currentWinnerValue == currentPlayerValue) {
                winner = { "0": currentPlayerValue };
            }
        });
        console.log('winner: ' + JSON.stringify(winner));
        return winner;
    }
    function getNeighbors(m, x, y) {
        return [
            getCell(m, x - 1, y - 1),
            getCell(m, x - 1, y),
            getCell(m, x - 1, y + 1),
            getCell(m, x, y - 1),
            getCell(m, x, y + 1),
            getCell(m, x + 1, y - 1),
            getCell(m, x + 1, y),
            getCell(m, x + 1, y + 1)
        ]
    }
    function getCell(m, x, y) {
        if (x < 0 || x > X - 1 || y < 0 || y > Y - 1) {
            return { state: 0, owner: 0 };
        } else {
            return m[x][y];
        }
    }

    /** HANDLE CLICKS */
    function handleClick(x, y, v) {
        const newMatrix = [...matrix];

        let newOwner = v.owner + 1;
        let newState;        
        if(newOwner > 3){
            newOwner = 0;
            newState = 0;
        } else  {
            newState = 1;
        }

        newMatrix[x][y] = {"owner": newOwner, "state": newState};
        setMatrix(newMatrix);
    }
    function handleNext() {
        const newMatrix = next(matrix);
        setMatrix(newMatrix); 
    }

    /** RENDER */
    function cellColor(colContent){
        const colors = ["black", "grey", "red", "green", "orange", "blue"]        
        return colors[colContent.owner]
    }
    function renderMatrix() {
        return (
            <table><tbody>
                {matrix.map((row, x) => {
                    return (
                        <tr key={x}>
                            {row.map((cell, y) => {
                                return (
                                    // width:500px;height:100px;border:1px solid #000;
                                    <td key={y}>
                                        <button
                                            key={x + "_" + y}
                                            onClick={() => handleClick(x, y, cell)}
                                            style={{ backgroundColor: cellColor(cell) }}>
                                                {cell.owner}
                                        </button>
                                    </td>
                                )
                            })
                            }
                        </tr>
                    )
                })
                }
            </tbody></table>
        )
    }

    function colorize(cell){
        let color;
        if(cell.owner == 0){
            color = "black"
        } else if (cell.owner == 1){
            color = "green"            
        } else if(cell.owner == 2){
            color = "blue"
        } else if(cell.owner == 3){
            color = "red"
        } else {
            color = "yellow"
        }
        return color;
    }

    return (
        <div>
            <div>
                <button onClick={() => handleNext()} >{"Next..."}</button>
                <button onClick={() => stop()} >STOP</button>
                <button onClick={() => start()} >START</button>
                <p>{intervalRef.current}</p>
            </div>
            <div><Canvas 
                matrix={matrix} 
                width={X} height={Y} 
                colorize={(cell) => colorize(cell)} /></div>
            <div>{renderMatrix()}</div>
        </div>
    )
}

export default MultiPlayerLifeGame;