
export const mainBoxStyle = {
  minHeight: '100vh',
  bgcolor: '#181a20',
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'stretch',
  justifyContent: 'center',
};

export const drawerPaperStyle = {
  width: 260,
  bgcolor: '#23263a',
  color: '#fff',
};

export const sidebarBoxStyle = {
  p: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

export const signOutButtonStyle = {
  mb: 2,
  width: '100%',
  justifyContent: 'center',
  bgcolor: '#6a82fb',
  color: '#fff',
  '&:hover': { bgcolor: '#5a6fdc' },
};

export const searchTextFieldStyle = {
  mb: 2,
  bgcolor: '#181a20',
  input: { color: '#fff' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#444' },
    '&:hover fieldset': { borderColor: '#6a82fb' },
    '&.Mui-focused fieldset': { borderColor: '#6a82fb' },
  },
};

export const chatButtonStyle = (selected) => ({
  width: '100%',
  justifyContent: 'flex-start',
  mb: 1,
  bgcolor: selected ? '#6a82fb' : '#23263a',
  color: '#fff',
  borderColor: '#444',
  '&:hover': { bgcolor: '#5a6fdc' },
  textTransform: 'none',
});

export const chatAreaBoxStyle = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  height: { xs: 'auto', sm: '100vh' },
  maxWidth: { xs: '100vw', sm: 700 },
  bgcolor: 'transparent',
  paddingLeft: { xs: 0, sm: '5px' },
};

export const chatMessagesBoxStyle = {
  flex: 1,
  width: '100%',
  overflowY: 'auto',
  bgcolor: '#181a20',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minHeight: 0,
  px: { xs: 2, sm: 4 },
  py: 2,
  boxSizing: 'border-box',
  maxHeight: { xs: 'calc(100vh - 112px)', sm: 'calc(100vh - 128px)' },
};

export const chatInputPaperStyle = {
  width: '100%',
  borderRadius: 0,
  px: { xs: 2, sm: 4 },
  py: 2,
  bgcolor: '#23263a',
  borderTop: '1px solid #23263a',
  flexShrink: 0,
  position: 'sticky',
  bottom: 0,
  zIndex: 2,
  boxSizing: 'border-box',
};
