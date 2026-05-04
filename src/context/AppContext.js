import React, { createContext, useContext, useState, useMemo } from 'react';
import { DarkColors, LightColors } from '../constants/theme';

const AppContext = createContext({});

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [stars, setStars] = useState(342); // loyalty stars
  const [notifications, setNotifications] = useState(3);
  const [themeMode, setThemeMode] = useState('dark'); // 'dark' | 'light'

  const colors = useMemo(() => themeMode === 'dark' ? DarkColors : LightColors, [themeMode]);
  const isDark = themeMode === 'dark';
  const toggleTheme = () => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');

  const login = (userData) => setUser(userData);
  const logout = () => { setUser(null); setCart([]); };

  const addToCart = (item, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + qty } : c);
      }
      return [...prev, { ...item, qty }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId));
  };

  const updateQty = (itemId, qty) => {
    if (qty <= 0) return removeFromCart(itemId);
    setCart((prev) => prev.map((c) => c.id === itemId ? { ...c, qty } : c));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      cart, addToCart, removeFromCart, updateQty, cartTotal, cartCount,
      stars, setStars,
      notifications, setNotifications,
      themeMode, toggleTheme, colors, isDark,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
