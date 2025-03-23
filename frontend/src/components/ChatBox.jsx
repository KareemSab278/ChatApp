import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import getChats from '../../app';

const ChatBox = ({ children }) => {
  return (
    <Container maxWidth="sm">
      <Typography
        component="div"
        style={{
          backgroundColor: 'black',
          height: '50vh',
          padding: '20px',
        }}
      >
        {children}
      </Typography>
    </Container>
  );
};

export default ChatBox;