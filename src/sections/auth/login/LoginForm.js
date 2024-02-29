import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../../../components/iconify';
import { logIn, logInEns } from '../../../RequestManagement/loginManagement';

// ----------------------------------------------------------------------
LoginForm.propTypes = {
  role: PropTypes.string,
};
export default function LoginForm({ role }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loginError, setLoginError] = useState('');
  const handleClick = async () => {
    if (!email) {
      setEmailError('Veuillez saisir votre adresse email.');
    } else {
      setEmailError('');
    }
    if (!password) {
      setPasswordError('Veuillez saisir votre mot de passe.');
    } else {
      setPasswordError('');
    }
    if (password && email) {
      if (role === 'Employé') {
        const responce = await logIn(email, password);
        if (responce.code === 200) {
          // the connexion is validated
          setLoginError('');
          navigate('/dashboard', { replace: true });
        } else {
          setLoginError(responce.message);
        }
      } else if (role === 'Enseignant') {
        const responce = await logInEns(email, password);
        if (responce.code === 200) {
          // the connexion is validated
          setLoginError('');
          navigate('/dashboard', { replace: true });
        } else {
          setLoginError(responce.message);
        }
      }
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Address email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          name="password"
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />
        <Typography variant="body2" color="error">
          {loginError}
        </Typography>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleClick}
        >
          Login
        </LoadingButton>
      </Stack>
    </>
  );
}
