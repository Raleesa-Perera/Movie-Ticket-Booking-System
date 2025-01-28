import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-[#1f1f2d] p-4">
      <nav className="flex items-center justify-between">
        
        <div className="flex items-center">
          <h1 className="ml-2 text-white text-2xl font-semibold">Galaxy Cinema</h1>
        </div>
        
        <ul className="flex space-x-6">
          <li>
            <a href="#home" className="text-white font-bold hover:text-gray-400">Home</a>
          </li>
          <li>
            <a href="#movies" className="text-white font-bold hover:text-gray-400">Movies</a>
          </li>
          <li>
            <a href="#about" className="text-white font-bold hover:text-gray-400">About Us</a>
          </li>
          <li>
            <a href="#contact" className="text-white font-bold hover:text-gray-400">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
