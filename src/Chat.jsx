// import { useContext, useEffect, useRef, useState } from "react";
// import Avatar from "./Avatar";
// import Logo from "./Logo";
// import { UserContext } from "./UserContext.jsx";
// import { uniqBy } from "lodash";
// import axios from "axios";
// import Contact from "./Contact";

// export default function Chat() {
//   const [ws, setWs] = useState(null);
//   const [onlinePeople, setOnlinePeople] = useState({});
//   const [offlinePeople, setOfflinePeople] = useState({});
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [newMessageText, setNewMessageText] = useState('');
//   const [messages, setMessages] = useState([]);
//   const { username, id, setId, setUsername } = useContext(UserContext);
//   const divUnderMessages = useRef();
//   useEffect(() => {
//     connectToWs();
//   }, [selectedUserId]);
//   function connectToWs() {
//     const ws = new WebSocket(import.meta.env.VITE_SOCKET_URL);
//     // const ws = new WebSocket('ws://localhost:4040');
//     setWs(ws);
//     ws.addEventListener('message', handleMessage);
//     ws.addEventListener('close', () => {
//       setTimeout(() => {
//         console.log('Disconnected. Trying to reconnect.');
//         connectToWs();
//       }, 1000);
//     });
//   }

  
//   function showOnlinePeople(peopleArray) {
//     const people = {};
//     peopleArray.forEach(({ userId, username }) => {
//       people[userId] = username;
//     });
//     setOnlinePeople(people);
//   }
//   function handleMessage(ev) {
//     const messageData = JSON.parse(ev.data);
//     // console.log({ev,messageData});
//     if ('online' in messageData) {
//       showOnlinePeople(messageData.online);
//     } else if ('text' in messageData) {
//       if (messageData.sender === selectedUserId) {
//         setMessages(prev => ([...prev, { ...messageData }]));
//       }
//     }
//   }
//   function logout() {
//     axios.post('/logout').then(() => {
//       setWs(null);
//       setId(null);
//       setUsername(null);
//     });
//   }
//   function sendMessage(ev, file = null) {
//     if (ev) ev.preventDefault();
//     ws.send(JSON.stringify({
//       recipient: selectedUserId,
//       text: newMessageText,
//       file,
//     }));
//     if (file) {
//       axios.get('/messages/' + selectedUserId).then(res => {
//         setMessages(res.data);
//       });
//     } else {
//       setNewMessageText('');
//       setMessages(prev => ([...prev, {
//         text: newMessageText,
//         sender: id,
//         recipient: selectedUserId,
//         _id: Date.now(),
//       }]));
//     }
//   }
//   function sendFile(ev) {
//     const reader = new FileReader();
//     reader.readAsDataURL(ev.target.files[0]);
//     reader.onload = () => {
//       sendMessage(null, {
//         name: ev.target.files[0].name,
//         data: reader.result,
//       });
//     };
//   }

//   useEffect(() => {
//     const div = divUnderMessages.current;
//     if (div) {
//       div.scrollIntoView({ behavior: 'smooth', block: 'end' });
//     }
//   }, [messages]);

//   useEffect(() => {
//     axios.get('/people').then(res => {
//       const offlinePeopleArr = res.data
//         .filter(p => p._id !== id)
//         .filter(p => !Object.keys(onlinePeople).includes(p._id));
//       const offlinePeople = {};
//       offlinePeopleArr.forEach(p => {
//         offlinePeople[p._id] = p;
//       });
//       setOfflinePeople(offlinePeople);
//     });
//   }, [onlinePeople]);

//   useEffect(() => {
//     if (selectedUserId) {
//       axios.get('/messages/' + selectedUserId).then(res => {
//         setMessages(res.data);
//       });
//     }
//   }, [selectedUserId]);

//   const onlinePeopleExclOurUser = { ...onlinePeople };
//   delete onlinePeopleExclOurUser[id];

//   const messagesWithoutDupes = uniqBy(messages, '_id');

