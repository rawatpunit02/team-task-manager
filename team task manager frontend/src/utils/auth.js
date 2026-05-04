const TOKEN_KEY = "team_task_manager_token";
const USER_KEY = "team_task_manager_user";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

const setAuth = ({ accessToken, user }) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export { clearAuth, getToken, getUser, setAuth };
