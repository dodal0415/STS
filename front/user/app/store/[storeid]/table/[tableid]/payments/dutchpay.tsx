import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, useWindowDimensions ,ScrollView} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles ,getResponsiveStyles} from './styles';
import { useSocket } from '../../../../../../src/components/pay/useSoket';
import QRCodeGenerator from './makeqr';


function App(): React.JSX.Element {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [clientSelections, setClientSelections] = useState<Set<string>>(new Set());
  const { socket, disabledButtons, toggleButton } = useSocket();

  const buttons = ['인원 수', '메뉴별', '금액 지정'];

  const router = useRouter();
  const { storeid, tableid } = useLocalSearchParams();

  const deepLink = "myapp://store/${storeid}/table/${tableid}/payments/dutchpay";
  const baseUrl = __DEV__ 
  ? 'http://localhost:8081' 
  : 'https://your-actual-website.com';

  const webUrl = `${baseUrl}/store/${storeid}/table/${tableid}/payments/dutchpay`;  
  const universalLink = `${baseUrl}?app=${encodeURIComponent(deepLink)}&web=${encodeURIComponent(webUrl)}`;

  const [inputText, setInputText] = useState('');
  const [orderItems, setOrderItems] = useState([
    { id: '1', name: '초밥', quantity: 10, price: 15000 },
    { id: '2', name: '알밥', quantity: 1, price: 8000 },
  ]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePaymentRequest = () => {
    router.push(`/store/${storeid}/table/${tableid}/payments/pay`);
  };

  const handleInput = (text: string) => {
    setInputText(text);
  };

  const handleButtonPress = (buttonType: string) => {
    setSelectedButton(prevSelected => prevSelected === buttonType ? null : buttonType);
  };

  const handleToggleButton = (buttonId: string) => {
    // 서버와 동기화
    toggleButton(buttonId, !disabledButtons.has(buttonId));
    
    // 클라이언트 로컬 상태 업데이트
    setClientSelections(prevSelections => {
      const newSelections = new Set(prevSelections);
      if (newSelections.has(buttonId)) {
        newSelections.delete(buttonId);
      } else {
        newSelections.add(buttonId);
      }
      return newSelections;
    });
  };
  const handlePhoneNumberInput = (text: string) => {
    setPhoneNumber(text);
  }
  const calculateSelectedPrice = () => {
    if (selectedButton === '메뉴별') {
      return Array.from(clientSelections).reduce((total, buttonId) => {
        const [itemId] = buttonId.split('-');
        const item = orderItems.find(item => item.id === itemId);
        return total + (item ? item.price : 0);
      }, 0);
    }
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const renderContent = () => {
    switch (selectedButton) {
      case '인원 수':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.orderTitle}>주문 내역</Text>
            {orderItems.map((item, index) => (
              <View key={index} style={styles.orderItemContainer}>
                  <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.buttonText}>{item.name} x {item.quantity}</Text>
                  </TouchableOpacity>                
                <Text style={styles.menuButtonText}>{item.price}원</Text>
              </View>
            ))}
            <Text style={styles.orderTotal}>
              결제 금액: {orderItems.reduce((total, item) => total + item.price * item.quantity, 0)}원
            </Text>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={handleInput}
                value={inputText}
                placeholder="사람수만큼 입력하세요"
                placeholderTextColor="gray"
              />
            </View>
          </View>
        );
      case '메뉴별':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.orderTitle}>주문 내역</Text>
            {orderItems.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.orderItemContainer}>                
                <View style={styles.menuButtonsContainer}>
                  {[...Array(item.quantity)].map((_, buttonIndex) => (
                    <React.Fragment key={buttonIndex}>
                      {buttonIndex > 0 && buttonIndex % 4  === 0 && <View style={styles.lineBreak} />}
                      <TouchableOpacity
                        style={[
                          styles.menuButton,
                          disabledButtons.has(`${item.id}-${buttonIndex}`) && styles.disabledButton,
                          clientSelections.has(`${item.id}-${buttonIndex}`) && styles.selectedButton
                        ]}
                        onPress={() => handleToggleButton(`${item.id}-${buttonIndex}`)}
                        disabled={disabledButtons.has(`${item.id}-${buttonIndex}`) && !clientSelections.has(`${item.id}-${buttonIndex}`)}
                      >
                        <Text style={styles.buttonText}>{item.name}</Text>
                      </TouchableOpacity>                    
                    </React.Fragment>
                  ))}
                </View>                  
                <Text style={styles.menuButtonText}>{item.price}원</Text>
              </View>
            ))}
            <Text style={styles.orderTotal}>
              결제 금액: {calculateSelectedPrice()}원
            </Text>
          </View>
        );
      case '금액 지정':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.orderTitle}>주문 내역</Text>
            {orderItems.map((item, index) => (
              <View key={index} style={styles.orderItemContainer}>                
                <View style={styles.menuButtonsContainer}>
                      <TouchableOpacity style={styles.menuButton}>                       
                        <Text style={styles.buttonText}>{item.name} X {item.quantity}</Text>
                      </TouchableOpacity>                    
                </View>                  
                <Text style={styles.menuButtonText}>{item.price}원</Text>
              </View>
            ))}
            <Text style={styles.orderTotal}>
              결제 금액: {orderItems.reduce((total, item) => total + item.price * item.quantity, 0)}원
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={handleInput}
                value={inputText}
                placeholder="금액 지정"
                placeholderTextColor="gray"
              />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={styles.title}>더치페이</Text>
        <View style={styles.buttonContainer}>
          {buttons.map((button) => (
            <TouchableOpacity
              key={button}
              style={[styles.button, selectedButton === button && styles.selectedButton]}
              onPress={() => handleButtonPress(button)}
            >
            <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
          ))}
        </View>        
        {renderContent()}
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
        <QRCodeGenerator value={universalLink} />                    

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.bottomButton} onPress={handlePaymentRequest}>
            <Text style={styles.buttonText}> 
              {calculateSelectedPrice()}원 결제
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

export default App;