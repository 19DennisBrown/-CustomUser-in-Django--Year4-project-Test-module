




import { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Navbar
 = () => {
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Close the menu and navigate
  const closeMenu = () => {
    setNav(false);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Home', link: '/' },
    { id: 2, text: 'Blog', link: '/blog' },
    { id: 3, text: 'Services', link: '/services' },
    { id: 4, text: 'About', link: '/about' },
  ];

  return (
    <div className='bg-blue-900  flex justify-between items-center py-4  w-full z-10 mx-auto px-4 text-white rounded-b-md shadow-lg fixed'>
      {/* Logo */}
      <h1 className='w-full text-2xl font-semibold text-[#00df9a]'>WPMS.</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='px-4 py-0 hover:bg-[#00df9a] rounded-md m-2 cursor-pointer duration-600 hover:text-black'
          >
            <Link to={`${item.link}`}>{item.text}</Link>
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'z-50  fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        {/* Mobile Logo */}
        <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>WPMS.</h1>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
            <Link to={`${item.link}`} key={item.id} onClick={closeMenu}>
              <li
                className='px-4 my-8h py-4 border-b rounded-md hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'
              >
                  {item.text}
              </li>
            </Link>
        ))}
      </ul>
    </div>
  );
};

export default Navbar
;