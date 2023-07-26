const isFill = (value) => {
  return value && value.trim();
};

const isEmailValid = (email) => {
  return isFill(email) && email.trim().split(" ").length === 1;
}

const validPassword = (password) => {
  if(!isFill(password) || 5 > password.trim().length || password.trim().length > 10) return false;
  const notUsedChars = [ '~', '`', '!', '^', '*', '(', ')', '-', '+', '=', '{', '}', '[', ']', ':', ';', '"', '\'', '|', '\\', '<', '>', ',', '/', '€' ];
  while(notUsedChars.length > 0) 
    if(password.includes(notUsedChars.pop()))
      return false;
  return true;
};


module.exports = { isFill, isEmailValid, validPassword };
