import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { delete as del } from '../api/API';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { getLimitTime } from '../util/getLimitTime';
import { SocketContext } from '../socket/SocketContext';
import { useContext, useEffect } from 'react';
import { getMyPartyList } from './../store/partySlice';

interface MyPartyProps {
  open: boolean;
  handleClose: () => void;
}

const MyParty = ({ open, handleClose }: MyPartyProps) => {
  const user = useSelector((state: RootState) => state.userReducer.currentUser);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const myPartyList = useSelector((state: RootState) => state.partySliceReducer.myPartyList);

  useEffect(() => {
    socket.on('leaveSuccess', (result, msg) => {
      dispatch(getMyPartyList());
    });
  }, []);

  const clickLeaveButton = (partyId: number) => {
    socket.emit('leaveParty', partyId, user.userId);
  };

  const clickDeleteButton = async (id: number) => {
    const res = await del(`/api/parties/${id}`);
    socket.emit('deleteParty', '모임삭제');
    dispatch(getMyPartyList());
  };

  return (
    <Container open={open}>
      <Div>
        <Bar>
          <H3>찜 목록</H3>
          <CloseButton onClick={handleClose}>
            <Close />
          </CloseButton>
        </Bar>
      </Div>
      <ListWrapper>
        {myPartyList.length === 0 && <List>참여중인 모임이 없습니다.</List>}
        {myPartyList.map((party, index) => {
          // UTC 기준 시간 > 한국시간으로 변경
          const limit = getLimitTime(party.createdAt, party.timeLimit);
          return (
            <List key={party.partyId}>
              <NoPadFlex>
                <BasicLink to={`/foodlist/${party.shopId}`}>
                  <ImgWrapper>
                    <Img src={party.shopPicture} alt="img" />
                  </ImgWrapper>
                </BasicLink>
                <Description>
                  <BasicLink to={`/foodlist/${party.shopId}`}>
                    <Name>{party.name}</Name>
                  </BasicLink>
                  <Paragraph>
                    모집 현황 {party.likedNum}/{party.partyLimit}
                  </Paragraph>
                </Description>
              </NoPadFlex>
              {user.userId === party.userId && party.isComplete === 0 && (
                <DeleteButton
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => clickDeleteButton(party.partyId)}>
                  모집 종료
                </DeleteButton>
              )}
              {user.userId !== party.userId && party.isComplete === 0 && (
                <DeleteButton onClick={() => clickLeaveButton(party.partyId)}>
                  참여 취소
                </DeleteButton>
              )}
              {party.isComplete === 1 && <Complete>모집 완료</Complete>}
            </List>
          );
        })}
      </ListWrapper>
    </Container>
  );
};

export default MyParty;

const Container = styled.div<{ open: boolean }>`
  color: black;
  font-size: 14px;
  width: 400px;
  background-color: white;
  position: absolute;
  top: 100%;
  right: 100px;
  border-radius: 10px;
  z-index: 999;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
    rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  max-height: ${({ open }) => (open ? '500px' : 0)};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition: all 0.3s ease-in-out;
  overflow: hidden;
`;

const Div = styled.div`
  padding: 5px 0 5px 0;
  width: 100%;
  border-bottom: 1px solid lightgray;
`;

const Flex = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 5px 10px 5px 10px;
  align-items: center;
`;

const NoPadFlex = styled(Flex)`
  padding: 0;
`;

const Bar = styled(Flex)`
  justify-content: space-between;
`;

const CloseButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: transparent;
`;

const Close = styled(CloseIcon)`
  color: lightgray;
  &:hover {
    color: black;
  }
`;

const DeleteButton = styled(Button)`
  position: relative;
  right: 0;
`;

const ListWrapper = styled(Div)`
  max-height: 400px;
  overflow-y: auto;
`;

const List = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`;

const Img = styled.img`
  width: 70px;
  height: 70px;
`;
const ImgWrapper = styled.div`
  width: 70px;
  height: 70px;
  padding: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;
const Description = styled.div`
  margin-left: 10px;
`;

const Paragraph = styled.p`
  + p {
    margin-top: 10px;
  }
`;

const Name = styled(Paragraph)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Time = styled(Paragraph)`
  color: red;
  font-size: 10px;
`;

const H3 = styled.h3`
  font-size: 28px;
  font-weight: bolder;
`;

const BasicLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const Complete = styled.p`
  padding: 6px 8px;
  font-size: 15px;
`;
