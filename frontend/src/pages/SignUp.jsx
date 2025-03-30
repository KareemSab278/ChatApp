import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../../app";
import Button from "../components/Button";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [f_name, setFName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !f_name || !password) {
      setError("All fields are required");
      return;
    }

    const newUser = {
      _id: username,
      username,
      f_name,
      password,
    };

    try {
      const createdUser = await signUpUser(newUser);
      console.log("User signed up:", createdUser);
      localStorage.setItem("signedInUser", JSON.stringify(createdUser));
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Full Name"
          value={f_name}
          onChange={(e) => setFName(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <Button
      name= {'sign in instead'}
      onClick={() => navigate("/")}>

      </Button>
      
    </div>
  );
};

export default SignUp;
