import { PROFILES } from "../data/data";

const AUTH_KEY = "auth_user";

export const login = (id, password) => {
  const user = PROFILES.find(
    (p) => p.id === id && p.password === password && p.active
  );

  if (!user) return null;

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(AUTH_KEY);
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};
