function Video() {
  return (
    <>
      <div className="grid grid-cols-2 items-center">
        <div className="">
          <h1 className="text-lg">
            Use basic tools like a smartphone or a DSLR camera. Add a good
            microphone and you’re ready to start. If you don’t like being on
            camera, just capture your screen. Either way, we recommend two hours
            or more of video for a paid course.
          </h1>
          <h2 className="text-2xl font-bold">How we help you</h2>
          <p className="text-lg">
            Our support team is available to help you throughout the process and
            provide feedback on test videos.
          </p>
        </div>
        <div>
          <img
            src="https://s.udemycdn.com/teaching/record-your-video-v3.jpg"
            alt="img"
          />
        </div>
      </div>
    </>
  );
}

export default Video;
