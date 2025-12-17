# Binuscoc - Campus Dress Code Enforcement

## Overview

Binuscoc is a web application designed to assist in monitoring and enforcing campus dress code policies. It provides a comprehensive suite of features including:

*   **Dashboard:** An overview of dress code compliance with weekly trends and violation distribution.
*   **Live Monitor:** Real-time object detection for identifying potential dress code violations using a pre-trained model. (Note: This feature assumes a backend service for actual model inference.)
*   **Model Manager:** Displays performance metrics and details of the active object detection model.
*   **Policy Information:** A static page providing details on campus dress code and general regulations.

## Model Used

The application utilizes the **YOLOv8s** (YOLOv8 small) object detection model for its live monitoring feature. This model is trained to identify specific dress code violations.

## How to Use (Development Setup)

To get this project up and running on your local machine for development and testing:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/delonyohan/binuscoc_v1.git
    cd binuscoc_v1
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run in Development Mode:**
    This will start the development server and open the application in your browser.
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    To create a production-ready build of the application (output in the `dist/` folder):
    ```bash
    npm run build
    ```

**Note:** The Live Monitor feature is designed to interact with a hypothetical backend service for real-time object detection inference. For full functionality, you would need to implement and run a compatible backend that can process video frames using the YOLOv8s model and return detection results.