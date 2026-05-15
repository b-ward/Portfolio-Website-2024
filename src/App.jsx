import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Main from './components/main';
import Toolbar from './components/Toolbar/Toolbar';
import SideDrawer from './components/SideDrawer/SideDrawer';
import Backdrop from './components/Backdrop/Backdrop';

const App = () => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen(prev => !prev);
  };

  const backdropClickHandler = () => {
    setSideDrawerOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg">
        <Toolbar drawerClickHandler={drawerToggleClickHandler} />
        <SideDrawer show={sideDrawerOpen} closeDrawer={backdropClickHandler} />
        {sideDrawerOpen && <Backdrop click={backdropClickHandler} />}
        <main className="w-full pt-14">
          <Main />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
