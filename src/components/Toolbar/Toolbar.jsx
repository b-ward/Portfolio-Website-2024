import React from 'react';
import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';

const Toolbar = ({ drawerClickHandler }) => (
  <header className="w-full fixed top-0 left-0 h-14 bg-transparent z-[1]">
    <nav className="flex h-full items-center px-4">
      <DrawerToggleButton click={drawerClickHandler} />
    </nav>
  </header>
);

export default Toolbar;
