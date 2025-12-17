import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as ort from 'onnxruntime-web';
import { Detection, ViolationType, BoundingBox } from '../types';

const SNAPSHOT_PLACEHOLDER = 'https://picsum.photos/320/240';
// const WEBSOCKET_URL = 'ws://localhost:8000/ws/detect_stream'; // Hypothetical backend WebSocket URL
const ONNX_MODEL_PATH = '/models/yolov8s.onnx'; // Assuming YOLOv8s ONNX model is available here

export const LiveMonitor: React.FC = () => {
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as ort from 'onnxruntime-web';
import { Detection, ViolationType, BoundingBox } from '../types';

const SNAPSHOT_PLACEHOLDER = 'https://picsum.photos/320/240';
const ONNX_MODEL_PATH = '/models/yolov8s.onnx'; // Assuming YOLOv8s ONNX model is available here

export const LiveMonitor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [processingFrame, setProcessingFrame] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSimulation, setUseSimulation] = useState(false); // New state to toggle simulation

  // Reference for the original video dimensions
  const videoDimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        console.log("Loading ONNX model...");
        // Check if ONNX model exists
        const response = await fetch(ONNX_MODEL_PATH);
        if (!response.ok) {
            setError(`ONNX model not found at ${ONNX_MODEL_PATH}. Please ensure yolov8s.pt is converted to yolov8s.onnx and placed in public/models/.`);
            setIsModelLoading(false);
            return;
        }
        const session = await ort.InferenceSession.create(ONNX_MODEL_PATH);
        setSession(session);
        console.log("ONNX model loaded successfully.");
        setIsModelLoading(false);
        setError(null); // Clear any previous errors
      } catch (e) {
        console.error("Failed to load ONNX model:", e);
        setError("Failed to load ONNX model. Make sure 'yolov8s.onnx' is in 'public/models/'.");
        setIsModelLoading(false);
      }
    };
    loadModel();
  }, []); // Run once on component mount

  const preprocess = useCallback((videoFrame: HTMLVideoElement): ort.Tensor => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // YOLOv8s typically expects 640x640 input
    const inputShape = [1, 3, 640, 640]; 
    canvas.width = inputShape[2];
    canvas.height = inputShape[3];

    ctx?.drawImage(videoFrame, 0, 0, canvas.width, canvas.height);
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;

    if (!imageData) {
        throw new Error("Could not get image data from video frame.");
    }

    const float32Data = new Float32Array(inputShape[1] * inputShape[2] * inputShape[3]);
    let i = 0; // index for float32Data
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            // R G B
            float32Data[i] = imageData[(y * canvas.width + x) * 4] / 255.0; // R
            float32Data[i + inputShape[2] * inputShape[3]] = imageData[(y * canvas.width + x) * 4 + 1] / 255.0; // G
            float32Data[i + 2 * inputShape[2] * inputShape[3]] = imageData[(y * canvas.width + x) * 4 + 2] / 255.0; // B
            i++;
        }
    }

    return new ort.Tensor('float32', float32Data, inputShape);
}, []);

  const postprocess = useCallback((output: ort.Tensor, videoWidth: number, videoHeight: number): Detection[] => {
    // This post-processing logic is highly dependent on the exact output format
    // of your YOLOv8 ONNX model. The following is a common interpretation
    // for a model outputting detections in a [1, num_boxes, 85] tensor,
    // where 85 = 4 (bbox) + 1 (confidence) + 80 (class scores for COCO) or fewer for custom.
    // For YOLOv8, often it's [1, 84, num_boxes]
    const outputData = output.data as Float32Array;
    const [numClasses, numBoxes] = [80, output.dims[2]]; // Assuming 80 classes, adjust as needed

    const detections: Detection[] = [];
    const confThreshold = 0.25; // Confidence threshold
    const iouThreshold = 0.45;  // IoU threshold for NMS

    // Transpose and flatten the output if necessary, common for YOLOv8 ONNX
    // Output is typically [1, 84, N], where N is number of anchors/boxes.
    // We want to iterate N times, each time getting 84 values.
    // The 84 values are [x, y, w, h, conf, class_0_score, ..., class_N_score]
    
    // Assuming output format is [1, 84, num_detections] -> transpose to [1, num_detections, 84] for easier processing
    const transposedOutput: Float32Array[] = [];
    for (let i = 0; i < numBoxes; i++) {
        const boxData: Float32Array = new Float32Array(numClasses + 5);
        for (let j = 0; j < numClasses + 5; j++) {
            boxData[j] = outputData[j * numBoxes + i];
        }
        transposedOutput.push(boxData);
    }
    
    const candidates: Detection[] = [];
    for (const data of transposedOutput) {
        const [x, y, w, h, objectConfidence, ...classScores] = data;
        const maxScore = Math.max(...classScores);
        const classId = classScores.indexOf(maxScore);
        const confidence = objectConfidence * maxScore; // Combined confidence

        if (confidence > confThreshold) {
            // Convert center-wh to xyxy
            const x1 = x - w / 2;
            const y1 = y - h / 2;
            const x2 = x + w / 2;
            const y2 = y + h / 2;

            // Scale bounding box to original video dimensions
            candidates.push({
                id: '', // Will be filled later
                timestamp: Date.now(),
                type: ViolationType.UNKNOWN, // Will map classId to ViolationType later
                confidence: confidence,
                boundingBox: {
                    x: x1 * (videoWidth / 640),
                    y: y1 * (videoHeight / 640),
                    width: (x2 - x1) * (videoWidth / 640),
                    height: (y2 - y1) * (videoHeight / 640),
                }
            });
        }
    }

    // Apply Non-Max Suppression
    const nmsDetections = nonMaxSuppression(candidates, iouThreshold);

    // Map class IDs to ViolationType (This needs to be customized based on your model's classes)
    const classNames = ["shorts", "sleeveless_top", "opened_foot"]; // Example class names
    return nmsDetections.map((det, index) => ({
        ...det,
        id: Date.now().toString() + index,
        type: ViolationType[classNames[det.classId as number]?.toUpperCase() as keyof typeof ViolationType] || ViolationType.UNKNOWN,
    }));

  }, []);

  // Simple NMS implementation
  const nonMaxSuppression = (boxes: Detection[], iouThreshold: number): Detection[] => {
    if (boxes.length === 0) return [];

    // Sort by confidence
    boxes.sort((a, b) => b.confidence - a.confidence);

    const suppressed: boolean[] = new Array(boxes.length).fill(false);
    const result: Detection[] = [];

    for (let i = 0; i < boxes.length; i++) {
        if (suppressed[i]) continue;

        result.push(boxes[i]);

        for (let j = i + 1; j < boxes.length; j++) {
            if (suppressed[j]) continue;

            const iou = calculateIoU(boxes[i].boundingBox, boxes[j].boundingBox);
            if (iou > iouThreshold) {
                suppressed[j] = true;
            }
        }
    }
    return result;
  };

  const calculateIoU = (box1: BoundingBox, box2: BoundingBox): number => {
    const x1 = Math.max(box1.x, box2.x);
    const y1 = Math.max(box1.y, box2.y);
    const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
    const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);

    const intersectionWidth = Math.max(0, x2 - x1);
    const intersectionHeight = Math.max(0, y2 - y1);
    const intersectionArea = intersectionWidth * intersectionHeight;

    const area1 = box1.width * box1.height;
    const area2 = box2.width * box2.height;

    const unionArea = area1 + area2 - intersectionArea;

    return unionArea > 0 ? intersectionArea / unionArea : 0;
  };

  // Frame processing for ONNX inference
  useEffect(() => {
    let animationFrameId: number;
    const captureFrameAndInfer = async () => {
      if (videoRef.current && session && !isModelLoading && !processingFrame && isStreamActive && !useSimulation) {
        setProcessingFrame(true);
        const video = videoRef.current;
        videoDimensions.current = { width: video.videoWidth, height: video.videoHeight };

        try {
            const inputTensor = preprocess(video);
            const feeds = { images: inputTensor }; // 'images' should match your model's input name
            const results = await session.run(feeds);
            
            // Assuming the output name is 'output0' for YOLOv8
            const outputTensor = results.output0; 
            if (outputTensor) {
                const newDetections = postprocess(outputTensor, video.videoWidth, video.videoHeight);
                setDetections(newDetections);
                if (newDetections.length > 0) {
                    setRecentDetections(prev => [...newDetections, ...prev].slice(0, 5));
                }
            }
        } catch (e) {
            console.error("ONNX inference failed:", e);
            setError("Failed to run ONNX inference.");
        } finally {
            setProcessingFrame(false);
        }
      }
      animationFrameId = requestAnimationFrame(captureFrameAndInfer);
    };

    if (isStreamActive && !isModelLoading && session && !useSimulation) {
      animationFrameId = requestAnimationFrame(captureFrameAndInfer);
    } else {
      cancelAnimationFrame(animationFrameId);
      setProcessingFrame(false);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isStreamActive, session, isModelLoading, processingFrame, preprocess, postprocess, useSimulation]);


  // Simulation logic (retained as fallback)
  const simulateDetections = useCallback(() => {
    if (!isStreamActive || !useSimulation || processingFrame) return;

    setProcessingFrame(true);
    const video = videoRef.current;
    
    setTimeout(() => {
        const shouldDetect = Math.random() > 0.6;
        let newDetections: Detection[] = [];

        if (shouldDetect && video) {
            const types = [ViolationType.SHORTS, ViolationType.SANDALS, ViolationType.SLEEVELESS];
            const randomType = types[Math.floor(Math.random() * types.length)];
            
            const newDetection: Detection = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                type: randomType,
                confidence: 0.85 + (Math.random() * 0.1),
                boundingBox: {
                    x: Math.random() * (video.videoWidth - 200),
                    y: Math.random() * (video.videoHeight - 300),
                    width: 150 + Math.random() * 100,
                    height: 250 + Math.random() * 100
                }
            };
            newDetections.push(newDetection);
        }
        setDetections(newDetections);
        if (newDetections.length > 0) {
          setRecentDetections(prev => [...newDetections, ...prev].slice(0, 5));
        }
        setProcessingFrame(false);
    }, 300);
  }, [isStreamActive, useSimulation, processingFrame]);

  useEffect(() => {
    let interval: number;
    if (isStreamActive && useSimulation) {
      interval = window.setInterval(simulateDetections, 1000);
    } else {
      setDetections([]); // Clear detections when simulation stops
    }
    return () => clearInterval(interval);
  }, [isStreamActive, useSimulation, simulateDetections]);


  // Start Camera
  const startCamera = async () => {
    try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: false 
        });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setIsStreamActive(true);
            // If model is loading or failed to load, default to simulation if it's the only option
            if (isModelLoading || !session) {
                setUseSimulation(true);
                setError("ONNX model not loaded, starting simulation.");
            } else {
                setUseSimulation(false); // Use ONNX if model is ready
            }
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
          setIsStreamActive(false);
          setDetections([]);
          setRecentDetections([]);
          setProcessingFrame(false);
          setUseSimulation(false); // Stop simulation when camera stops
      }
  };


  // Draw Bounding Boxes on Canvas
  const drawDetections = useCallback(() => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      const videoRatio = video.videoWidth / video.videoHeight;
      const canvasDisplayWidth = canvas.offsetWidth;
      const canvasDisplayHeight = canvas.offsetHeight;
      const canvasDisplayRatio = canvasDisplayWidth / canvasDisplayHeight;

      let drawWidth = canvasDisplayWidth;
      let drawHeight = canvasDisplayHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (videoRatio > canvasDisplayRatio) { // Video is wider than canvas display area
          drawHeight = canvasDisplayWidth / videoRatio;
          offsetY = (canvasDisplayHeight - drawHeight) / 2;
      } else { // Video is taller than canvas display area
          drawWidth = canvasDisplayHeight * videoRatio;
          offsetX = (canvasDisplayWidth - drawWidth) / 2;
      }
      
      // Set canvas size to match the displayed video resolution for accurate drawing
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling factors
      // const scaleX = canvas.width / drawWidth;
      // const scaleY = canvas.height / drawHeight;

      detections.forEach(det => {
          const { x, y, width, height } = det.boundingBox;
          
          ctx.strokeStyle = '#ef4444'; 
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);

          ctx.fillStyle = '#ef4444';
          ctx.fillRect(x, y - 25, width + 10, 25);

          ctx.fillStyle = 'white';
          ctx.font = 'bold 14px Inter';
          ctx.fillText(`${det.type} (${(det.confidence * 100).toFixed(0)}%)`, x + 5, y - 8);
      });
  }, [detections]);

  // Animation Loop for Drawing
  useEffect(() => {
      let animationFrameId: number;
      
      const render = () => {
          drawDetections();
          animationFrameId = requestAnimationFrame(render);
      };

      if (isStreamActive) {
          animationFrameId = requestAnimationFrame(render);
      } else {
          if (canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
      }

      return () => cancelAnimationFrame(animationFrameId);
  }, [isStreamActive, drawDetections]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Live Monitoring</h1>
          <p className="text-slate-500 mt-1">Real-time object detection for campus security.</p>
        </div>
        <div className="flex gap-3">
            {/* Backend connection button removed as inference is now local */}
            <button 
                onClick={isStreamActive ? stopCamera : startCamera}
                className={`px-5 py-2.5 rounded-lg font-semibold text-white transition-colors duration-200 ${
                    isStreamActive 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
            >
                {isStreamActive ? 'Stop Camera' : 'Start Camera'}
            </button>
             <button 
                onClick={() => setUseSimulation(prev => !prev)}
                disabled={isStreamActive && (!session || isModelLoading)} // Disable simulation toggle if camera is active AND ONNX is ready
                className={`px-5 py-2.5 rounded-lg font-semibold text-white transition-colors duration-200 ${
                    useSimulation && isStreamActive
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-gray-400 hover:bg-gray-500'
                } ${isStreamActive && (!session || isModelLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {useSimulation && isStreamActive ? 'Simulation Active' : 'Start Simulation'}
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {isModelLoading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Info:</strong>
          <span className="block sm:inline ml-2">Loading ONNX model... This may take a moment.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center border border-slate-700">
            {!isStreamActive && (
                <div className="text-slate-400 flex flex-col items-center">
                    <i className="fas fa-video-slash text-5xl mb-3"></i>
                    <span>Camera Stream Inactive</span>
                </div>
            )}
            <video 
                ref={videoRef} 
                className={`absolute inset-0 w-full h-full object-contain ${!isStreamActive ? 'hidden' : ''}`}
                muted
                playsInline
                autoPlay
            />
            <canvas 
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />
            
            {isStreamActive && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    LIVE
                </div>
            )}

            {processingFrame && isStreamActive && (
                 <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                    <i className="fas fa-spinner fa-spin"></i>
                    PROCESSING
                </div>
            )}

            {isStreamActive && (isModelLoading || !session) && !useSimulation && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-lg font-semibold">
                    ONNX Model Not Ready & Simulation Inactive
                </div>
            )}
            {isStreamActive && useSimulation && (
                <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                    SIMULATION
                </div>
            )}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col min-h-[400px] max-h-[700px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <h3 className="font-semibold text-lg text-slate-700">Recent Violations</h3>
                {recentDetections.length > 0 && <span className="text-sm text-slate-500">Last {recentDetections.length}</span>}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {recentDetections.length > 0 ? (
                    recentDetections.map((det) => (
                        <div key={det.id} className="flex gap-4 items-center p-4 bg-red-50 border border-red-100 rounded-xl animate-fade-in shadow-sm">
                            <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                            <div>
                                <p className="font-bold text-slate-800 text-base">{det.type}</p>
                                <p className="text-sm text-slate-600">Confidence: <span className="font-medium text-red-700">{(det.confidence * 100).toFixed(1)}%</span></p>
                                <p className="text-xs text-slate-500 mt-1">{new Date(det.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-400 mt-10">
                        <i className="fas fa-search text-4xl mb-3"></i>
                        <p className="font-medium">No violations detected yet.</p>
                        <p className="text-sm mt-1">Monitoring for policy infringements...</p>
                    </div>
                )}
            </div>
            {recentDetections.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All History</button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
