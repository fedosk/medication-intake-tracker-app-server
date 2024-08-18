const usernameHandler = (username, email) => {
  if (username) {
    return username;
  }

  const atIndex = email.indexOf('@');

  if (atIndex === -1) {
    throw new Error('Invalid email address');
  }

  return email.slice(0, atIndex);
};

module.exports = usernameHandler;
