
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 glass sticky top-0 z-10">
      <div className="container mx-auto max-w-5xl flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="font-semibold text-xl tracking-tight">
            <span className="highlighted-text">ANSI</span> Color Craft
          </h1>
          <div className="ml-4 px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-500 hidden sm:block">
            For Discord
          </div>
        </div>
        <div className="text-sm text-gray-500">
          <span className="hidden sm:inline">Create beautiful </span>colored text messages
        </div>
      </div>
    </header>
  );
};

export default Header;
