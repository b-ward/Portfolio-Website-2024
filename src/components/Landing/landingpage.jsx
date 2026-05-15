//Design Credit: https://www.youtube.com/watch?v=7WwtzsSHdpI

import React, { useRef, useEffect } from 'react';
import { init } from 'ityped';

const Landing = () => {
  const typingRef = useRef(null);

  useEffect(() => {
    if (!typingRef.current) return;
    init(typingRef.current, {
      showCursor: false,
      backDelay: 1500,
      strings: ['Product Manager', 'Tester', 'Developer', 'Technology Enthusiast'],
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/BrendonWard.png"
            alt="Brendon Ward"
            className="absolute bottom-0 h-[80%] lg:static lg:h-[70%]"
          />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center lg:justify-start">
        <div className="w-full max-w-[600px] h-[50vh] lg:h-[600px] lg:pl-[50px] lg:pr-5 flex flex-col justify-center items-center lg:items-start">
          <h2 className="bg-surface text-white text-[30px]">G'day! My name's</h2>
          <h1 className="bg-surface text-white text-[45px] whitespace-nowrap my-[10px]">Brendon Ward</h1>
          <h3 className="bg-surface text-white text-[20px]">
            I'm a <span ref={typingRef} className="text-accent inline-block"></span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Landing;
