import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoPlayer = ({ videoId }) => {
    const [videoUrl, setVideoUrl] = useState("");
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadedRange, setLoadedRange] = useState("");
    const [playedRange, setPlayedRange] = useState("");

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/stream/video?videoId=${videoId}`, {

                    headers: {
                        Range: `bytes=${loadedRange}`,
                    },
                    responseType: "blob",
                });
                if (response.status === 206) {
                    const contentRange = response.headers["content-range"];
                    const contentLength = response.headers["content-length"];
                    if (contentRange && contentLength) {
                        const [unit, ranges] = contentRange.split(" ");
                        const [start, end] = ranges.split("-");
                        const newRange = `bytes=${start}-${end}`;
                        if (loadedRange !== newRange) {
                            setLoadedRange(newRange);
                        }
                        if (playedRange !== "") {
                            const [playedStart, playedEnd] = playedRange.split("-");
                            const newCurrentTime = parseInt(playedEnd) / duration;
                            setCurrentTime(newCurrentTime);
                        }
                    }
                }
                const blob = response.data;
                setVideoUrl(URL.createObjectURL(blob));
            } catch (error) {
                console.error(error);
            }
        };

        fetchVideo();
    }, [loadedRange, playedRange]);

    const handleTimeUpdate = (event) => {
        setCurrentTime(event.target.currentTime / duration);
        setPlayedRange(
            `bytes=${event.target.currentTime * duration}-${duration}`
        );
    };

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    const handlePauseClick = () => {
        setIsPlaying(false);
    };

    const handleSeek = (event) => {
        const newCurrentTime = event.target.value / 100;
        setCurrentTime(newCurrentTime);
        const newPlayedRange = `bytes=${newCurrentTime * duration}-${duration}`;
        setPlayedRange(newPlayedRange);
    };

    const handleLoadedMetadata = (event) => {
        setDuration(event.target.duration);
    };

    return (
        <>
            <video
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                controls={true}
                autoPlay={true}
                onPlay={handlePlayClick}
                onPause={handlePauseClick}
            ></video>
            <input
                type="range"
                min={0}
                max={100}
                step={0.01}
                value={currentTime * 100}
                onChange={handleSeek}
            />
        </>
    );
};

export default VideoPlayer;
