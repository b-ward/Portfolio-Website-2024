import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/About', label: 'About Me' },
  { to: '/CV', label: 'CV' },
  { to: '/Projects', label: 'Personal Projects' },
  { to: '/Photos', label: 'Photos and Videos' },
  { to: '/Music', label: 'Music' },
  { to: '/BusinessBrains', label: 'Business Brains' },
];

const SideDrawer = ({ show, closeDrawer }) => (
  <nav
    className={`fixed top-0 left-0 h-full w-[70%] max-w-[400px] bg-surface shadow-[1px_0px_7px_rgba(0,0,0,0.5)] z-[200] transition-transform duration-300 ease-out ${show ? 'translate-x-0' : '-translate-x-full'}`}
  >
    <ul className="list-none p-0 m-0 flex flex-col h-full">
      <li className="flex justify-center py-6 px-4">
        <NavLink to="/" onClick={closeDrawer} className="flex flex-col items-center gap-3 no-underline">
          <img src="/BrendonWard.png" alt="Brendon Ward" className="w-24 h-auto" />
          <span className="text-white text-base font-medium">Brendon Ward</span>
        </NavLink>
      </li>
      {navLinks.map(({ to, label }) => (
        <li key={to} className="my-1 px-4">
          <NavLink
            to={to}
            onClick={closeDrawer}
            className={({ isActive }) =>
              `block text-xl no-underline hover:text-accent ${isActive ? 'text-accent' : 'text-white'}`
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default SideDrawer;
