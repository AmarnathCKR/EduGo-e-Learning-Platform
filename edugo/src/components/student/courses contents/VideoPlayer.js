import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const VideoPlayer = ({ videoId }) => {
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [loadedRange, setLoadedRange] = useState("");
//   const [playedRange, setPlayedRange] = useState("");

//   const videoRef = useRef(null);

//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/stream/video?videoId=${videoId}`, {
//           headers: {
//             Range: `bytes=${loadedRange}`,
//           },
//           responseType: "blob",
//         });
//         if (response.status === 206) {
//           const contentRange = response.headers["content-range"];
//           const contentLength = response.headers["content-length"];
//           if (contentRange && contentLength) {
//             const [unit, ranges] = contentRange.split(" ");
//             const [start, end] = ranges.split("-");
//             const newRange = `bytes=${start}-${end}`;
//             if (loadedRange !== newRange) {
//               setLoadedRange(newRange);
//             }
//             if (playedRange !== "") {
//               const [playedStart, playedEnd] = playedRange.split("-");
//               const newCurrentTime = parseInt(playedEnd) / duration;
//               setCurrentTime(newCurrentTime);
//             }
//           }
//         }
//         const blob = response.data;
//         const videoUrl = URL.createObjectURL(blob);
//         videoRef.current.src = videoUrl;
//         videoRef.current.currentTime = currentTime * duration;
//         if (isPlaying) {
//           videoRef.current.play();
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchVideo();

//     // Clean up function to revoke object URL and pause video when component unmounts
//     return () => {
//       URL.revokeObjectURL(videoRef.current.src);
//       videoRef.current.pause();
//     };
//   }, [loadedRange, playedRange]);

//   const handleTimeUpdate = () => {
//     setCurrentTime(videoRef.current.currentTime / duration);
//     setPlayedRange(`bytes=${videoRef.current.currentTime * duration}-${duration}`);
//   };

//   const handlePlayClick = () => {
//     setIsPlaying(true);
//     videoRef.current.play();
//   };

//   const handlePauseClick = () => {
//     setIsPlaying(false);
//     videoRef.current.pause();
//   };

//   const handleSeek = (event) => {
//     const newCurrentTime = event.target.value / 100;
//     setCurrentTime(newCurrentTime);
//     const newPlayedRange = `bytes=${newCurrentTime * duration}-${duration}`;
//     setPlayedRange(newPlayedRange);
//     videoRef.current.currentTime = newCurrentTime * duration;
//   };

//   const handleLoadedMetadata = () => {
//     setDuration(videoRef.current.duration);
//   };

  return (
    <>
      {/* <video
        ref={videoRef}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        controls={false}
      />
      <input
        type="range"
        min={0}
        max={100}
        step={0.01}
        value={currentTime * 100}
        onChange={handleSeek}
      />
      <button onClick={handlePlayClick}>Play</button>
      <button onClick={handlePauseClick}>Pause</button> */}
      <video controls={true} autoPlay={true} src={videoId} />
    </>
  );
};

export default VideoPlayer;
