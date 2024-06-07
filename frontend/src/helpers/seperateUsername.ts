interface props {
  username: string;
}

const seperateUsername = ({ username }: props) => {
  if (!username) return null;

  if (!username.includes("@")) return username;

  return username.split("@")[1];
};

export default seperateUsername;
