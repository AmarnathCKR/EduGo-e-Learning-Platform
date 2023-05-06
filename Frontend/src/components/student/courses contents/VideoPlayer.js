import React, { useEffect, useState } from 'react';
import bitmovin from 'bitmovin-player';
import axios from "axios"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDUrOSbu7aIWBt2FUJeqAB_TIDKiryx_fs",
  authDomain: "edugo-2.firebaseapp.com",
  projectId: "edugo-2",
  storageBucket: "edugo-2.appspot.com",
  messagingSenderId: "900365865405",
  appId: "1:900365865405:web:ac6509113f9930f28bc2d4",
  measurementId: "G-P667128RPD"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function VideoPlayer({ sourceUrl }) {
  const [video, setVideo] = useState()
  const [url, setUrl] = useState()



  const encryptVideoFile = async (videoFile) => {
    try {
      // TODO: generate or obtain an encryption key and an initialization vector
      const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;
      const initializationVector = process.env.REACT_APP_VECTOR;
      // TODO: replace with your own Bitmovin API key
      const bitmovinApiKey = process.env.REACT_APP_BITMOVEN_API;
      // TODO: replace with your own Bitmovin API endpoint
      const bitmovinApiEndpoint =
        "https://api.bitmovin.com/v1/encoding/encodings";
      // Create an encryption configuration object
      const encryptionConfig = {
        encryptionMode: "AES_128",
        encryptionKey,
        initializationVector,
      };
      // Make an HTTP request to Bitmovin API endpoint with encryption configuration and video file as parameters
      const response = await axios.post(
        bitmovinApiEndpoint,
        videoFile,
        {
          params: encryptionConfig,
          headers: {
            "X-Api-Key": bitmovinApiKey,
            "Content-Type": "application/octet-stream",
          },
        }
      );
      // Get the encrypted video file
      const encryptedVideoFile = response.data;
      return encryptedVideoFile;
    } catch (error) {
      console.error(error);
    }
  };

  const upload = async () => {
    const encryptedVideoFile = await encryptVideoFile(video)


    const file2 = encryptedVideoFile;

    const storageRef = ref(storage, `videos/${file2.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file2);

    uploadTask.on(
      "state_changed",
      async (snapshot) => {
        // Handle progress
        const progresss =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("uploading" + progresss)

      },
      (error) => {
        // Handle error
        console.log("hererer");
        console.error(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);

        setUrl(url)
      }
    );

  }

  return (<>

    <input type='file' onChange={(event) => { setVideo(event.target.files[0]) }} />
    <button onClick={upload}>Submit</button>
    <div id="player-id"></div></>
  );
}

export default VideoPlayer;
