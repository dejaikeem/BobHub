import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { fetchParties } from '../api/fetchParties';
import { NavLink } from 'react-router-dom';
import { SocketContext } from '../../../socket/SocketContext';
import { Party } from '../Type';
import { getHourmin } from '../../../util/getDate';
import { AiFillStar } from 'react-icons/ai';

const StyledSlider = styled(Slider)`
  border: 1px solid black;
  height: 45vh;
  position: relative;
  .slick-prev::before,
  .slick-next::before {
    opacity: 0;
  }
  .slick-slide div {
    cursor: pointer;
  }
  .slick-prev:hover{
    color : gold;
  }
  .slick-next:hover{
    color : gold;
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 45vh;
  position: relative;
  border: 1px solid black;
  box-sizing: border-box;
`;

const DivNext = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  z-index: 99;
  text-align: right;
  font-size: 100px;
  color: black;
  right: 100px;
  top: 120px;
  line-height: 40px;
`;

const DivPre = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 120px;
  left: 40px;
  z-index: 99;
  text-align: left;
  font-size: 100px;
  color: black;
  line-height: 40px;
`;

const Div = styled.div`
  height: 100%;
  background-color: #fffaf5;
  box-sizing: border-box;
  width: 100%;
  place-items: center;

  .slick-slider {
    padding: 0 15px;
  } //slider

  .slick-list {
    margin-right: -15px;
    margin-left: -15px;
  } //parent

  .slick-slide {
    background-color: white;
    border-radius: 15px;
    height: 350px;
    text-align: center;
    position: relative;
  } //item

  .slide {
    opacity: 0.5;
    transform: scale(0.7);
    transition: 0.3s;
    filter: blur (5px);
  }
  .slide-center {
    opacity: 1;
    transform: scale(1);
  }

  img {
    margin: auto auto 10px auto;
    max-height: 200px;
    overflow: hidden;
    width: 100%;
  }

  span {
    /* position: absolute; */
    top: 150px;
    color: black;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 5px;
  }
`;

const TitleBox = styled.div`
  height: 30px;
  font-size: 2em;
  margin: 30px 30px 30px 30px;
  color: #424140;
  font-weight: bold;
  text-align: center;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-size: 20px;
  }
`;

const ItemContainer = styled.div``;

export default function SimpleSlider() {
  const settings = {
    dots: false,
    className: 'center',
    centerPadding: '0px',
    centerMode: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    draggable: true,
    nextArrow: (
      <DivNext>
        <MdKeyboardArrowRight />
      </DivNext>
    ),
    prevArrow: (
      <DivPre>
        <MdKeyboardArrowLeft />
      </DivPre>
    ),
    beforeChange: (current: number, next: number) => setSlideIndex(next),
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const [parties, setParties] = useState<Party[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const socket = useContext(SocketContext);

  const setPartiesData = async () => {
    const data: Party[] = await fetchParties();
    console.log(data);
    setParties([...data]);
  };

  const handleClick = () => {
    console.log('hi');
  };

  useEffect(() => {
    setPartiesData();
  }, []);

  return (
    <Div>
      <TitleBox>오늘 뭐 먹지?</TitleBox>
      <div>
        {parties.length === 0 ? (
          <LabelContainer>
            <div>활성화된 식당이 없습니다.</div>
          </LabelContainer>
        ) : (
          <StyledSlider {...settings}>
            {parties.map((party, index) => {
              const [hour, minute] = getHourmin(party.createdAt, party.timeLimit);

              return (
                <ItemContainer
                  className={index === slideIndex ? 'slide slide-center' : 'slide'}
                  key={party.shopId}>
                  <NavLink to={`/foodList/${party.shopId}`}>
                    <img src={party.shopPicture} alt="shopImg" />
                  </NavLink>
                  <Description>
                    <span>{party.name}</span>
                    <span>
                      {party.likedNum}/{party.partylimit}
                    </span>
                    <span>마감 : {`~${hour}:${minute}`}</span>
                    <span style={{ alignItems: 'center' }}>
                      <span>
                        <AiFillStar size="19" color="#faaf00" />
                      </span>
                      <span>{Number(party.avgStar).toFixed(1)}</span>
                    </span>
                  </Description>
                  <Button
                    variant="contained"
                    sx={{ cursor: 'pointer', zIndex: 100 }}
                    onClick={handleClick}>
                    참여하기
                  </Button>
                </ItemContainer>
              );
            })}
          </StyledSlider>
        )}
      </div>
    </Div>
  );
}
