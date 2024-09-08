// import {createContext, useEffect, useState} from "react";
// import axios from "axios";

// export const UserContext = createContext({});

// export function UserContextProvider({children}) {
//   const [username, setUsername] = useState(null);
//   const [id, setId] = useState(null);
//   useEffect(() => {
//     axios.get('/profile').then(response => {
//       setId(response.data.userId);
//       setUsername(response.data.username);
//     });
//   }, []);
//   return (
//     <UserContext.Provider value={{username, setUsername, id, setId}}>
//       {children}
//     </UserContext.Provider>
//   );
// }

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({
  username: null,
  setUsername: () => {},
  id: null,
  setId: () => {},
});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios.get('/profile')
      .then(response => {
        setId(response.data.userId);
        setUsername(response.data.username);
      })
      .catch(error => {
        console.error('Failed to fetch user profile:', error);
        // Handle the error case as needed (e.g., redirect to login page)
      });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
