import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import {
  Canvas,
  Circle,
  CircleBrush,
  Line,
  PencilBrush,
  Rect,
  SprayBrush,
} from "fabric";
import {
  FaCircle,
  FaEraser,
  FaHighlighter,
  FaMinus,
  FaMarker,
  FaPenAlt,
  FaRedo,
  FaSquare,
  FaSprayCan,
  FaTrashAlt,
  FaUndo,
} from "react-icons/fa";
import { IoMdColorFill } from "react-icons/io";

import Tooltip from "./ui/Tooltips";

const PRESET_COLORS = [
  "#111827",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#ffffff",
];

const SHAPE_MODES = new Set(["line", "rect", "circle"]);

const getCanvasSize = (parentWidth) => {
  const width = Math.max(280, Math.min(parentWidth || 640, 720));
  let height;
  if (width < 480) {
    height = Math.round(width * 0.85);
  } else if (width < 768) {
    height = Math.round(width * 0.72);
  } else {
    height = Math.round(width * 0.62);
  }
  return { width, height: Math.max(260, height) };
};

const hexToRgba = (hex, alpha) => {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ToolButton = ({ active, onClick, label, children }) => (
  <Tooltip message={label}>
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`rounded-full px-3 py-2 transition-colors ${
        active ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/40" : "bg-slate-700 text-slate-200 hover:bg-slate-600"
      }`}
    >
      {children}
    </button>
  </Tooltip>
);

