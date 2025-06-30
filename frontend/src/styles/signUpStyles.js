// signUpStyles.js

export const boxStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const paperStyle = {
  p: { xs: 3, sm: 5 },
  bgcolor: '#23263a',
  borderRadius: 3,
  minWidth: 320,
  maxWidth: 360,
  width: '100%',
};

export const titleStyle = {
  color: '#fff',
  fontWeight: 700,
  mb: 3,
  textAlign: 'center',
};

export const textFieldStyle = {
  mb: 2,
  bgcolor: '#181a20',
  input: { color: '#fff' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#444' },
    '&:hover fieldset': { borderColor: '#6a82fb' },
    '&.Mui-focused fieldset': { borderColor: '#6a82fb' },
  },
};

export const submitButtonStyle = {
  bgcolor: '#6a82fb',
  color: '#fff',
  fontWeight: 600,
  borderRadius: 2,
  py: 1.2,
  '&:hover': { bgcolor: '#5a6fdc' },
};

export const linkButtonStyle = {
  mt: 2,
  color: '#6a82fb',
  fontWeight: 500,
  textTransform: 'none',
  width: '100%',
};

export const errorTextStyle = {
  color: 'red',
  mb: 1,
  textAlign: 'center',
};
