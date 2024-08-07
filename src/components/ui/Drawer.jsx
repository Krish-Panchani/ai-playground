import React from "react";
import { Link } from 'react-router-dom';
import { CgGames } from "react-icons/cg";
import { IoClose } from "react-icons/io5";

export default function Drawer({ children, isOpen, setIsOpen }) {
  return (
    <main
      className={
        "fixed overflow-hidden z-50 backdrop-blur-sm inset-0 transform ease-in-out " +
        (isOpen
          ? "transition-opacity opacity-100 duration-200 translate-x-0 "
          : "transition-all delay-200 opacity-0 -translate-x-full ")
      }
    >
      <section
        className={
          "max-w-sm left-0 absolute bg-white shadow-orange-500 rounded-r-3xl h-full shadow-xl delay-400 duration-200 ease-in-out transition-all transform " +
          (isOpen ? "translate-x-0 " : "-translate-x-full ") +
          (isOpen ? "w-4/5 " : "") // Add this line to set width to 80% in mobile mode
        }
      >
        <article className="relative max-w-sm pb-10 flex flex-col overflow-y-scroll overflow-x-hidden space-y-6 h-full ">
          <header className="p-4 font-bold text-lg flex justify-between items-center border-b-2 border-orange-500">
            <Link to="/">
              <div className='flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate'>
                <CgGames className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
                <span className="text-xl sm:text-2xl font-bold">AI Playground</span>
              </div>
            </Link>
            <button
              className="text-black hover:text-gray-700 text-2xl"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <IoClose />
            </button>
          </header>
          {children}
        </article>
      </section>
      <section
        className="w-screen h-full cursor-pointer"
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
}
