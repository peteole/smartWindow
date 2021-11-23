import 'react'
import React from 'react';

type state = "waiting" | "ready" | "error"
export const Camera: React.FC<{ onPhoto?: (img: Blob) => void }> = (props) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [state, setState] = React.useState<state>("waiting")
    const [capture, setCapture] = React.useState<ImageCapture>()
    const [track, setTrack] = React.useState<MediaStreamTrack>()
    if (state == "waiting") {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, }).then(stream => {
            if (videoRef.current) {
                videoRef.current.autoplay = true;
                videoRef.current.srcObject = stream;

            }
            const videoTrack = stream.getVideoTracks()[0];
            const capture = new ImageCapture(videoTrack);
            setTrack(videoTrack)
            setState("ready");
            setCapture(capture);
        })
    }
    const takePicture = () => {
        if (capture) {
            capture.takePhoto().then(blob => {
                props.onPhoto?.(blob);
            })
        }
    }
    const setFocus = (focus: number) => {
        if (track) {
            track.applyConstraints({
                advanced: [{
                    focusMode: "manual",
                    focusDistance: focus
                }]
            }).catch(e => {
                console.log(e)
            })
        }
    }
    return (
        <div>
            {state}
            <video ref={videoRef} />
            <button onClick={takePicture}>Take Picture</button>
            <input type="range" min="0" max="1" step="0.01" onChange={(e) => setFocus(parseFloat(e.target.value))} />
        </div>);
};