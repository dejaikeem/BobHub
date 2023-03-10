import React, { useState } from 'react';
import styled from 'styled-components';
import CreateIcon from '@mui/icons-material/Create';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { UserInfoType } from '../MyPage';
import {
  validateName,
  validateNickName,
  validatePWCheck,
  validatePhone,
} from '../../../util/validateRegister';
import { validatePassword } from '../../../util/validateLogin';
import * as API from '../../../api/API';

interface UserProps {
  userInfo: UserInfoType;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType>>;
  isLoaded: React.MutableRefObject<boolean>;
}

const UserInfo = ({ userInfo, setUserInfo, isLoaded }: UserProps) => {
  const [userInfoEditing, setUserInfoEditing] = useState({
    isNameEditing: false,
    isNickEditing: false,
    isPhoneEditing: false,
    isPWEditing: false,
  });
  const [inputChange, setInputChange] = useState('');
  const [pwUpdate, setPWUpdate] = useState({ newPW: '', newPWCheck: '' });

  const handleClickUpdate = (e: React.MouseEvent<HTMLElement>, editTarget: string) => {
    e.preventDefault();
    setPWUpdate({ newPW: '', newPWCheck: '' });
    setInputChange('');
    switch (editTarget) {
      case 'name':
        setUserInfoEditing({
          isNameEditing: true,
          isNickEditing: false,
          isPhoneEditing: false,
          isPWEditing: false,
        });
        isLoaded.current = true;
        break;
      case 'nickname':
        setUserInfoEditing({
          isNameEditing: false,
          isNickEditing: true,
          isPhoneEditing: false,
          isPWEditing: false,
        });
        isLoaded.current = true;
        break;
      case 'phone':
        setUserInfoEditing({
          isNameEditing: false,
          isNickEditing: false,
          isPhoneEditing: true,
          isPWEditing: false,
        });
        isLoaded.current = true;
        break;
      case 'password':
        setUserInfoEditing({
          isNameEditing: false,
          isNickEditing: false,
          isPhoneEditing: false,
          isPWEditing: true,
        });
        isLoaded.current = true;
        break;
    }
  };

  const clickBtn_changeEditState = (editTarget: string) => {
    switch (editTarget) {
      case 'name':
        setUserInfoEditing({ ...userInfoEditing, isNameEditing: false });
        break;
      case 'nickname':
        setUserInfoEditing({ ...userInfoEditing, isNickEditing: false });
        break;
      case 'phone':
        setUserInfoEditing({ ...userInfoEditing, isPhoneEditing: false });
        break;
      case 'password':
        setUserInfoEditing({ ...userInfoEditing, isPWEditing: false });
    }
  };

  const nickDuplicationCheck = async () => {
    const res = await API.get(`api/users/nicknames/${inputChange}`);
    return res.message === '??????????????? ??????????????????.' ? true : false;
  };

  const emailDuplicationCheck = async () => {
    const res = await API.get(`api/users/emails/${inputChange}`);
    return res.message === '??????????????? ??????????????????.' ? true : false;
  };

  const validInput = async (editSuccess: string) => {
    setUserInfo({ ...userInfo, [editSuccess]: inputChange });
    clickBtn_changeEditState(editSuccess);
  };

  const handleClickSuccess = async (e: React.MouseEvent<HTMLElement>, editSuccess: string) => {
    e.preventDefault();
    if (editSuccess === 'name') {
      if (!validateName(inputChange)) {
        alert('????????? ??? ?????? ???????????????.');
        return;
      } else {
        validInput(editSuccess);
      }
    } else if (editSuccess === 'nickname') {
      if (!validateNickName(inputChange)) {
        alert('????????? ??? ?????? ??????????????????.');
        return;
      } else {
        const nickExist = await nickDuplicationCheck();
        if (!nickExist) {
          alert('?????? ???????????? ??????????????????.');
          return;
        }
        validInput(editSuccess);
      }
    } else if (editSuccess === 'phone') {
      if (!validatePhone(inputChange)) {
        alert('???????????? ?????? ????????? ?????? ???????????????.');
        return;
      } else {
        try {
          const res = await API.patch(`/api/users`, {
            phone: inputChange,
          });
          if (!res) {
            throw new Error('?????? ????????? ????????? ?????? ????????? ????????? ???????????????.');
          }
        } catch (err) {
          alert(err);
          return;
        }
        validInput(editSuccess);
      }
    } else if (editSuccess === 'password') {
      if (inputChange === '') {
        alert('?????? ??????????????? ??????????????????.');
        return;
      } else if (!validatePassword(pwUpdate.newPW)) {
        alert('????????? ???????????? ????????? ????????????.');
        return;
      } else if (!validatePWCheck(pwUpdate.newPW, pwUpdate.newPWCheck)) {
        alert('??????????????? ???????????? ????????????.');
        return;
      } else {
        try {
          const res = await API.patch(`/api/users`, {
            password: inputChange,
            newPassword: pwUpdate.newPW,
          });
          if (!res) {
            throw new Error('?????? ??????????????? ???????????? ????????????.');
          }
        } catch (err) {
          alert(err);
          return;
        }
        setInputChange('');
        setPWUpdate({ newPW: '', newPWCheck: '' });
        setUserInfo({ ...userInfo, password: '', newPassword: '' });
        clickBtn_changeEditState(editSuccess);
      }
    }
  };

  const handleClickCancel = (e: React.MouseEvent<HTMLElement>, editCancel: string) => {
    e.preventDefault();
    setInputChange('');
    clickBtn_changeEditState(editCancel);
    if (editCancel === 'password') setPWUpdate({ newPW: '', newPWCheck: '' });
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChange(e.target.value);
  };

  return (
    <Table>
      <TableRow>
        <TableHeader>??????</TableHeader>
        {userInfoEditing.isNameEditing ? (
          <ClickedTd>
            <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 } }}>
              <TextField
                value={inputChange}
                onChange={handleUserInfoChange}
                sx={{ height: '45px', width: '315px' }}
                size="small"
                id="demo-helper-text-misaligned-no-helper"
                error={!validateName(inputChange)}
                helperText={
                  !validateName(inputChange)
                    ? '?????? 2~6??????????????? ?????????.'
                    : '????????? ??? ?????? ???????????????.'
                }
              />
            </Box>
            <Stack direction="row">
              <Button
                sx={{
                  fontWeight: 'bold',
                  margin: '15px 10px',
                  border: 'none',
                }}
                size="medium"
                variant="contained"
                color="error"
                onClick={(e) => handleClickCancel(e, 'name')}>
                ??????
              </Button>
              <Button
                sx={{ fontWeight: 'bold', margin: '15px 0px' }}
                size="medium"
                variant="contained"
                onClick={(e) => handleClickSuccess(e, 'name')}>
                ??????
              </Button>
            </Stack>
          </ClickedTd>
        ) : (
          <TableData>
            {userInfo.name}
            <UpdateIcon onClick={(e) => handleClickUpdate(e, 'name')}>
              <CreateIcon color="secondary" fontSize="small" />
            </UpdateIcon>
          </TableData>
        )}
      </TableRow>
      <TableRow>
        <TableHeader>?????? / ??????</TableHeader>
        <TableData>
          {`${userInfo.track.toUpperCase()} ${userInfo.generation}???`}
          <WarningMessage>*?????? ?????? ???, ?????? ???????????????.</WarningMessage>
        </TableData>
      </TableRow>
      <TableRow>
        <TableHeader>?????????</TableHeader>
        {userInfoEditing.isNickEditing ? (
          <ClickedTd>
            <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 } }}>
              <TextField
                onChange={handleUserInfoChange}
                sx={{ height: '45px', width: '315px' }}
                size="small"
                id="demo-helper-text-misaligned-no-helper"
                error={!validateNickName(inputChange)}
                helperText={
                  !validateNickName(inputChange)
                    ? '??????????????(??????????????) 5~10??????????????? ?????????.'
                    : ''
                }
              />
            </Box>
            <Stack direction="row">
              <Button
                sx={{ fontWeight: 'bold', margin: '15px 10px' }}
                color="error"
                size="medium"
                variant="contained"
                onClick={(e) => handleClickCancel(e, 'nickname')}>
                ??????
              </Button>
              <Button
                sx={{ fontWeight: 'bold', margin: '15px 0' }}
                size="medium"
                variant="contained"
                onClick={(e) => handleClickSuccess(e, 'nickname')}>
                ??????
              </Button>
            </Stack>
          </ClickedTd>
        ) : (
          <TableData>
            {userInfo.nickname}
            <UpdateIcon onClick={(e) => handleClickUpdate(e, 'nickname')}>
              <CreateIcon color="secondary" fontSize="small" />
            </UpdateIcon>
          </TableData>
        )}
      </TableRow>
      <TableRow>
        <TableHeader>????????? ??????</TableHeader>
        {userInfoEditing.isPhoneEditing ? (
          <ClickedTd>
            <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 } }}>
              <TextField
                onChange={handleUserInfoChange}
                sx={{ height: '45px', width: '315px' }}
                placeholder="ex) 010-0000-0000"
                size="small"
                id="demo-helper-text-misaligned-no-helper"
                error={!validatePhone(inputChange)}
                helperText={!validatePhone(inputChange) ? '????????? ??????????????? ????????? ????????????.' : ''}
              />
            </Box>
            <Stack direction="row">
              <Button
                sx={{ fontWeight: 'bold', margin: '15px 10px' }}
                color="error"
                size="medium"
                variant="contained"
                onClick={(e) => handleClickCancel(e, 'phone')}>
                ??????
              </Button>
              <Button
                sx={{ fontWeight: 'bold', margin: '15px 0' }}
                size="medium"
                variant="contained"
                onClick={(e) => handleClickSuccess(e, 'phone')}>
                ??????
              </Button>
            </Stack>
          </ClickedTd>
        ) : (
          <TableData>
            {userInfo.phone}
            <UpdateIcon onClick={(e) => handleClickUpdate(e, 'phone')}>
              <CreateIcon color="secondary" fontSize="small" />
            </UpdateIcon>
          </TableData>
        )}
      </TableRow>
      <TableRow>
        <TableHeader>?????????</TableHeader>
        <TableData>
          {userInfo.email}
          <WarningMessage>*?????? ?????? ???, ?????? ???????????????.</WarningMessage>
        </TableData>
      </TableRow>
      <TableRow>
        <TableHeader>????????????</TableHeader>
        {userInfoEditing.isPWEditing ? (
          <ClickedTd>
            <Box>
              <TextField
                sx={{ margin: '0 0 20px 10px', height: '45px', width: '315px' }}
                size="small"
                type="password"
                id="outlined-helperText"
                helperText="?????? ??????????????? ??????????????????."
                onChange={handleUserInfoChange}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
              <TextField
                sx={{ height: '45px', width: '315px' }}
                size="small"
                id="outlined-password-input"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPWUpdate({ ...pwUpdate, newPW: e.target.value })}
                error={!validatePassword(pwUpdate.newPW)}
                helperText={
                  !validatePassword(pwUpdate.newPW)
                    ? '4~20?????? ?????????????? ??????????????? ?????????.'
                    : '????????? ???????????? ??????????????????.'
                }
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                sx={{ height: '45px', margin: '20px 0 10px 10px', width: '315px' }}
                size="small"
                id="outlined-password-input"
                type="password"
                onChange={(e) => setPWUpdate({ ...pwUpdate, newPWCheck: e.target.value })}
                error={!validatePWCheck(pwUpdate.newPW, pwUpdate.newPWCheck)}
                helperText={
                  !validatePWCheck(pwUpdate.newPW, pwUpdate.newPWCheck)
                    ? '??????????????? ??????????????????.'
                    : '??????????????? ???????????????.'
                }
              />
            </Box>
            <Stack direction="row">
              <Button
                sx={{ fontWeight: 'bold', margin: '15px 10px' }}
                size="medium"
                variant="contained"
                color="error"
                onClick={(e) => handleClickCancel(e, 'password')}>
                ??????
              </Button>
              <Button
                sx={{ fontWeight: 'bold', margin: '15px 0' }}
                size="medium"
                variant="contained"
                onClick={(e) => handleClickSuccess(e, 'password')}>
                ??????
              </Button>
            </Stack>
          </ClickedTd>
        ) : (
          <TableData>
            ********
            <UpdateIcon onClick={(e) => handleClickUpdate(e, 'password')}>
              <CreateIcon color="secondary" fontSize="small" />
            </UpdateIcon>
          </TableData>
        )}
      </TableRow>
    </Table>
  );
};

