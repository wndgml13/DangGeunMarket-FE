import md5 from 'md5';
import styled from 'styled-components';
import { __deleteDetailProduct } from '../redux/modules/detailProductSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getCookieToken, getNickname } from '../storage/Cookie';
import { getChatRoomId } from '../redux/modules/chatSlice';

export default function DetailContent({ detailProduct }) {
  const avatarUrl = `https://www.gravatar.com/avatar/${md5(
    detailProduct.nickname
  )}?d=wavatar`;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = detailProduct.id;
  const nickname = getNickname();

  const config = {
    headers: {
      Authorization: getCookieToken(),
    },
  };

  const displayedAt = (paramTime) => {
    const parseTime = Date.parse(paramTime);
    const date = new Date(parseTime);
    const returnDate =
      date.getFullYear() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes();
    return returnDate;
  };

  const deleteProduct = () => {
    dispatch(__deleteDetailProduct(id));
  };

  const checkRoom = async () => {
    const nickname = getNickname();

    try {
      await axios
        .get(
          `http://3.35.22.118/chat/check/${nickname}/${detailProduct.id}`,
          config
        )
        .then(async (res) => {
          if (res.data.success === false) {
            const data = await axios.post(
              'http://3.35.22.118/chat/chatRoom',
              {
                nickname: nickname,
                productId: detailProduct.id,
              },
              config
            );

            dispatch(getChatRoomId({ roomId: data.data.data.roomId }));
          }
        });
      navigate('/chat');
    } catch (error) {
      throw error;
    }
  };

  return (
    <DetailContentBox>
      <DetailContentProfile>
        <DetailContentUserInfo>
          <DetailContentUserInfoImg src={avatarUrl} alt="avatar" />
          <DetailContentUserInfoWrapper>
            <DetailContentUserInfoNick>
              {detailProduct.nickname}
            </DetailContentUserInfoNick>
            <DetailContentUserInfoLoc>
              {detailProduct.location}
            </DetailContentUserInfoLoc>
          </DetailContentUserInfoWrapper>
        </DetailContentUserInfo>
      </DetailContentProfile>

      <DetailContentDesc>
        <DetailContentDescTitle>{detailProduct.name}</DetailContentDescTitle>
        <DetailContentDescCategory>
          가구/인테리어 ∙ {displayedAt(detailProduct.createdAt)}
        </DetailContentDescCategory>
        <DetailContentDescTime></DetailContentDescTime>
        <DetailContentDescPrice>
          {detailProduct.price} 원
        </DetailContentDescPrice>
        <DetailContentDescContent>
          {detailProduct.content}
        </DetailContentDescContent>
        <DetailContentDescEtc>관심 23 ∙ 채팅 0 ∙ 조회 92</DetailContentDescEtc>

        <Link to={`/edit/${detailProduct.id}`}>
          {nickname === detailProduct.nickname ? (
            <DetailContentButton>수정하기</DetailContentButton>
          ) : null}
        </Link>
        {nickname === detailProduct.nickname ? (
          <DetailContentButton
            onClick={() => {
              if (window.confirm('정말 삭제하시나요?')) {
                deleteProduct();
                navigate('/posts');
              }
            }}
          >
            삭제하기
          </DetailContentButton>
        ) : null}

        <DetailContentCatting onClick={checkRoom}>
          채팅으로 거래하기
        </DetailContentCatting>
      </DetailContentDesc>
    </DetailContentBox>
  );
}

const DetailContentBox = styled.div`
  width: 100%;
`;
const DetailContentProfile = styled.div`
  width: 500px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  padding-top: 15px;
  border-bottom: 1px solid #e9ecef;
`;

const DetailContentUserInfo = styled.div`
  width: 114px;
  height: 50px;
  display: flex;
`;

const DetailContentUserInfoWrapper = styled.div``;
const DetailContentUserInfoImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;

const DetailContentUserInfoNick = styled.div`
  width: 66px;
  height: 25px;
  margin-top: 3px;
  padding-left: 5px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.6px;
  color: #212529;
`;

const DetailContentUserInfoLoc = styled.div`
  width: 66px;
  height: 25px;
  padding-left: 5px;
  font-size: 13px;
  line-height: 1.46;
  letter-spacing: -0.6px;
  color: #212529;
`;

const DetailContentDesc = styled.div`
  padding: 32px 0;
  width: 500px;
  margin: 0 auto;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
`;

const DetailContentDescTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.6px;
`;

const DetailContentDescCategory = styled.p`
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.46;
  letter-spacing: -0.6px;
  color: #868e96;
`;

const DetailContentDescTime = styled.p`
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.46;
  letter-spacing: -0.6px;
  color: #868e96;
`;

const DetailContentDescPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.76;
  letter-spacing: -0.6px;
`;

const DetailContentDescContent = styled.p`
  font-size: 17px;
  line-height: 1.6;
  letter-spacing: -0.6px;
  margin: 16px 0;
  word-break: break-all;
`;

const DetailContentDescEtc = styled.p`
  font-size: 13px;
  line-height: 1.46;
  letter-spacing: -0.6px;
  color: #868e96;
`;

const DetailContentCatting = styled.button`
  width: 180px;
  height: 50px;
  float: right;
  margin-top: 10px;
  background: #ff8a3b;
  border: none;
  border-radius: 7px;

  font-family: 'a15';
  color: white;
  cursor: pointer;
`;

const DetailContentButton = styled.button`
  width: 100px;
  height: 50px;
  border: none;
  margin-right: 20px;
  margin-top: 10px;
  background: #ff8a3b;
  border-radius: 7px;

  font-family: 'a15';
  color: white;
  cursor: pointer;
`;
