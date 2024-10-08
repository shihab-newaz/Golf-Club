import React from 'react';

interface HamburgerMenuProps {
  isOpen: boolean;
  toggle: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, toggle }) => {
  return (
    <button
      className="lg:hidden flex flex-col justify-center items-center"
      onClick={toggle}
    >
      <span
        className={`bg-black dark:bg-white block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                    }`}
      ></span>
      <span
        className={`bg-black dark:bg-white block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm my-0.5 ${
                      isOpen ? 'opacity-0' : 'opacity-100'
                    }`}
      ></span>
      <span
        className={`bg-black dark:bg-white block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                    }`}
      ></span>
    </button>
  );
};

export default HamburgerMenu;