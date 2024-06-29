import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setCredits('Unlimited');
      }
    });

    return () => unsubscribe();
  }, []);

  const updateCredits =(credits)=>{
    console.log('new credits',credits);
    setCredits(credits)
  }
  return (
    <UserContext.Provider value={{ user, setUser, credits, updateCredits, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