export default UserInfo;

export const Table = styled.table`
  border-collapse: collapse;
  border-bottom: 1.5px solid ${(props) => props.theme.colors.lightGray};
  border-top: 1.5px solid ${(props) => props.theme.colors.lightGray};
  border-left: none;
  border-right: none;
  width: 700px;
  margin-bottom: 50px;
`;

export const TableRow = styled.tr``;

export const TableHeader = styled.th`
  padding: 25px;
  width: 120px;
  border-top: 0.5px solid ${(props) => props.theme.colors.lightGray};
  background-color: ${(props) => props.theme.colors.container};
  font-size: 14px;
`;

export const TableData = styled.td`
  padding: 25px;
  border-top: 0.5px solid ${(props) => props.theme.colors.lightGray};
  border-left: 1.5px solid ${(props) => props.theme.colors.lightGray};
`;

export const ClickedTd = styled.td`
  padding: 15px;
  border-top: 0.5px solid ${(props) => props.theme.colors.lightGray};
  border-left: 1.5px solid ${(props) => props.theme.colors.lightGray};
`;

const UpdateIcon = styled.button`
  position: absolute;
  margin-top: -3px;
  margin-left: 15px;
  cursor: pointer;
  background-color: white;
  border: none;
`;

export const WarningMessage = styled.div`
  margin-top: 10px;
  font-size: 12px;
`;
