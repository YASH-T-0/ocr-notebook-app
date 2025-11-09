import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, CloseIcon } from './icons';

interface CameraViewProps {
    onCapture: (base64Image: string) => void;
    onBack: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onBack }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        const tryStream = async (constraints: MediaStreamConstraints) => {
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        };

        try {
            // First, try for the rear camera
            await tryStream({ video: { facingMode: 'environment' }, audio: false });
        } catch (err) {
            console.log("Could not get rear camera, trying any available camera.", err);
            try {
                 // If the rear camera fails, try for any camera
                await tryStream({ video: true, audio: false });
            } catch (e) {
                console.error("Error accessing any camera:", e);
                let message = "Could not access the camera. Please ensure permissions are granted and a camera is available.";
                if (e instanceof Error) {
                    if (e.name === 'NotAllowedError') {
                        message = "Camera access was denied. Please grant permission in your browser settings to continue.";
                    } else if (e.name === 'NotFoundError') {
                        message = "No camera was found on your device. Please try again on a device with a camera.";
                    } else if (e.name === 'NotReadableError') {
                        message = "The camera is currently in use by another application or there was a hardware error.";
                    }
                }
                setError(message);
            }
        }
    }, []);
    
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        startCamera();
        
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);
    
    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/png');
                const base64Image = dataUrl.split(',')[1];
                
                stopCamera();
                onCapture(base64Image);
            }
        }
    };
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
                <p className="text-red-400 mb-4 text-center">{error}</p>
                <button onClick={onBack} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-40">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                aria-label="Live camera feed"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex justify-end">
                    <button onClick={onBack} className="p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75" aria-label="Close camera view">
                        <CloseIcon />
                    </button>
                </div>
                
                <div className="flex justify-center">
                    <button
                        onClick={handleCapture}
                        className="p-4 bg-white/80 text-black rounded-full hover:bg-white transition"
                        aria-label="Capture image"
                    >
                        <CameraIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};