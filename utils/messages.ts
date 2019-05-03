export const generateMessage = (message: String) => ({
  message,
  createdAt: new Date().getTime()
});

export const generateLocationMessage = (url: String) => ({
  url,
  createdAt: new Date().getTime()
});
