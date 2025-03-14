import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const ChatBox = ({ children }) => {
  return (
    <Container maxWidth="sm">
      <Typography
        component="div"
        style={{
          backgroundColor: 'black',
          height: '100vh',
          padding: '10px',
        }}
      >
        {children}
      </Typography>
    </Container>
  );
};

export default ChatBox;