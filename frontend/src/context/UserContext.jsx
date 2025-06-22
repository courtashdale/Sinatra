// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // ✅ FIXED
import { apiGet } from '../utils/api';
import { getUserCookie } from '../utils/cookie';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  async function login() {
    try {
      const session = await apiGet('/session');
      setUser(session);
      console.log('✅ Authenticated as:', session.user_id);
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Public page — no need to fetch /me or /dashboard
    if (location.pathname.startsWith('/u/')) {
      setLoading(false);
    } else {
      login();
    }
  }, [location.pathname]);

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

export const useUser = () => useContext(UserContext);
