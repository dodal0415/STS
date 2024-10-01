import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { styles } from '../styles';

// IMP 타입 정의
declare global {
  interface Window {
    IMP?: {
      init: (accountID: string) => void;
      request_pay: (params: any, callback: (response: any) => void) => void;
    };
  }
}
function Pay(): React.JSX.Element {
  const [impInitialized, setImpInitialized] = useState(false);
  const MERCHANT_UID = "order_no_0005";
  const REDIRECT_URL = "http://localhost:8081/store/1/table/1/payments/pay/Paymentcompleted";

  const param = useLocalSearchParams();

  const requestPayment = useCallback(() => {
    if (Platform.OS === 'web') {
      if (window.IMP) {
        window.IMP.request_pay({
          pg: "html5_inicis",
          pay_method: 'card',
          merchant_uid: MERCHANT_UID,
          name: '주문명:결제테스트',
          amount: 10,
          buyer_email: 'iamport@siot.do',
          buyer_name: '구매자이름',
          buyer_tel: '010-1234-5678',
          buyer_postcode: '123-456',
          m_redirect_url: REDIRECT_URL,
        }, function(rsp: any) {
          if (rsp.success) {
            alert('빌링키 발급 성공');
          } else {
            alert('결제 요청 취소');
          }
        });
      }
    } else {
      WebBrowser.openBrowserAsync(`https://your-payment-url.com?merchant_uid=${MERCHANT_UID}&amount=100`);
    }
  }, [MERCHANT_UID, REDIRECT_URL]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/v1/iamport.js';
      script.async = true;
      script.onload = () => {
        if (window.IMP) {
          window.IMP.init('imp24556753');
          setImpInitialized(true);
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (impInitialized) {
      requestPayment();
    }
  }, [impInitialized, requestPayment]);

  const cancelPayment = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cancel-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          imp_uid: 'imp24556753',
          merchant_uid: MERCHANT_UID,          
         }),
      });
      const result = await response.json();
      if (result.success) {
        alert('결제가 취소되었습니다.');
      } else {
        alert('결제 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('결제 취소 중 오류 발생:', error);      
    }
  }, [MERCHANT_UID]);


  return (
    <View style={styles.container}>   
      <TouchableOpacity
        onPress={cancelPayment}        
        style={styles.button}      >
        <Text>결제 취소</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Pay;
