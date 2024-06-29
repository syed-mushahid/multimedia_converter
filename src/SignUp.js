import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, IconButton, InputAdornment, Snackbar, Alert, Paper, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { UserContext } from './UserContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebaseConfig';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, updateCredits } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
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
          Sign Up
        </Typography>
        {error && (
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          margin="normal"
        />
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
        <TextField
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          <Button variant="contained" color="primary" fullWidth onClick={handleSignUp}>
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
