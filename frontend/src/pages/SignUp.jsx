import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../../app";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  boxStyle,
  paperStyle,
  titleStyle,
  textFieldStyle,
  submitButtonStyle,
  linkButtonStyle,
  errorTextStyle
} from '../styles/signUpStyles';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [f_name, setFName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !f_name || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
    <Box sx={boxStyle}>
      <Paper elevation={4} sx={paperStyle}>
        <Typography variant="h4" sx={titleStyle}>Sign Up</Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            size="medium"
            sx={textFieldStyle}
          />
          <TextField
            variant="outlined"
            placeholder="Full Name"
            value={f_name}
            onChange={(e) => setFName(e.target.value)}
            fullWidth
            size="medium"
            sx={textFieldStyle}
          />
          <TextField
            variant="outlined"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="medium"
            sx={textFieldStyle}
            InputProps={{
              endAdornment: (
                <Button onClick={() => setShowPassword((v) => !v)} sx={{ minWidth: 0, px: 1, color: '#6a82fb' }} tabIndex={-1} type="button">
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              )
            }}
          />
          <TextField
            variant="outlined"
            placeholder="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            size="medium"
            sx={textFieldStyle}
            InputProps={{
              endAdornment: (
                <Button onClick={() => setShowConfirmPassword((v) => !v)} sx={{ minWidth: 0, px: 1, color: '#6a82fb' }} tabIndex={-1} type="button">
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Button>
              )
            }}
          />
          {error && <Typography variant="body2" sx={errorTextStyle}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" sx={submitButtonStyle}>
            Sign Up
          </Button>
        </form>
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/")}
          sx={linkButtonStyle}
        >
          Already have an account? Sign in
        </Button>
      </Paper>
    </Box>
  );
};

export default SignUp;
