export const generateMessage = (username: string, message: String) => ({
  username,
  message,
  createdAt: new Date().getTime()
});

export const generateLocationMessage = ({
  username,
  url
}: {
  username: string;
  url: any;
}) => ({
  username,
  url,
  createdAt: new Date().getTime()
});
