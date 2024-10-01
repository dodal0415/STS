import React from 'react';
import OrderInProgress from './orderinprogress.tsx';
import { useRouter } from 'expo-router';

const PaymentPage: React.FC = () => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
    console.log('페이지 닫기');
  };

  const handleRefresh = () => {
    // 새로고침 로직 구현
    console.log('페이지 새로고침');
  };
  return <OrderInProgress onClose={handleClose} onRefresh={handleRefresh} />;
};

export default PaymentPage;