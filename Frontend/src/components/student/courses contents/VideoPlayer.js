import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ video,title }) => {
  return (
    <div className='md:h-96 h-56 bg-neutral-900 container1 relative'>
      <div className='w-full absolute overlay font-bold text-2xl z-40 md:h-64 p-5 h-32 align-middle '><span className=' p-1 w-full text-center text-white'></span>{title}</div>
      <ReactPlayer
        className='md:h-96 h-full'
        url={video}
        width='100%'
        height="md:h-96 h-full"


        controls={true}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
        
      />
    </div>
  );
};

export default VideoPlayer;