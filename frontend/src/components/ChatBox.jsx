import React, { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const ChatBox = ({ children }) => {
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <Container maxWidth="sm">
      <Typography
        component="div"
        style={{
          backgroundColor: 'black',
          height: '50vh',
          padding: '20px',
          overflowY: 'auto',
        }}
        ref={chatBoxRef}
      >
        {children}
      </Typography>
    </Container>
  );
};

export default ChatBox;