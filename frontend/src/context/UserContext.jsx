// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login() {
    try {
      const me = await apiGet('/me');
      const dash = await apiGet('/dashboard');
      setUser({
        ...me,
        playlists: dash.playlists,
        genres: dash.genres,
        last_played: dash.last_played,
      });
      console.log('✅ Authenticated as:', me.user_id);
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    login();
  }, []);

  const user_id = user?.user_id;
  const importantPlaylists = user?.important_playlists || [];

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        user_id,
        loading,
        importantPlaylists,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};
