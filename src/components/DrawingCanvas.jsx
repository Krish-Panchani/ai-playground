import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { FaUndo, FaRedo, FaEraser, FaPenAlt, FaTrashAlt } from 'react-icons/fa'; // Import icons
import { IoMdColorFill } from "react-icons/io";

const DrawingCanvas = forwardRef(({ onDrawingComplete, setIsCanvasEmpty }, ref) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [mode, setMode] = useState('draw');

  useEffect(() => {
    const setCanvasSize = () => {
      const canvas = canvasRef.current;
      const isMobile = window.innerWidth < 768; // Example breakpoint for mobile

      canvas.width = isMobile ? canvas.clientWidth : 800;
      canvas.height = isMobile ? canvas.clientHeight : 400;

      const ctx = canvas.getContext('2d');
      ctxRef.current = ctx;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setIsCanvasEmpty(true);
    };

    setCanvasSize(); // Initial size set
    window.addEventListener('resize', setCanvasSize);

    return () => window.removeEventListener('resize', setCanvasSize);
  }, [setIsCanvasEmpty]);

  useImperativeHandle(ref, () => ({
    clearCanvas
  }));

  const handleMouseDown = (e) => {
    if (mode === 'fill') {
      const { offsetX, offsetY } = e.nativeEvent;
      fillArea(offsetX, offsetY);
    } else {
      const ctx = ctxRef.current;
      ctx.strokeStyle = mode === 'erase' ? 'white' : color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
      setIsCanvasEmpty(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    const canvas = canvasRef.current;
    setIsDrawing(false);
    ctxRef.current.closePath();
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    onDrawingComplete(canvas.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    onDrawingComplete(canvas.toDataURL());
    setIsCanvasEmpty(true);
  };

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevImage = new Image();
      prevImage.src = history[currentStep - 1];
      prevImage.onload = () => {
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(prevImage, 0, 0);
      };
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextImage = new Image();
      nextImage.src = history[currentStep + 1];
      nextImage.onload = () => {
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(nextImage, 0, 0);
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.cursor = `url('data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${brushSize}" height="${brushSize}" viewBox="0 0 ${brushSize} ${brushSize}"><circle cx="${brushSize / 2}" cy="${brushSize / 2}" r="${brushSize / 2}" fill="${color}" /></svg>`)}') ${brushSize / 2} ${brushSize / 2}, auto`;
  }, [brushSize, color]);

  const fillArea = (startX, startY) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const startColor = getColorAtPixel(data, startX, startY);
    const fillColor = hexToRgb(color);

    if (colorsMatch(startColor, fillColor)) return;

    const stack = [[startX, startY]];
    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const currentColor = getColorAtPixel(data, x, y);

      if (colorsMatch(currentColor, startColor)) {
        setColorAtPixel(data, x, y, fillColor);
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    onDrawingComplete(canvas.toDataURL());
  };

  const getColorAtPixel = (data, x, y) => {
    const index = (y * canvasRef.current.width + x) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };

  const setColorAtPixel = (data, x, y, color) => {
    const index = (y * canvasRef.current.width + x) * 4;
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = 255; // alpha channel
  };

  const colorsMatch = (color1, color2) => {
    return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3];
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  return (
    <>
      <div className="bg-background rounded-lg border p-4 flex flex-col gap-4">
        <div className='flex-1 rounded-2xl px-2 py-2 border-2 border-blue-500'>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ border: '1px solid black' }}
            className='w-full h-auto rounded-2xl '
          />
        </div>
        <div className='flex items-center justify-evenly'>
          <div className="flex gap-2">
            <button onClick={() => setMode('draw')} className={`flex items-center gap-2 px-2 py-2 rounded-full mx-2 ${mode === 'draw' ? 'bg-cyan-400 text-white' : 'bg-gray-200'}`}>
              <FaPenAlt />
            </button>
            <button onClick={() => setMode('erase')} className={`flex items-center gap-2 px-2 py-2 rounded-full mx-2 ${mode === 'erase' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
              <FaEraser />
            </button>
            <button onClick={() => setMode('fill')} className={`flex items-center gap-2 px-2 py-2 rounded-full mx-2 ${mode === 'fill' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <IoMdColorFill />

            </button>
            <button onClick={clearCanvas} className="flex items-center bg-red-500 gap-2 px-2 py-2 text-white rounded-full mx-2">
              <FaTrashAlt />
            </button>
          </div>
          <div className='flex gap-2 items-center'>
          <button onClick={undo} className="bg-gray-800 px-2 py-2 text-white rounded-xl mx-2">
                    <FaUndo />
                  </button>
                  <button onClick={redo} className="bg-gray-800 px-2 py-2 text-white rounded-xl mx-2">
                    <FaRedo />
                  </button>
          </div>
          <div className='flex gap-2 items-center'>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className='w-10 h-10 bg-black'
            />

            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
              className='mx-2 accent-white'
            />
            <div className='flex justify-center items-center w-[55px] h-[55px] border-2 border-white bg-white rounded-full'>
              <div
                style={{
                  width: brushSize + 'px',
                  height: brushSize + 'px',
                  backgroundColor: color,
                  borderRadius: '50%',
                  border: '1px solid black',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
});

export default DrawingCanvas;
