import { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";



import { Player, ControlBar } from 'video-react';



const firebaseConfig =  {
  apiKey: "AIzaSyASd_nl36pkPP-68OtSzhwacsQxtQ88ZwY",
  authDomain: "edugo-e-lerning.firebaseapp.com",
  projectId: "edugo-e-lerning",
  storageBucket: "edugo-e-lerning.appspot.com",
  messagingSenderId: "110356446945",
  appId: "1:110356446945:web:49cfe86d61dc2aedf341a0",
  measurementId: "G-6NZZ398W04"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function VideoUploader() {
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] =useState("")

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress
        const progresss =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progresss}% done`);
        setProgress(progresss)
      },
      (error) => {
        // Handle error
        console.error(error);
        setProgress(error)

      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setVideoUrl(url);
      }
    );
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      {progress ? progress : ""}
      {videoUrl && (
        
        <Player autoPlay src={videoUrl} >
        <ControlBar autoHide={false} className="my-class" />
      </Player>
        
      )}
    </div>
  );
}

export default VideoUploader;
