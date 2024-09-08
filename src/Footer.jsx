import React from 'react';
import companyLogo from './assets/logo.png'; // Replace with your logo path
import abhilashlogo from './assets/abhilash_favicon.png';

function Footer() {
  return (
    <footer className="bg-blue-50 text-center py-4 mt-10">
      <div className="flex justify-center items-center mb-4">
        <img src={companyLogo} alt="Company Logo" className="h-15 w-10 mr-2" />
        <span className="text-xl font-semibold">Giga Chat</span>
      </div>
      <div className='flex justify-center items-center mb-4'>
        <p className="text-sm text-gray-600">
          © 2024 Giga Chat. All rights reserved.{" "} 
          <a
            href="https://abhilash-dev.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-purple-400 cursor-pointer"
          >
            Abhilash-dev™.
          </a>{" "}
        </p>
        <img
          src={abhilashlogo}
          className="w-6 h-10 ml-2 rounded-full shadow-md"
          alt="Logo"
        />
      </div>
      <div className="flex justify-center space-x-4">
        <a href="/terms" className="text-sm text-blue-500 hover:underline">
          Terms of Service
        </a>
        <a href="/privacy" className="text-sm text-blue-500 hover:underline">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}

export default Footer;
