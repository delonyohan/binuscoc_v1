from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from ultralytics import YOLO
import uvicorn
import cv2
import numpy as np
import base64
import json
from PIL import Image
import io

app = FastAPI()

# Path to your YOLOv8 PyTorch model
# Adjust this path if your 'public/models' directory is not relative to the backend script
MODEL_PATH = "public/models/yolov8s.pt"

# Load a model
# It's recommended to load the model once when the application starts
# and reuse it for all incoming requests.
try:
    model = YOLO(MODEL_PATH)
    print(f"YOLOv8 model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading YOLOv8 model from {MODEL_PATH}: {e}")
    model = None # Set model to None if loading fails

# Frontend expects these class names to map to ViolationType
CLASS_NAMES = ["shorts", "sleeveless_top", "opened_foot"] # Customize based on your model's classes

@app.get("/")
async def get():
    return HTMLResponse("<h1>YOLOv8 WebSocket Inference Backend</h1><p>Connect to /ws/detect_stream for real-time detection.</p>")

@app.websocket("/ws/detect_stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket client connected.")
    
    if model is None:
        await websocket.send_json({"error": "YOLOv8 model failed to load on backend."})
        await websocket.close()
        return

    try:
        while True:
            # Receive image frame as bytes (Blob from frontend)
            data = await websocket.receive_bytes()
            
            # Convert bytes to numpy array (image)
            nparr = np.frombuffer(data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR) # Decode as color image

            if img is None:
                print("Failed to decode image.")
                continue

            # Perform inference
            results = model(img) # Predict on image
            
            detections_for_frontend = []
            for r in results:
                for *xyxy, conf, cls in r.boxes.data:
                    x1, y1, x2, y2 = map(int, xyxy)
                    confidence = float(conf)
                    class_id = int(cls)

                    # Map class_id to class_name as expected by frontend
                    class_name = CLASS_NAMES[class_id] if class_id < len(CLASS_NAMES) else "UNKNOWN"

                    # Convert bounding box to frontend's expected format (x, y, width, height)
                    bbox = {
                        "x": x1,
                        "y": y1,
                        "width": x2 - x1,
                        "height": y2 - y1,
                    }

                    detections_for_frontend.append({
                        "id": str(np.random.randint(0, 1000000)), # Simple unique ID
                        "timestamp": int(cv2.getTickCount() / cv2.getTickFrequency() * 1000), # Current time in ms
                        "type": class_name,
                        "confidence": confidence,
                        "boundingBox": bbox,
                    })

            # Send detections back to frontend
            await websocket.send_json({"detections": detections_for_frontend})

    except WebSocketDisconnect:
        print("WebSocket client disconnected.")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_json({"error": str(e)})
    finally:
        print("WebSocket connection closed.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

