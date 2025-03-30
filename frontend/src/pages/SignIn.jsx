import React, { useState } from "react";
// import { signInUser } from "../app";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../app";
import Button from "../components/Button";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signedInUser = await signInUser({ username, password });
      console.log('moving to chats page with id:', signedInUser._id)
      localStorage.setItem("signedInUser", JSON.stringify(signedInUser));
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
      <Button
      name= {'sign up'}
      onClick={() => navigate("/sign-up")}>
      </Button>
    </div>
  );
};

export default SignIn;