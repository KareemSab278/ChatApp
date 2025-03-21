import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import NavBar from "./components/NavBar";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
    <Router>
    <NavBar />
      <Routes>
        <Route path = "/" element = {<HomePage/>}/>
        {/* <Route path = "/Chats" element = {<ChatPage/>}/>*/}
        <Route path="/Chats/:chatId" element={<ChatPage />} /> 
        </Routes>
        </Router>
    </>
  );
}

export default App;
