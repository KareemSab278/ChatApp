import React, { useState } from "react";
// import { signInUser } from "../app";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../app";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signedInUser = await signInUser({ username, password });
      // alert(`Welcome, ${signedInUser.f_name}`); // very annoying line of code.
      navigate("/chats", { state: { signedInUser } });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="signin">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;