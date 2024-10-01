import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, useWindowDimensions ,ScrollView, Alert} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles ,getResponsiveStyles} from './styles';

function App(): React.JSX.Element {
  const responsiveStyles = useMemo(() => getResponsiveStyles(), []);
  const router = useRouter();
  const {storeid, tableid} = useLocalSearchParams();
  const [inputText, setInputText] = useState('');

  const [orderItems, setOrderItems] = useState([
    { name: '초밥', quantity: 2, price: 15000 },
    { name: '알밥', quantity: 1, price: 8000 },
  ]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePaymentRequest = () => {
    if (!phoneNumber.trim()) {      
      alert('휴대폰 번호를 입력해주세요');
    } else {
      router.push(`/store/${storeid}/table/${tableid}/payments/pay`);
    }
  };
  const handlePhoneNumberInput = (text: string) => {
    setPhoneNumber(text);
  }
  const handlepayRequest = () => {
    router.push(`/store/${storeid}/table/${tableid}/payments/pay`);
  };
  const handleDutchpayRequest = () => {
    router.push(`/store/${storeid}/table/${tableid}/payments/dutchpay`);
  };
  const handleDirectpayRequest = () => {
    router.push(`/store/${storeid}/table/${tableid}/payments/directpay`);
  };
 
  const handleInput = (text: string) => {
    setInputText(text);
  }
  return (
    <View style={[styles.container]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        >
        <Text style={styles.title}>결제 방법</Text>
        <View style={styles.buttonContainer}>      
          <TouchableOpacity style={ styles.button && styles.selectedButton} >
            <Text style={styles.buttonText}>간편 결제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDutchpayRequest}>
            <Text style={styles.buttonText}>더치페이</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDirectpayRequest}>
            <Text style={styles.buttonText}>현장 결제</Text>
          </TouchableOpacity>          
        </View>
        <View style={[styles.inputContainer]}>
        <TouchableOpacity style={styles.inputtext}>
            <Text style={styles.orderTitle}>주문 요청 사항</Text> 
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText={handleInput}
            value={inputText}
            placeholder="여기에 입력하세요"
            placeholderTextColor="gray"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.orderTitle}>주문 내역</Text>
          {orderItems.map((item, index) => (
            <View key={index} style={styles.orderItemContainer}>
              <Text style={styles.orderItemName}>{item.name} x {item.quantity}</Text>
              <Text style={styles.orderItemPrice}>{item.price}원</Text>
            </View>
          ))}
          <Text style={styles.orderTotal}>
            결제 금액: {orderItems.reduce((total, item) => total + item.price * item.quantity, 0)}원
          </Text>
        </View>
        <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.orderTitle}>
            <Text style={styles.orderTitle}>휴대폰 번호</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText={handlePhoneNumberInput}
            value={phoneNumber}
            placeholder="여기에 입력하세요"
            placeholderTextColor="gray"
            keyboardType="phone-pad"
          />
        </View>     
        <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.bottomButton} onPress={handlePaymentRequest}>
          <Text style={styles.buttonText}>
            {orderItems.reduce((total, item) => total + item.price * item.quantity, 0)}원 결제
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>      
    </View>
  );
}

export default App;