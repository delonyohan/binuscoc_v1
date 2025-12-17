import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as ort from 'onnxruntime-web'; // No longer needed for client-side ONNX inference
import { Detection, ViolationType, BoundingBox } from '../types';

const SNAPSHOT_PLACEHOLDER = 'https://picsum.photos/320/240';
const WEBSOCKET_URL = 'ws://localhost:8000/ws/detect_stream'; // Backend WebSocket URL for inference

export const LiveMonitor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null); // WebSocket connection state
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [processingFrame, setProcessingFrame] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSimulation, setUseSimulation] = useState(false); // State to toggle simulation

  // Reference for the original video dimensions
  const videoDimensions = useRef({ width: 0, height: 0 });

  // --------------------------------------------------------------------------------------
  // WebSocket Connection Management
  // --------------------------------------------------------------------------------------
  useEffect(() => {
    // Attempt to connect to WebSocket on component mount
    const connectWebSocket = () => {
      console.log("Attempting to connect to WebSocket at:", WEBSOCKET_URL);
      const newWs = new WebSocket(WEBSOCKET_URL);

      newWs.onopen = () => {
        console.log('WebSocket connected');
        setIsWebSocketConnected(true);
        setError(null);
      };

      newWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as { detections: Detection[] };
          if (data && Array.isArray(data.detections)) {
            const receivedDetections = data.detections.map(det => ({
                ...det,
                type: ViolationType[det.type.toUpperCase() as keyof typeof ViolationType] || ViolationType.UNKNOWN,
            }));
            setDetections(receivedDetections);
            if (receivedDetections.length > 0) {
              setRecentDetections(prev => [...receivedDetections, ...prev].slice(0, 5));
            }
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
          setError("Failed to parse detection data from server.");
        } finally {
            setProcessingFrame(false); // Frame processing complete after receiving response
        }
      };

      newWs.onclose = () => {
        console.log('WebSocket disconnected');
        setIsWebSocketConnected(false);
        if (isStreamActive) { // Only attempt to reconnect if stream was active
            setError("WebSocket disconnected. Attempting to reconnect...");
            setTimeout(connectWebSocket, 3000); // Attempt to reconnect after 3 seconds
        } else {
            setError("WebSocket disconnected. Start camera to reconnect.");
        }
      };

      newWs.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError("WebSocket connection error. Ensure the backend server is running.");
        newWs.close();
      };

      setWs(newWs);
    };

    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [isStreamActive]); // Reconnect logic might depend on isStreamActive, so include it

  // --------------------------------------------------------------------------------------
  // Frame Sending Logic
  // --------------------------------------------------------------------------------------
  const sendFrameToBackend = useCallback((videoFrame: HTMLVideoElement) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not open, cannot send frame.");
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get canvas context.");
      return;
    }

    // Set canvas dimensions to match video frame for sending
    canvas.width = videoFrame.videoWidth;
    canvas.height = videoFrame.videoHeight;

    ctx.drawImage(videoFrame, 0, 0, canvas.width, canvas.height);

    // Convert canvas content to JPEG and send as base64 string
    canvas.toBlob((blob) => {
      if (blob) {
        setProcessingFrame(true); // Indicate frame is being processed
        ws.send(blob); // Send as Blob for potentially better performance
      }
    }, 'image/jpeg', 0.8); // Adjust quality as needed
  }, [ws]);

  // --------------------------------------------------------------------------------------
  // Video Stream & Inference Loop
  // --------------------------------------------------------------------------------------
  useEffect(() => {
    let animationFrameId: number;
    const captureFrameAndSend = () => {
      if (videoRef.current && ws && ws.readyState === WebSocket.OPEN && isStreamActive && !useSimulation && !processingFrame) {
        const video = videoRef.current;
        videoDimensions.current = { width: video.videoWidth, height: video.videoHeight };
        sendFrameToBackend(video); // Send frame to backend for inference
      }
      animationFrameId = requestAnimationFrame(captureFrameAndSend);
    };

    if (isStreamActive && isWebSocketConnected && !useSimulation) {
      animationFrameId = requestAnimationFrame(captureFrameAndSend);
    } else {
      cancelAnimationFrame(animationFrameId);
      setProcessingFrame(false); // Ensure processing flag is reset if stream stops
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isStreamActive, isWebSocketConnected, useSimulation, processingFrame, sendFrameToBackend]);


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
            // If WebSocket is not connected, default to simulation
            if (!isWebSocketConnected) {
                setUseSimulation(true);
                setError("WebSocket not connected, starting simulation. Please ensure backend server is running.");
            } else {
                setUseSimulation(false); // Use backend if WebSocket is ready
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

      // Ensure canvas matches video size for correct drawing
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      {/*
        Frontend (React) - LiveMonitor.tsx
        
        This component is configured to send video frames via WebSocket to a backend server
        for real-time object detection inference.

        Backend Requirements:
        - A WebSocket server running at ws://localhost:8000/ws/detect_stream (or configured URL).
        - This server should:
            1. Accept incoming WebSocket connections.
            2. Receive image data (e.g., JPEG Blobs) sent from this frontend.
            3. Load the YOLOv8 PyTorch model (yolov8s.pt) using a library like `ultralytics` or `torch`.
            4. Perform inference on the received image frames.
            5. Post-process the detection results (e.g., NMS, scaling bounding boxes).
            6. Send back detection results as a JSON string over the WebSocket,
               with the format: { "detections": [ { id: string, timestamp: number, type: string, confidence: number, boundingBox: { x, y, width, height } } ] }.
               The 'type' field should match the string representation of ViolationType (e.g., "SHORTS", "SLEEVELESS").
      */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Live Monitoring</h1>
          <p className="text-slate-500 mt-1">Real-time object detection for campus security.</p>
        </div>
        <div className="flex gap-3">
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
                disabled={isStreamActive && isWebSocketConnected} // Disable simulation toggle if camera is active AND WebSocket is connected
                className={`px-5 py-2.5 rounded-lg font-semibold text-white transition-colors duration-200 ${
                    useSimulation && isStreamActive
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-gray-400 hover:bg-gray-500'
                } ${isStreamActive && isWebSocketConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {!isWebSocketConnected && isStreamActive && !useSimulation && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Warning:</strong>
          <span className="block sm:inline ml-2">WebSocket not connected. Ensure the backend server is running at {WEBSOCKET_URL}. Falling back to simulation if no connection.</span>
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

            {processingFrame && isStreamActive && !useSimulation && (
                 <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                    <i className="fas fa-spinner fa-spin"></i>
                    PROCESSING (Backend)
                </div>
            )}

            {isStreamActive && (!isWebSocketConnected || useSimulation) && (
                <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                    SIMULATION {useSimulation ? 'ACTIVE' : ''} {isStreamActive && !isWebSocketConnected ? '(NO BACKEND)' : ''}
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
