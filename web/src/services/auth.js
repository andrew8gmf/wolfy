export const TOKEN_KEY = "@wolfey-token";
export const USER_KEY = "@wolfey-user";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) && localStorage.getItem(USER_KEY)  !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => localStorage.getItem(USER_KEY);
export const login = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, user);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};