import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState()
  const options = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AsyncStorage.getItem('userToken');

        if (user) {
          setToken(user);
          const decodedtoken = jwtDecode(user);
          setAuthUser(decodedtoken);
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage", error);
      }
    };
    loadUser();
  }, [token]);

  // console.log("authUser: ", authUser);


  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, options }}>
      {children}
    </AuthContext.Provider>
  );
};
