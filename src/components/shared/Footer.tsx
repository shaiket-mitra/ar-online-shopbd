const Footer = () => {
  return (
    <footer className="footer flex flex-col md:flex-row justify-between sm:footer-horizontal bg-gradient-to-r from-pink-400 via-pink-500 to-pink-500 text-white items-center p-6 rounded-t-2xl shadow-2xl border-t-4 border-pink-500">
      <aside className="grid-flow-col items-center">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="text-yellow-300"
        >
          <path d="M22.672 15.226l-2.432.811..." />
        </svg>
        <p className="text-base font-semibold tracking-wide">
          © {new Date().getFullYear()} AR Online Shop BD Inc. All rights reserved.
        </p>
      </aside>
      <nav className="grid-flow-col gap-6 md:place-self-center md:justify-self-end mr-0 md:mr-8 ">
        <a className="hover:text-yellow-400 transition duration-200">
          {/* Twitter */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            className="fill-current "
          >
            <path
              d="M24 4.557a9.83 9.83 0 01-2.828.775 4.93 4.93 0 002.165-2.724 
               9.864 9.864 0 01-3.127 1.195 4.918 4.918 0 00-8.384 4.482 
               13.955 13.955 0 01-10.141-5.146 4.822 4.822 0 001.523 6.573 
               4.902 4.902 0 01-2.229-.616v.062a4.926 4.926 0 003.946 4.827 
               4.996 4.996 0 01-2.224.085 4.936 4.936 0 004.604 3.417 
               9.867 9.867 0 01-6.102 2.105c-.395 0-.787-.023-1.175-.069 
               A13.945 13.945 0 007.548 21c9.142 0 14.307-7.721 13.995-14.646 
               A10.025 10.025 0 0024 4.557z"
            />
          </svg>
        </a>
        <a className="hover:text-yellow-400 transition duration-200">
          {/* YouTube */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            className="fill-current"
          >
            <path
              d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.03 
               5.804 0 12c.03 6.185.488 8.549 4.385 8.816 3.6.245 11.626.246 
               15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 
               4-8 4z"
            />
          </svg>
        </a>
        <a className="hover:text-yellow-400 transition duration-200">
          {/* Facebook */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            className="fill-current"
          >
            <path
              d="M9 8H6v4h3v12h5V12h3.642l.358-4H14V6.333C14 
               5.378 14.192 5 15.115 5h2.885V0h-3.808C10.596 0 9 
               1.583 9 4.615V8z"
            />
          </svg>
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
