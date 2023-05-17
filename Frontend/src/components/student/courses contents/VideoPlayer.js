import React, { useEffect, useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ count, video, title, activeID, setActive, current, setCurrent }) => {
  const [show, setShow] = useState(false)
  const [toggle, setToggle] = useState(false)
  useEffect(() => {
    window.innerWidth > 900 && setToggle(true);
    window.addEventListener("resize", () => {
      window.innerWidth < 900 ? setToggle(false) : setToggle(true);

      return () => {
        window.removeEventListener("resize", () => { });
      };
    });
  }, []);
  return (
    <div className='md:h-[390px] h-56 bg-neutral-900 container1 relative'>
      <div className='w-full absolute overlay font-bold text-2xl z-40 md:h-20 p-5 h-16 align-middle '><span className=' p-1 w-full text-center text-white'></span>{title}</div>
      {toggle && !activeID && <div className='top-6 mt-20 w-fit right-0 absolute overlay1 font-bold text-2xl z-40 flex justify-end md:h-20 p-5 h-20 align-end '><button onClick={setActive} onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)} className='px-1 py-4 bg-black -mr-5 text-center text-white text-xs font-bold flex items-center align-middle'>{show ? <AiOutlineArrowRight className='mr-2' size="20px" /> : <AiOutlineArrowLeft className='mr-3' size="20px" />}{show && "Show Contents"}</button></div>
      }

      {current < count - 1 && <div className='top-10 md:mt-36 mt-10 right-0 w-fit absolute overlay1 font-bold text-2xl z-40 flex justify-end md:h-20 p-5 h-20 align-end '><button onClick={() => { setCurrent(current + 1) }}
        className='px-1  bg-black -mr-5 text-center text-white text-xs font-bold cursor-pointer flex items-center align-middle py-6'><AiOutlineRight className='cursor-pointer' size="40px" /></button></div>
      }


      {current > 0 && <div className='top-10 md:mt-36 mt-10 w-fit absolute overlay1 font-bold text-2xl z-40 flex justify-start md:h-20 p-5 h-20 align-start '><button onClick={() => { setCurrent(current - 1) }}
        className='px-1  bg-black -ml-5 text-center text-white text-xs font-bold flex items-center align-middle py-6'><AiOutlineLeft className='cursor-pointer' size="40px" /></button></div>
      }
      <ReactPlayer
        className={activeID ? "md:h-96 h-full z-20" : "z-20 md:h-[400px] h-full"}
        url={video}
        width='100%'
        height={activeID ? "md:h-96 h-full" : "md:h-[400px] h-full"}
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