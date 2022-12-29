import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TextField, Button, IconButton } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import { validateEmail, validatePassword } from '../../../util/validateLogin';
import * as API from '../../../api/API';
import logo from '../../../assets/BoBHuB_logo.png';

const ImgFormContainer = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 195px auto;

  & img {
    width: 160px;
    margin: 10px auto;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  background-color: ${(props) => props.theme.colors.container};
  border-radius: 10px;

  width: 500px;
  height: 500px;
  margin: 10% auto; //19.9vh auto;

  & input {
    font-size: 15px;
    width: 380px;
    height: 4vh;
  }

  & div:nth-child(2),
  & div:nth-child(3) {
    margin: 10px auto;
  }

  & div div input {
    font-size: 18px;
  }

  & div div div button {
    padding: 0;
    margin-left: -24px;
    margin-right: 0;
  }
`;

const LoginButtonContainer = styled.div`
  display: flex;
  flex-direction: column;

  & button {
    margin: 25px auto 10px auto;
    width: 413px;
    height: 5vh;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1.5px;
    border: none;
  }

  & a {
    color: #999;
    text-decoration: none;
  }

  & a:hover {
    text-decoration: underline;
  }

  & .goToRegister {
    font-size: 14px;
    margin-top: -10px;
  }
`;

type loginFormProps = {
  onLoginSubmit: (loginForm: { email: string; password: string }) => void;
};

const LoginForm = ({ onLoginSubmit }: loginFormProps) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const { email, password } = loginForm;

  const navigate = useNavigate();

  const location = useLocation();

  const { params } = useParams();

  const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onLoginSubmit(loginForm);

    // email validation
    if (!validateEmail(loginForm.email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      // email 초기화
      setLoginForm({
        email: '',
        password: '',
      });
      return;
    }

    // pw validation
    if (!validatePassword(loginForm.password)) {
      alert('비밀번호 형식이 올바르지 않습니다.');
      // pw 초기화
      setLoginForm({
        email: loginForm.email,
        password: '',
      });
      return;
    }

    try {
      const resLoginForm = await API.post('/api/auth/login', loginForm);
      if (resLoginForm.message.substr(0, 1) === '가') {
        throw new Error(`${resLoginForm.message}`); // 가입되지 않은 회원입니다.
      } else if (resLoginForm.message.substr(0, 1) === '비') {
        throw new Error(`${resLoginForm.message}`); // 비밀번호가 일치하지 않습니다.
      } else if (resLoginForm.result === 'error') {
        throw new Error('로그인을 다시 시도해 주세요.');
      } else {
        // form 초기화
        setLoginForm({
          email: '',
          password: '',
        });
        navigate('/', { replace: true });
      }
    } catch (err) {
      alert(err);
      // form 초기화
      setLoginForm({
        email: '',
        password: '',
      });
      return;
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <ImgFormContainer onSubmit={handleLoginSubmit}>
      <FormContainer>
        <img src={logo} alt="logo" />
        <TextField
          required
          name="email"
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            ),
          }}
          inputProps={{ style: { WebkitBoxShadow: '0 0 0 1000px #fcf3eb inset' } }}
          sx={{
            input: {
              '&::placeholder': {
                opacity: 0.8,
              },
            },
          }}
          placeholder="이메일"
          value={email}
          onChange={onTextFieldChange}
          error={!validateEmail(loginForm.email) && loginForm.email !== ''}
          helperText={
            !validateEmail(loginForm.email) && loginForm.email !== ''
              ? '올바르지 않은 이메일 형식입니다.'
              : ''
          }
        />

        <TextField
          required
          type={showPassword ? 'text' : 'password'}
          name="password"
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ style: { WebkitBoxShadow: '0 0 0 1000px #fcf3eb inset' } }}
          sx={{
            input: {
              '&::placeholder': {
                opacity: 0.8,
              },
            },
          }}
          placeholder="비밀번호"
          value={password}
          onChange={onTextFieldChange}
          error={!validatePassword(loginForm.password) && loginForm.password !== ''}
          helperText={
            !validatePassword(loginForm.password) && loginForm.password !== ''
              ? '비밀번호는 4~20자리 영문·숫자 조합이어야 합니다.'
              : ''
          }
        />
        <LoginButtonContainer>
          <Button variant="contained" type="submit">
            로그인
          </Button>
          <div className="goToRegister">
            아직 계정이 없나요? &nbsp;
            <Link to="/register">회원가입</Link>
          </div>
        </LoginButtonContainer>
      </FormContainer>
    </ImgFormContainer>
  );
};

export default LoginForm;
