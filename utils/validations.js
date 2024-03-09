export const validateEmail = (email) => {
  const EMAIL_REGEX = /^[a-zA-Z0-9._-]{6,}@(?:gmail\.com|yahoo\.com)$/;
  return EMAIL_REGEX.test(email);
};

export const validatePassword = (email) => {
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  return PWD_REGEX.test(email);
};

export const validateUsername = (name) => {
  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  return USER_REGEX.test(name);
};

export const matchPasswords = (s1, s2) => {
  return s1 === s2;
};

export const validateTitle = (title) => {
  if (title.length <= 3) return false;
  return true;
};

export const validateDeadLine = (inputdate) => {
const dateToCompare = new Date(inputdate);
const currentDate = new Date();

return dateToCompare > currentDate;
}