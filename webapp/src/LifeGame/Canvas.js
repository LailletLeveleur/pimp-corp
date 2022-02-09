import React, { useState, useEffect, useRef } from 'react';
import cop1 from '../cop1.png';

function Canvas({ matrix, width, height, colorize }) {
    const canvasRef = useRef(null)
    const cellSide = 10;

    function defaultAliveColor(){        
        let minR = 0;
        let maxR = 204;
        let minG = 76;
        let maxG = 255;
        let minB = 61;
        let maxB = 244;

        let r = minR + Math.floor(Math.random() * (maxR - minR));
        let g = minG + Math.floor(Math.random() * (maxG - minG));
        let b = minB + Math.floor(Math.random() * (maxB - minB));
        
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

                let cellColor = colorize(matrix[i][j]);
                
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

export default Canvas;