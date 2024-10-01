import React from 'react';
import { View, Text ,TouchableOpacity} from 'react-native';
import {styles} from './styles';
import { useRouter, useLocalSearchParams } from 'expo-router';

function DirectPay(): React.JSX.Element {
  const router = useRouter();
  const { storeid, tableid } = useLocalSearchParams();

  const handlePaymentRequest = () => {
    router.push(`/store/${storeid}/table/${tableid}/payments/pay`);
  };

  return (
    <View style={styles.cardorcashContainer}>
      <TouchableOpacity style={styles.cardorcash}  >
        <Text style={styles.buttonText} >현금 결제</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardorcash} onPress={handlePaymentRequest}>
        <Text style={[styles.buttonText]}>카드 결제</Text>
      </TouchableOpacity>
    </View>
  );
}

export default DirectPay;