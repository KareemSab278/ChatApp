import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import NavBar from "./components/NavBar";
import SignUp from "./pages/SignUp";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <>
    <Router>
    <NavBar />
      <Routes>
        <Route path = "/" element = {<SignIn/>}/>
        <Route path = "/sign-up" element = {<SignUp/>}/>
        <Route path = "/chats" element = {<HomePage/>}/>
        <Route path="/Chats/:chatId" element={<ChatPage />}/> 
        </Routes>
        </Router>
    </>
  );
}

export default App;
