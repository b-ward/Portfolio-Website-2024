import React from 'react';

const DrawerToggleButton = ({ click }) => (
  <button
    className="flex flex-col justify-around h-6 w-[30px] bg-transparent border-0 rounded-none p-0 box-border cursor-pointer focus:outline-none"
    onClick={click}
  >
    <div className="w-[30px] h-[3px] bg-white" />
    <div className="w-[30px] h-[3px] bg-white" />
    <div className="w-[30px] h-[3px] bg-white" />
  </button>
);

export default DrawerToggleButton;
