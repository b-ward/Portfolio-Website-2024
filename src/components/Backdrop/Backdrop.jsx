import React from 'react';

const Backdrop = ({ click }) => (
  <div
    className="fixed top-0 left-0 w-full h-full bg-black/30 z-[100]"
    onClick={click}
  />
);

export default Backdrop;
