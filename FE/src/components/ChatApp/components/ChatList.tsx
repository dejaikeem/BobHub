import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { TextCss, Title } from './ChatStyle';
import { SocketContext } from '../../../socket/SocketContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { Party } from '../../../pages/MainPage/Type';

const ChatContainer = styled.div`
  overflow: auto;
  height: 400px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CursorDiv = styled.div`
  position: relative;
  cursor: pointer;
  font-size: 15px;
  ${TextCss}
`;

interface ChatListProps {
  moveRoom: (x: string) => void;
}

const ChatList = ({ moveRoom }: ChatListProps) => {
  const socket = useContext(SocketContext);
  const userName = useSelector<RootState>((state) => state.userReducer.currentUser.name);
  const isLogin = useSelector<RootState>((state) => state.userReducer.isLogin);
  const myPartyList = useSelector((state: RootState) => state.partySliceReducer.myPartyList);
  const [completedParty, setCompletedParty] = useState<Party[]>([]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { roomname, partyid } = e.currentTarget.dataset;
    socket.emit('enterRoom', roomname, partyid, moveRoom);
  };

  useEffect(() => {
    socket.emit('nickname', userName);

    setCompletedParty(myPartyList.filter((party) => party.isComplete === 1));

    // 실제 room이 만들어진걸 확인함.
  }, [userName]);

  return (
    <>
      <Title>Chat Lists</Title>
      <ChatContainer>
        {!isLogin ? (
          <CursorDiv>"로그인을 해주세요"</CursorDiv>
        ) : completedParty.length === 0 ? (
          <CursorDiv>생성된 채팅방이 없습니다.</CursorDiv>
        ) : (
          completedParty.map((party) => (
            <>
              <CursorDiv
                onClick={handleMove}
                key={party.partyId}
                data-roomname={party.name}
                data-partyid={party.partyId}>
                {party.name}
              </CursorDiv>
            </>
          ))
        )}
      </ChatContainer>
    </>
  );
};

export default ChatList;