const DrawingCanvas = forwardRef(({ onDrawingComplete, setIsCanvasEmpty, disabled = false }, ref) => {
  const containerRef = useRef(null);
  const canvasElRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const suppressHistoryRef = useRef(false);
  const currentStepRef = useRef(-1);
  const shapeStartRef = useRef(null);
  const previewShapeRef = useRef(null);

  const [color, setColor] = useState("#111827");
  const [brushSize, setBrushSize] = useState(8);
  const [opacity, setOpacity] = useState(100);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [mode, setMode] = useState("draw");

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  const emitCanvasUpdate = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const imageDataUrl = canvas.toDataURL({ format: "png", quality: 1 });
    onDrawingComplete(imageDataUrl);
    setIsCanvasEmpty(canvas.getObjects().length === 0);
  };

  const pushHistory = () => {
    if (suppressHistoryRef.current) return;
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const snapshot = JSON.stringify(canvas.toJSON());
    setHistory((previous) => {
      const trimmed = previous.slice(0, currentStepRef.current + 1);
      const next = [...trimmed, snapshot];
      const nextStep = next.length - 1;
      currentStepRef.current = nextStep;
      setCurrentStep(nextStep);
      return next;
    });
    emitCanvasUpdate();
  };

  const applyBrush = (canvas, toolMode) => {
    const alpha = opacity / 100;
    const strokeColor = toolMode === "highlighter" ? hexToRgba(color, Math.min(0.45, alpha)) : color;

    if (toolMode === "spray") {
      const spray = new SprayBrush(canvas);
      spray.color = strokeColor;
      spray.width = brushSize * 2;
      spray.density = 18;
      spray.dotWidth = Math.max(1, Math.round(brushSize / 4));
      canvas.freeDrawingBrush = spray;
      return;
    }

    if (toolMode === "marker") {
      const marker = new CircleBrush(canvas);
      marker.color = strokeColor;
      marker.width = Math.max(brushSize, 12);
      canvas.freeDrawingBrush = marker;
      return;
    }

    const pencil = new PencilBrush(canvas);
    pencil.color = toolMode === "highlighter" ? strokeColor : strokeColor;
    pencil.width = toolMode === "highlighter" ? Math.max(brushSize, 14) : brushSize;
    canvas.freeDrawingBrush = pencil;
  };

  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;

    const canvas = new Canvas(canvasElRef.current, {
      isDrawingMode: true,
      backgroundColor: "#ffffff",
    });
    fabricCanvasRef.current = canvas;

    const resize = () => {
      const parentWidth = containerRef.current?.clientWidth || 640;
      const { width, height } = getCanvasSize(parentWidth);
      canvas.setDimensions({ width, height });
      canvas.requestRenderAll();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);
    window.addEventListener("resize", resize);

    applyBrush(canvas, "draw");
    canvas.on("path:created", pushHistory);
    pushHistory();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.off("path:created", pushHistory);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || disabled) return;

    if (mode === "fill") {
      canvas.isDrawingMode = false;
      const fillRect = new Rect({
        left: 0,
        top: 0,
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        fill: color,
        selectable: false,
        evented: false,
      });
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.add(fillRect);
      canvas.sendObjectToBack(fillRect);
      canvas.requestRenderAll();
      pushHistory();
      setMode("draw");
      return;
    }

    if (SHAPE_MODES.has(mode)) {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      return;
    }

    canvas.isDrawingMode = true;
    canvas.selection = false;

    if (mode === "erase") {
      const eraser = new PencilBrush(canvas);
      eraser.color = "#ffffff";
      eraser.width = Math.max(brushSize, 10);
      canvas.freeDrawingBrush = eraser;
      return;
    }

    applyBrush(canvas, mode);
  }, [mode, color, brushSize, opacity, disabled]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || disabled || !SHAPE_MODES.has(mode)) return undefined;

    const removePreview = () => {
      if (previewShapeRef.current) {
        canvas.remove(previewShapeRef.current);
        previewShapeRef.current = null;
      }
    };

    const onMouseDown = (event) => {
      const pointer = canvas.getPointer(event.e);
      shapeStartRef.current = pointer;
      removePreview();
    };

    const onMouseMove = (event) => {
      if (!shapeStartRef.current) return;
      const pointer = canvas.getPointer(event.e);
      const start = shapeStartRef.current;
      removePreview();

      let shape;
      if (mode === "line") {
        shape = new Line([start.x, start.y, pointer.x, pointer.y], {
          stroke: color,
          strokeWidth: brushSize,
          selectable: false,
          evented: false,
        });
      } else if (mode === "rect") {
        shape = new Rect({
          left: Math.min(start.x, pointer.x),
          top: Math.min(start.y, pointer.y),
          width: Math.abs(pointer.x - start.x),
          height: Math.abs(pointer.y - start.y),
          fill: "transparent",
          stroke: color,
          strokeWidth: brushSize,
          selectable: false,
          evented: false,
        });
      } else {
        const radius = Math.hypot(pointer.x - start.x, pointer.y - start.y) / 2;
        shape = new Circle({
          left: start.x - radius,
          top: start.y - radius,
          radius: Math.max(radius, 1),
          fill: "transparent",
          stroke: color,
          strokeWidth: brushSize,
          selectable: false,
          evented: false,
        });
      }

      previewShapeRef.current = shape;
      canvas.add(shape);
      canvas.requestRenderAll();
    };

    const onMouseUp = (event) => {
      if (!shapeStartRef.current) return;
      const pointer = canvas.getPointer(event.e);
      const start = shapeStartRef.current;
      removePreview();

      let shape;
      if (mode === "line") {
        shape = new Line([start.x, start.y, pointer.x, pointer.y], {
          stroke: color,
          strokeWidth: brushSize,
          selectable: false,
          evented: false,
        });
      } else if (mode === "rect") {
        shape = new Rect({
          left: Math.min(start.x, pointer.x),
          top: Math.min(start.y, pointer.y),
          width: Math.abs(pointer.x - start.x),
          height: Math.abs(pointer.y - start.y),
          fill: "transparent",
          stroke: color,
          strokeWidth: brushSize,
          selectable: false,
          evented: false,
        });
      } else {
        const radius = Math.hypot(pointer.x - start.x, pointer.y - start.y) / 2;
        shape = new Circle({
          left: start.x - radius,
          top: start.y - radius,
          radius: Math.max(radius, 1),
          fill: "transparent",
          stroke: color,
          strokeWidth: brushSize,
          selectable: false,
          evented: false,
        });
      }

      canvas.add(shape);
      canvas.requestRenderAll();
      shapeStartRef.current = null;
      pushHistory();
    };

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);
    canvas.on("mouse:up", onMouseUp);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("mouse:up", onMouseUp);
      shapeStartRef.current = null;
      removePreview();
    };
  }, [mode, color, brushSize, disabled]);

  const clearCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.requestRenderAll();
    pushHistory();
  };

  const loadHistoryStep = (nextStep) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || nextStep < 0 || nextStep >= history.length) return;

    suppressHistoryRef.current = true;
    canvas.loadFromJSON(history[nextStep]).then(() => {
      canvas.requestRenderAll();
      currentStepRef.current = nextStep;
      setCurrentStep(nextStep);
      suppressHistoryRef.current = false;
      emitCanvasUpdate();
    });
  };

  const undo = () => loadHistoryStep(currentStep - 1);
  const redo = () => loadHistoryStep(currentStep + 1);

  useImperativeHandle(ref, () => ({
    clearCanvas,
    exportDataUrl: () =>
      fabricCanvasRef.current?.toDataURL({ format: "png", quality: 1 }) || null,
  }));

  return (
    <div className={`flex flex-col gap-3 ${disabled ? "pointer-events-none opacity-70" : ""}`}>
      <div
        ref={containerRef}
        className="w-full rounded-2xl border-2 border-cyan-500/50 bg-white p-2 shadow-inner"
      >
        <canvas ref={canvasElRef} className="mx-auto block max-w-full rounded-xl touch-none" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900/90 p-3">
        <div className="flex flex-wrap gap-2">
          <ToolButton active={mode === "draw"} onClick={() => setMode("draw")} label="Pen">
            <FaPenAlt />
          </ToolButton>
          <ToolButton active={mode === "marker"} onClick={() => setMode("marker")} label="Marker">
            <FaMarker />
          </ToolButton>
          <ToolButton active={mode === "highlighter"} onClick={() => setMode("highlighter")} label="Highlighter">
            <FaHighlighter />
          </ToolButton>
          <ToolButton active={mode === "spray"} onClick={() => setMode("spray")} label="Spray">
            <FaSprayCan />
          </ToolButton>
          <ToolButton active={mode === "erase"} onClick={() => setMode("erase")} label="Eraser">
            <FaEraser />
          </ToolButton>
          <ToolButton active={mode === "line"} onClick={() => setMode("line")} label="Line">
            <FaMinus className="rotate-90" />
          </ToolButton>
          <ToolButton active={mode === "rect"} onClick={() => setMode("rect")} label="Rectangle">
            <FaSquare />
          </ToolButton>
          <ToolButton active={mode === "circle"} onClick={() => setMode("circle")} label="Circle">
            <FaCircle />
          </ToolButton>
          <ToolButton active={false} onClick={() => setMode("fill")} label="Fill background">
            <IoMdColorFill />
          </ToolButton>
          <ToolButton active={false} onClick={clearCanvas} label="Clear all">
            <FaTrashAlt />
          </ToolButton>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-label={`Color ${preset}`}
              onClick={() => setColor(preset)}
              className={`h-7 w-7 rounded-full border-2 ${
                color === preset ? "border-cyan-400 scale-110" : "border-slate-600"
              }`}
              style={{ backgroundColor: preset }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-9 w-9 cursor-pointer rounded border border-slate-600 bg-slate-800"
            aria-label="Custom color"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-slate-300">
            Size
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(event) => setBrushSize(Number(event.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span className="w-6 text-white">{brushSize}</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            Opacity
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(event) => setOpacity(Number(event.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span className="w-8 text-white">{opacity}%</span>
          </label>
          <button
            type="button"
            onClick={undo}
            disabled={currentStep <= 0}
            className="rounded-lg bg-slate-700 px-3 py-2 text-white disabled:opacity-40"
            aria-label="Undo"
          >
            <FaUndo />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={currentStep >= history.length - 1}
            className="rounded-lg bg-slate-700 px-3 py-2 text-white disabled:opacity-40"
            aria-label="Redo"
          >
            <FaRedo />
          </button>
        </div>
      </div>
    </div>
  );
});

export default DrawingCanvas;
