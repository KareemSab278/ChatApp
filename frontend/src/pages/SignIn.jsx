import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../app";
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
} from '../styles/signInStyles';

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <Box sx={boxStyle}>
      <Paper elevation={4} sx={paperStyle}>
        <Typography variant="h4" sx={titleStyle}>Sign In</Typography>
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
          {error && <Typography variant="body2" sx={errorTextStyle}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" sx={submitButtonStyle}>
            Sign In
          </Button>
        </form>
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/sign-up")}
          sx={linkButtonStyle}
        >
          Don't have an account? Sign up
        </Button>
      </Paper>
    </Box>
  );
};

export default SignIn;