//   return (
//     <div className="flex h-screen">
//       <div className="bg-white w-1/3 flex flex-col">
//         <div className="flex-grow">
//           <Logo />
//           {Object.keys(onlinePeopleExclOurUser).map(userId => (
//             <Contact
//               key={userId}
//               id={userId}
//               online={true}
//               username={onlinePeopleExclOurUser[userId]}
//               onClick={() => { setSelectedUserId(userId); console.log({ userId }) }}
//               selected={userId === selectedUserId} />
//           ))}
//           {Object.keys(offlinePeople).map(userId => (
//             <Contact
//               key={userId}
//               id={userId}
//               online={false}
//               username={offlinePeople[userId].username}
//               onClick={() => setSelectedUserId(userId)}
//               selected={userId === selectedUserId} />
//           ))}
//         </div>
//         <div className="p-2 text-center flex items-center justify-center">
//           <span className="mr-2 text-sm text-gray-600 flex items-center">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//               <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
//             </svg>
//             {username}
//           </span>
//           <button
//             onClick={logout}
//             className="text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm">logout</button>
//         </div>
//       </div>
//       <div className="flex flex-col bg-blue-50 w-2/3 p-2">
//         <div className="flex-grow">
//           {!selectedUserId && (
//             <div className="flex h-full flex-grow items-center justify-center">
//               <div className="text-gray-300">&larr; Select a person from the sidebar</div>
//             </div>
//           )}
//           {!!selectedUserId && (
//             <div className="relative h-full">
//               <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
//                 {messagesWithoutDupes.map(message => (
//                   <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')}>
//                     <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " + (message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}>
//                       {message.text}
//                       {message.file && (
//                         <div className="">
//                           <a target="_blank" className="flex items-center gap-1 border-b" href={axios.defaults.baseURL + '/uploads/' + message.file}>
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                               <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
//                             </svg>
//                             {message.file}
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={divUnderMessages}></div>
//               </div>
//             </div>
//           )}
//         </div>
//         {!!selectedUserId && (
//           <form className="flex gap-2" onSubmit={sendMessage}>
//             <input type="text"
//               value={newMessageText}
//               onChange={ev => setNewMessageText(ev.target.value)}
//               placeholder="Type your message here"
//               className="bg-white flex-grow border rounded-sm p-2" />
//             <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
//               <input type="file" className="hidden" onChange={sendFile} />
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//                 <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
//               </svg>
//             </label>
//             <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
//               </svg>
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext.jsx";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "./Contact";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const divUnderMessages = useRef();

  useEffect(() => {
    connectToWs();
    return () => {
      if (ws) {
        ws.removeEventListener('message', handleMessage);
        ws.removeEventListener('error', handleError);
        ws.removeEventListener('close', handleClose);
        ws.close();
      }
    };
  }, []);

  function connectToWs() {
    try {
      const ws = new WebSocket(import.meta.env.VITE_SOCKET_URL);
      setWs(ws);

      ws.addEventListener('message', handleMessage);
      ws.addEventListener('error', handleError);
      ws.addEventListener('close', handleClose);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  function handleMessage(ev) {
    console.log('Received message:', ev.data);
    const messageData = JSON.parse(ev.data);
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages(prev => ([...prev, { ...messageData }]));
      }
    }
  }

  function handleError(error) {
    console.error('WebSocket Error:', error);
  }

  function handleClose() {
    console.log('WebSocket connection closed. Attempting reconnection...');
    setTimeout(() => connectToWs(), 1000);
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function logout() {
    axios.post('/logout')
      .then(() => {
        setWs(null);
        setId(null);
        setUsername(null);
      })
      .catch(error => {
        console.error('Logout Error:', error);
      });
  }

  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    if (ws) {
      ws.send(JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
      }));
      if (file) {
        axios.get('/messages/' + selectedUserId)
          .then(res => {
            setMessages(res.data);
          })
          .catch(error => {
            console.error('Error fetching messages:', error);
          });
      } else {
        setNewMessageText('');
        setMessages(prev => ([...prev, {
          text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now(),
        }]));
      }
    } else {
      console.error('WebSocket not connected.');
    }
  }

  function sendFile(ev) {
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
    reader.onerror = (error) => {
      console.error('FileReader Error:', error);
    };
    reader.readAsDataURL(ev.target.files[0]);
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    axios.get('/people')
      .then(res => {
        const offlinePeopleArr = res.data
          .filter(p => p._id !== id)
          .filter(p => !Object.keys(onlinePeople).includes(p._id));
        const offlinePeople = {};
        offlinePeopleArr.forEach(p => {
          offlinePeople[p._id] = p;
        });
        setOfflinePeople(offlinePeople);
      })
      .catch(error => {
        console.error('Error fetching people:', error);
      });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get('/messages/' + selectedUserId)
        .then(res => {
          setMessages(res.data);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, '_id');

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          {Object.keys(onlinePeopleExclOurUser).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleExclOurUser[userId]}
              onClick={() => { setSelectedUserId(userId); console.log({ userId }) }}
              selected={userId === selectedUserId} />
          ))}
          {Object.keys(offlinePeople).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId} />
          ))}
        </div>
        <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            {username}
          </span>
          <button
            onClick={logout}
            className="text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm">Logout</button>
        </div>
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-300">&larr; Select a person from the sidebar</div>
            </div>
          )}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDupes.map(message => (
                  <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')}>
                    <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " + (message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}>
                      {message.text}
                      {message.file && (
                        <div className="">
                          <a target="_blank" className="flex items-center gap-1 border-b" href={axios.defaults.baseURL + '/uploads/' + message.file}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M9.75 3.25a.75.75 0 011.061 0l6.622 6.623a.75.75 0 010 1.061l-6.622 6.623a.75.75 0 01-1.061-1.061L15.688 10H12a.75.75 0 010-1.5h3.688l-5.61-5.61a.75.75 0 010-1.061z" clipRule="evenodd" />
                            </svg>
                            {message.file.name}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages} />
              </div>
            </div>
          )}
        </div>
        {selectedUserId && (
          <div className="flex items-center mt-2 gap-2">
            <input
              type="file"
              className="hidden"
              id="fileInput"
              onChange={sendFile} />
            <label htmlFor="fileInput" className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline-block">
                <path fillRule="evenodd" d="M12 3a4.5 4.5 0 00-4.5 4.5V9h-.25A1.25 1.25 0 006 10.25v10.5A1.25 1.25 0 007.25 22h9.5A1.25 1.25 0 0018 20.75v-10.5A1.25 1.25 0 0016.75 9h-.25V7.5A4.5 4.5 0 0012 3zm0 1.5a3 3 0 013 3v1.5H9V7.5a3 3 0 013-3zm-4 9h2.5a.75.75 0 010 1.5H8.5a.75.75 0 010-1.5zm4.5 0H13a.75.75 0 010 1.5h-1a.75.75 0 010-1.5z" clipRule="evenodd" />
              </svg>
              Upload File
            </label>
            <form className="flex-grow" onSubmit={(ev) => sendMessage(ev)}>
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Type a message" />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

