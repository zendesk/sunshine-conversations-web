export const SET_AUTH = 'SET_AUTH';
export const RESET_AUTH = 'RESET_AUTH';
export const SET_USER = 'SET_USER';
export const RESET_USER = 'RESET_USER';

export function setAuth(props) {
  return {
    type: SET_AUTH,
    props: props
  };
}

export function resetAuth() {
  return {
    type: RESET_AUTH
  };
}

export function setUser(props) {
  return {
    type: SET_USER,
    user: props
  };
}

export function resetUser() {
  return {
    type: RESET_USER
  };
}
