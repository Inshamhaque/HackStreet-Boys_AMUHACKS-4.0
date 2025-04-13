import { UserProvider } from "../context/UserContext";
import Chat from "../pages/Chat"; // example usage

function ChatProvider() {
  return (
    <UserProvider>
      <Chat />
    </UserProvider>
  );
}

export default ChatProvider;
