import React, { useState, useContext } from 'react';
import backdrop from './assets/backdrop.png';
import companylogo from './assets/logo.png';
import online from './assets/online.png';
import avatar from './assets/avatar.png';
import file from './assets/filesharing.png';
import Footer from './Footer.jsx';
import axios from 'axios';
import { UserContext } from './UserContext.jsx';

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === 'register' ? '/register' : '/login';
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
    } catch (error) {
      alert(error.response.data.error_message);
    }
  }

  return (
    <>
      <div className="bg-purple-100 min-h-screen">
        <img src={companylogo} alt="company logo" className="h-30 w-20 mr-1 ml-5" />
        <div className="flex flex-col items-center text-center mt-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-blue-600 font-extrabold leading-tight">
            Welcome to Giga Chat,<br />
            Where Conversations Come Alive.<br />
            Connect Instantly, Chat Effortlessly.
          </h2>
        </div>
        <div className="flex justify-center items-center">
          <span className="text-4xl text-gray-700 font-bold mb-4 mt-10 pr-3 pl-3 border-round">Giga Chat</span>
        </div>

        <div className="bg-purple-100 flex items-center">
          <form className="w-64 mx-auto" onSubmit={handleSubmit}>
            <input
              value={username}
              onChange={ev => setUsername(ev.target.value)}
              type="text"
              placeholder="Username"
              className="block w-full rounded-sm p-2 mb-1 border"
            />
            <input
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              type="password"
              placeholder="Password"
              className="block w-full rounded-sm p-2 mb-3 border"
            />
            <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
              {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          {isLoginOrRegister === 'register' ? (
            <p>
              Already a member?
              <button
                className="ml-1 text-blue-500"
                onClick={() => setIsLoginOrRegister('login')}
              >
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?
              <button
                className="ml-1 text-blue-500"
                onClick={() => setIsLoginOrRegister('register')}
              >
                Register
              </button>
            </p>
          )}
        </div>
        <img src={backdrop} alt="Backdrop" className='mx-auto my-8 w-60 h-80'/>
        {/* Key Features Section */}
        <div className="mt-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-8">
            Key Features
          </h3>
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center mr-10">
              <img src={online} alt="Online Feature" className="h-30 w-20 mb-2" />
              <span className="text-lg font-semibold text-gray-700">Online Indicator</span>
            </div>
            <div className="flex flex-col items-center ml-20 mr-20">
              <img src={file} alt="File Sharing Feature" className="h-30 w-20 mb-2" />
              <span className="text-lg font-semibold text-gray-700">File Sharing</span>
            </div>
            <div className="flex flex-col items-center ml-10">
              <img src={avatar} alt="Avatar Feature" className="h-30 w-20 mb-2" />
              <span className="text-lg font-semibold text-gray-700">Name based Avatar</span>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
