import 'react'
import React, { useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import "cropperjs/dist/cropper.css";

type state = "waiting" | "ready" | "error"
export const Camera: React.FC<{ onPhoto?: (img: Blob) => void }> = (props) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [state, setState] = React.useState<state>("waiting")
    const [capture, setCapture] = React.useState<ImageCapture>()
    const [track, setTrack] = React.useState<MediaStreamTrack>()
    const [captured,setCaptured]=React.useState<string>("")
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
                const rd=new FileReader()
                rd.onload=()=>{
                    setCaptured(rd.result as string)
                }
                rd.readAsDataURL(blob)
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
    const cropperRef = useRef<ReactCropperElement>(null);
    const onCrop = async () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper?.getCroppedCanvas().toBlob((blob)=>{
            if (blob) {
                props.onPhoto?.(blob);
            }
        })

    };
    return (
        <div>
            {state}
            <video ref={videoRef} />
            <button onClick={takePicture}>Take Picture</button>
            <input type="range" min="0.03" max="0.15" step="0.001" onChange={(e) => setFocus(parseFloat(e.target.value))} />
            <Cropper
                src={captured}
                style={{ height: 500, width: "732px" }}
                initialAspectRatio={16 / 9}
                guides={false}
                ref={cropperRef}
                viewMode={1}
                // guides={true}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                // background={false}
                responsive={true}
                autoCropArea={1}
                aspectRatio={4 / 3}
                checkOrientation={false}
            />
            <button onClick={onCrop}>submit image</button>
        </div>);
};