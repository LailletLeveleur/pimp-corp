import React, { useState, useEffect, useRef } from 'react';
import './LifeGame.css';
import Canvas from 'Canvas.js';
import cop1 from '../cop1.png';


function LifeGame() {
    const X = 50;
    const Y = 50;
    const depth = 5;
    const randomMatrix = () => Array(X).fill().map(() => Array(Y).fill(Math.round(Math.random()))); 
    const emptyMatrix = () => Array(X).fill().map(() => Array(Y).fill(0));
    const emptyHisto = () => Array(X).fill().map(() => Array(Y).fill(0));
    const [matrix, setMatrix] = useState(randomMatrix);
    const [history, setHistory] = useState(emptyHisto);
    const [run, setRun] = useState(false);
    const intervalRef = useRef();



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
            //console.log('! start -> ' + intervalRef.current);
            clearInterval(intervalRef.current);
        }
        const id = setInterval(() => {
            updateMatrix();
        }, 1000);
        intervalRef.current = id;
        //console.log('! start -> ' + intervalRef.current);
        setRun(true);
    }


    function isRepeating() {
        const histoSize = history.length;

        const n = matrix;
        const nMinus1 = history[histoSize - 2];
        const nMinus2 = history[histoSize - 3];
        const nMinus3 = history[histoSize - 4];
        const nMinus4 = history[histoSize - 5];
        const nMinus5 = history[histoSize - 6];

        const curEqMinus1 = compare(n, nMinus1);
        const curEqMinus2 = compare(n, nMinus2);
        const curEqMinus3 = compare(n, nMinus3);
        const curEqMinus4 = compare(n, nMinus4);
        const curEqMinus5 = compare(n, nMinus5);

        if (curEqMinus1 || curEqMinus2 || curEqMinus3 || curEqMinus4 || curEqMinus5) {
            //console.log("### form seems to be stable with a comparing depth " + depth);
        }
    }
    function compare(left, right) {
        let eq = true;
        left.forEach((row, x) => {
            row.forEach((cell, y) => {
                if (cell == right[x][y]) {
                    eq = false;
                    return false;
                }
            })
            if (eq) {

            }
        })

        return eq;
    }



    function computeNext() {
        const matrixCopy = emptyMatrix();

        matrix.forEach((row, x) => {
            row.forEach((cellValue, y) => {
                let neighbors = neighborsCount(x, y);//  on prend en compte chaque cellule individuellement

                if ((cellValue == 1) && ((neighbors == 2) || (neighbors == 3))) {
                    matrixCopy[x][y] = 1;
                }
                else if ((cellValue == 0) && (neighbors == 3)) {
                    matrixCopy[x][y] = 1;
                }
                else {
                    matrixCopy[x][y] = 0;
                }
            })
        })

        return matrixCopy;
    }
    function updateMatrix() {
        const newMatrix = computeNext();
        setMatrix(newMatrix);
        const newHisto = [...history];
        newHisto.push(newMatrix);
        setHistory(newHisto);
    }
    function updateMatrixCell(x, y, v) {
        const newMatrix = [...matrix];
        const newValue = v === 1 ? 0 : 1;
        newMatrix[x][y] = newValue;
        setMatrix(newMatrix);
    }
    function neighborsCount(x, y) {
        let count =
            getCellValue(x - 1, y - 1) +
            getCellValue(x - 1, y) +
            getCellValue(x - 1, y + 1) +
            getCellValue(x, y - 1) +
            getCellValue(x, y + 1) +
            getCellValue(x + 1, y - 1) +
            getCellValue(x + 1, y) +
            getCellValue(x + 1, y + 1);

        return count;
    }
    function getCellValue(x, y) {
        if (x < 0 || x > X - 1 || y < 0 || y > Y - 1) {
            return 0;
        } else {
            const result = matrix[x][y];
            return result;
        }
    }



    function handleClick(x, y, v) {
        updateMatrixCell(x, y, v);
    }
    function handleNext() {
        updateMatrix();
    }



    function renderMatrix() {
        return (
            <table><tbody>
                {
                    matrix.map((rowContent, rowIndex) => {
                        return (
                            <tr key={rowIndex}>
                                {
                                    rowContent.map((colContent, colIndex) => {
                                        return (
                                            <td key={colIndex}>
                                                <button
                                                    onClick={() => handleClick(rowIndex, colIndex, colContent)}
                                                    key={rowIndex + "_" + colIndex}
                                                    style={{ backgroundColor: colContent === 0 ? "grey" : "red" }}>

                                                    {neighborsCount(rowIndex, colIndex)}

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
            <div>
                <Canvas matrix={matrix} width={X} height={Y}/>
            </div>
            <div>
                <button onClick={() => handleNext()} >{"Next..."}</button>
                <button onClick={() => stop()} >STOP</button>
                <button onClick={() => start()} >START</button>
                <p>{intervalRef.current}</p>
            </div>
            {renderMatrix()}
            
        </div>
    )
}

export default LifeGame;
/**
function Canvas({ matrix, width, height }) {
    const canvasRef = useRef(null)
    const cellSide = 10;


    function aliveColor(){
        let minR = 0;
        let maxR = 204;
        let minG = 76;
        let maxG = 255;
        let minB = 61;
        let maxB = 244;

        let r = minR + Math.floor(Math.random() * (maxR - minR));
        let g = minG + Math.floor(Math.random() * (maxG - minG));
        let b = minB + Math.floor(Math.random() * (maxG - minB));
        
        let color = 'rgb('+r+','+g+','+b+')';

        return color;
    }

    function deadColor(){
        let color = 'rgb(3,3,3)';
        return color;
    }

    const draw = ctx => {

        for (let i = 0; i < matrix.length; i++) {

            for (let j = 0; j < matrix[i].length; j++) {
                let x = j * cellSide;
                let y = i * cellSide;

                let cellColor = deadColor();
                if (matrix[i][j] === 1) cellColor = aliveColor();

                ctx.beginPath();
                ctx.fillStyle = cellColor;
                ctx.fillRect(x, y, cellSide, cellSide);
                
            }
        }
    }

    function downloadCanvasAsImage(){
        let downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', 'CanvasAsImage.png');
        let canvas = canvasRef.current;
        let dataURL = canvas.toDataURL('image/png');
        let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
        downloadLink.setAttribute('href',url);
        downloadLink.click();
    }

    useEffect(() => {

        const canvas = canvasRef.current;
        //console.log('canvasRef.current: ',canvasRef.current);
        const context = canvas.getContext('2d');
        
        canvas.width = width * 10;
        canvas.height = height * 10;

        //Our draw come here
        draw(context)
    }, [draw])

    return (
        <div>
            <canvas ref={canvasRef} {...matrix} id={canvasRef.current}/>
            <button onClick={() => downloadCanvasAsImage()}>Download</button>
            <img src={cop1} alt="cop1" id="img-cop1" />
        </div>
        )
}
 */