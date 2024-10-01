import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Redirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { app, web } = router.query;

      if (typeof app === 'string' && typeof web === 'string') {
        // 앱으로 이동 시도
        window.location.href = decodeURIComponent(app);

        // 2초 후에도 페이지가 이동하지 않으면 웹으로 이동
        setTimeout(() => {
          window.location.href = decodeURIComponent(web);
        }, 2000);
      }
    }
  }, [router.query]);

  return <div>리디렉션 중입니다. 잠시만 기다려주세요...</div>;
}