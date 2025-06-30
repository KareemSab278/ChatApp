import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import NavBar from "./components/NavBar";
import SignUp from "./pages/SignUp";
import "./styles/App.css";
import { HashRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SignIn from "./pages/SignIn";
import { motion, AnimatePresence } from 'framer-motion'


function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6 }}
        style={{ minHeight: '100vh' }}
      >
        <NavBar />
        <Routes location={location}>
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/chats" element={<HomePage />} />
          <Route path="/Chats/:chatId" element={<ChatPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
