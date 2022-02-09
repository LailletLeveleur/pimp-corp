/**
 * 
 * Des NFTS cellules
 * Des virus generes aléatoirement
 * 
 * Cellule dispose de A,B,C,D, généré a partir de ?
 * lors de la survie d un virus la cellule augmente ses defenses
 * 
 * Virus
 * - attachement
 * - penetration
 * - decapsidation
 * - replication
 * - assemblage
 * - maturation
 * 
 * Modele simplifié
 * - transmissibilité = nombre de virus diffusé
 * - les cellules de base identique sont infectées
 * - une proba (p) definit si meurt ou immunisé
 * 
 * Cinematique
 * 1. INITIAL STATE: the SANE cells preexists
 * 2. PROPAGATION  : init virus state
 *  
 */

import neighborsCount from './LifeGameUtils.js'
import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas';



function PandemicNFT(){
    
    const baseNumber = 4;
    const bases = Array(baseNumber).fill().map((x,idx) => idx);
    const NEUTRAL  = 0;
    const SANE     = 1;
    const IMMUNE   = 2;
    const INFECTED = 50; 
    
    
    const [X, setX] = useState(15);  
    const [Y, setY] = useState(50);  
    
    const randomMatrix = () => Array(X).fill().map(() => Array(Y).fill(Math.round(Math.random()))); 
    
    const [matrix, setMatrix] = useState(randomMatrix);  
    const [run, setRun] = useState(false);
    const [spreadMinX, setSpreadMinX] = useState( -1 );
    const [spreadMaxX, setSpreadMaxX] = useState(  1 );
    const [spreadMinY, setSpreadMinY] = useState( -1 );
    const [spreadMaxY, setSpreadMaxY] = useState(  1 );
    const [transmissionRatio, setTransmissionRatio] = useState(2/10);
    const [cureChance, setCureChance] = useState(9/10);

    const intervalRef = useRef();



    /** LIFECYCLE */
    useEffect(() => {
        let id;
        id = setInterval(() => {
            if (run) {
                updateMatrix();
            }
        }, 1);
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
            clearInterval(intervalRef.current);
        }
        const id = setInterval(() => {
            const matrixWithVirus = contaminate(matrix, getSpread, transmissionRatio, cureChance)
            setMatrix(matrixWithVirus)
        }, 1000);
        intervalRef.current = id;
        setRun(true);
    }
    function newVirus() {
        const matrixWithVirus = contaminate(matrix, getSpread, transmissionRatio, cureChance)
        setMatrix(matrixWithVirus)
    }



    /** COMPUTE */
    function subMatrix(matrix, minX, maxX, minY, maxY){
        // let n = maxX - minX + maxY - minY + 2;
        if(minX <= 0) { minX = 0 }
        if(maxX >= X ){ maxX = X -1 }
        if(minY <= 0) { minY = 0 }
        if(maxY >= Y ){ maxY = Y -1 }
        
        let subM = [];

        
        for(var x = minX; x <= maxX; x++){
            for(var y = minY; y <= maxY; y++){
                try {
                    subM.push(matrix[x][y])
                } catch(error) {
                    console.error('error on x=' + x + ', y=' + y);
                    console.error(error);
                }
            }
        }
        return subM;
    }
    /** define an initial contamination
     *  each cell has a chance to be infected
     */
    function contaminate(matrix, spread, transmissionRatio, cureChance){
        let newMatrix = [...matrix];

        for(var x = 0; x < X; x++){
            for(var y = 0; y < Y; y++){

                let cell = matrix[x][y];
                
                // a cell
                if(cell == SANE){
                    // random
                    let ran = Math.random();
                    if(ran <= transmissionRatio){
                        console.log('x='+x+', y='+y+' has been infected !!!')
                        newMatrix[x][y] = INFECTED;
                    } else {
                        newMatrix[x][y] = SANE;
                    }
                }
            }
        }

        return newMatrix;
    }
    /**
     *  
     */
    function propagate(matrix, spread, transmissionRatio, cureChance){
        let newMatrix = [...matrix];
        matrix.forEach((row,idx) => 
            row.forEach((cell,idy) => {
                
                let ran = Math.random();
                let newState;
                // Not infected, a chance to get infection based on transmission ratio and at least 2 surrounding infected cells
                if( SANE == cell){
                    let spreadNeighbors = subMatrix(matrix,
                        idx - spread.minX,
                        idx + spread.maxX,
                        idy - spread.minY,
                        idy + spread.maxY
                    )
                    let infectedNeighborsCount = spreadNeighbors.flat().filter(element => element == INFECTED).length                    
                    if(ran < transmissionRatio && infectedNeighborsCount > 0){
                        console.log('x='+idx+', y='+idy+' has been infected !!!')
                        newState = INFECTED;
                    } else {                        
                        newState = SANE;
                    }
                } 
                // already infected, a chance to be either IMMUNE or dead (back to NEUTRAL)
                else if( INFECTED == cell){
                    if(ran <= cureChance){
                        newState = IMMUNE;
                    }
                    else {
                        newState = NEUTRAL;
                    }
                }
                // non living cell (NEUTRAL), a chance to come to life (normal LifeGame rules apply), 
                //  but if infected exists nearby a chance of infection
                else if( NEUTRAL == cell){
                    let neighbors = subMatrix(matrix,
                        idx - 1,
                        idx + 1,
                        idy - 1,
                        idy + 1
                    )
                    let flatten = neighbors.flat()
                    let saneCount = flatten.filter(element => (element == SANE) || (element == IMMUNE)).length
                    let infectedCount = flatten.filter(element => element == INFECTED).length
                    let livingCount = saneCount + infectedCount
                    if(livingCount == 3){
                        if(saneCount > infectedCount){
                            newState = SANE;        
                        }
                        else {
                            newState = INFECTED; 
                        }
                    } else {
                        newState = NEUTRAL;
                    }
                }
                // immune, nothing change
                else {
                    newState = IMMUNE;
                }

                newMatrix[idx][idy] = newState
            })
        );
        return newMatrix;
    }
    function isOver(matrix){
       let infectedExists = matrix.flat().find(cur => cur == INFECTED).length > 0;
       return infectedExists;
    }




    /** UPDATE */
    function getSpread(){
        return {
            "minX": spreadMinX,
            "maxX": spreadMaxX,
            "minY": spreadMinY,
            "maxY": spreadMaxY
        }
    }
    function updateMatrix() {
        const newMatrix = propagate(matrix, getSpread(), transmissionRatio, cureChance);
        setMatrix(newMatrix);
    }
    function updateMatrixCell(x, y, v) {
        const newMatrix = [...matrix];
        const newValue = v === NEUTRAL ? SANE : NEUTRAL;
        newMatrix[x][y] = newValue;
        setMatrix(newMatrix);
    }




    /** USER EVENTS */
    function handleClick(x, y, v) {
        updateMatrixCell(x, y, v);
    }
    function handleNext() {
        updateMatrix();
    }




    /** RENDER */
    function colorise(v){
        if(v == NEUTRAL) return "black"
        if(v == INFECTED) return "red"
        if(v == SANE) return "green"
        if(v == IMMUNE) return "white"
    }
    function renderMatrix() {
        return (
            <table><tbody>
                {
                    matrix.map((row, rowIndex) => {
                        return (
                            <tr key={"tr" + rowIndex}>
                                {
                                    row.map((colContent, colIndex) => {
                                        return (
                                            <td key={"td" + rowIndex + "_" + colIndex}>
                                                <button
                                                    onClick={() => handleClick(rowIndex, colIndex, colContent)}
                                                    key={"k" + rowIndex + "_" + colIndex}
                                                    style={{ backgroundColor: colorise(colContent) }}>

                                                    {colContent}

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
    return (
        <div>
            {/* <div>
                <Canvas matrix={matrix} width={X} height={Y}/>
            </div> */}
            <h3>PANDEMIC</h3>
            <div>
                <button onClick={() => handleNext()} >{"Next..."}</button>
                <button onClick={() => stop()} >STOP CONTAGION</button>
                <button onClick={() => start()} >ALEA JACTA EST</button>
                <button onClick={() => newVirus()} >NEW VIRUS</button>
                <label>rows</label>
                <input value={X} onInput={e => setX(e.target.value)}/>
                <label>columns</label>
                <input value={Y} onInput={e => setY(e.target.value)}/>

                <div>
                    <label>transmission ratio</label>
                    <input value={transmissionRatio} onInput={e => setTransmissionRatio(e.target.value)}/>

                    <label>cure chance</label>
                    <input value={cureChance} onInput={e => setCureChance(e.target.value)}/>

                    <label>min X</label>
                    <input value={spreadMinX} onInput={e => setSpreadMinX(e.target.value)}/>
                    <label>max X</label>
                    <input value={spreadMaxX} onInput={e => setSpreadMaxX(e.target.value)}/>
                    <label>min Y</label>
                    <input value={spreadMinY} onInput={e => setSpreadMinY(e.target.value)}/>
                    <label>max Y</label>
                    <input value={spreadMaxY} onInput={e => setSpreadMaxY(e.target.value)}/>
                </div> 

                <p>{intervalRef.current}</p>
            </div>
            {renderMatrix()}
            
        </div>
    )
}

export default PandemicNFT;