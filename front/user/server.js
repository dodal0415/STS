const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

try {
  require('dotenv').config({ path: './key.env' });
} catch (error) {
  console.error('환경 변수 로드 중 오류 발생:', error);
}

const IAMPORT_API_KEY = process.env.IAMPORT_API_KEY;
const IAMPORT_API_SECRET = process.env.IAMPORT_API_SECRET;

if (!IAMPORT_API_KEY || !IAMPORT_API_SECRET) {
  console.error('IAMPORT_API_KEY 또는 IAMPORT_API_SECRET이 설정되지 않았습니다.');
  process.exit(1);
}

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const disabledButtons = new Set();

io.on('connection', (socket) => {
  console.log('새로운 클라이언트가 연결되었습니다.');
  socket.emit('initialState', { disabledButtons: Array.from(disabledButtons) });
  socket.on('getInitialState', () => {
    socket.emit('initialState', { disabledButtons: Array.from(disabledButtons) });
  });

  socket.on('buttonToggle', (data) => {
    if (data.selected) {
      disabledButtons.add(data.button);
    } else {
      disabledButtons.delete(data.button);
    }
    io.emit('buttonUpdate', { disabledButtons: Array.from(disabledButtons) });
  });

  socket.on('disconnect', () => {
    console.log('클라이언트 연결이 끊어졌습니다.');
  });
});

async function getIamportAccessToken() {
  try {
    const response = await axios.post('https://api.iamport.kr/users/getToken', {
      imp_key: IAMPORT_API_KEY,
      imp_secret: IAMPORT_API_SECRET
    });
    return response.data.response.access_token;
  } catch (error) {
    console.error('아임포트 토큰 얻기 실패:', error.response ? error.response.data : error.message);
    throw error;
  }
}

app.post('/api/cancel-payment', async (req, res) => {  
  try {
    const { merchant_uid, imp_uid } = req.body;    
    const accessToken = await getIamportAccessToken();
    console.log('accessToken:', accessToken);
    console.log('merchant_uid:', merchant_uid);
    console.log('imp_uid:', imp_uid);
    const response = await axios.post('https://api.iamport.kr/payments/cancel',
      {
        merchant_uid: merchant_uid,
        imp_uid: imp_uid  // imp_uid가 필요한 경우에만 포함
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log(response.data);
    if (response.data.code === 0) {
      res.json({ success: true, message: '결제가 성공적으로 취소되었습니다.' });
    } else {
      res.json({ success: false, message: response.data.message });
    }
  } catch (error) {
    console.error('결제 취소 중 오류 발생:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});



const PORT =  3000;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
