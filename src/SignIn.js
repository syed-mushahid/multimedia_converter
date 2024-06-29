import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, IconButton, InputAdornment, Snackbar, Alert, Paper, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { UserContext } from './UserContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, updateCredits } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      updateCredits('Unlimited');
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        {error && (
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSignIn}>
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
