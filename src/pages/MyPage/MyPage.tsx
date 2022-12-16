import styled from 'styled-components';
import UserInfo from './components/UserInfo';
import NavBar from '../../components/NavBar';
import React from 'react';
import UserLike from './components/UserLike';

const MyPage=()=>{
    return(
        <Container>
            <Nav>
                <NavBar />
            </Nav>
            <Title>
                My Page
            </Title>
            <SubContainer>
                <SubTitle>회원정보</SubTitle>
                <UserInfo />
            </SubContainer>
            <Title>
                Like
            </Title>
            <SubContainer2>
                <UserLike />
            </SubContainer2>
        </Container>
    )
}

export default MyPage;

const Nav =styled.div`
    display:absolute;
    width:100%;

`
const Container=styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    background-color:#f3f2f5;
`

const SubContainer=styled.div`
    display:flex;
    flex-direction:column;
    padding:44px;
    margin-top:10px;
    border-radius:10px;
    background-color:white;
    width:1200px;
    margin-left: 50px;
    margin-bottom:50px;
`

const SubContainer2=styled(SubContainer)`
    align-items:center;
`

const Title=styled.h1`
    font-weight:bold;
    font-size:32px;
    margin:50px 0px;
    color:#303030;
`

const TitleIcon=styled.span`
    display:inline-block;
    margin-right:15px;
    margin-top:20px;
`

const SubTitle=styled.h3`
    font-weight: bold;
    margin:20px 0;
`