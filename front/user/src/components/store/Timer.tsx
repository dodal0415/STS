import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'; //dayjs 내 플러그인 import

dayjs.extend(duration); //이걸 해줘야 duration사용가능

//매개변수로 기한을 받아와서 현재시간과의 차이를 구해 남은시간을 계산
export default function useCountDownTimer(targetTime: string) {
  const [remainingTime, setRemaingTime] = useState('');

  useEffect(() => {
    const calculateRemainingTime = () => {
      const currentTime = dayjs(); //현재시간
      const targetDate = dayjs(targetTime); //전달받는 기한 날짜
      const duration = dayjs.duration(targetDate.diff(currentTime)); //diff:차이구하기/duration:차이구한것을 객체로 반환해줌

//      const days = String(duration.days()).padStart(2, '0'); //padStart(목표문자열길이,모자라면채워지는값)
//      const hours = String(duration.hours()).padStart(2, '0');
if (duration.asMilliseconds() > 0) {
      const minutes = String(duration.minutes()).padStart(2, '0');
      const seconds = String(duration.seconds()).padStart(2, '0');

      //setRemaingTime(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);
      setRemaingTime(`${minutes}: ${seconds}`);
    } else {
        setRemaingTime(`TIME OUT!`)
    }
}
    if (remainingTime !== 'TIME OUT') {
        const intervalId = setInterval(calculateRemainingTime, 1000); //1초마다 불러오기
        return () => clearInterval(intervalId);
      }
      return;
    }, [targetTime, remainingTime]);
  
    return {
      remainingTime,
    };
  }