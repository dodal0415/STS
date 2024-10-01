import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import cookIcon from '../../../../../../../assets/images/cook.png';
import readyIcon from '../../../../../../../assets/images/foodready.png';

interface OrderInProgressProps {
  onClose: () => void;
  onRefresh: () => void;
}

const OrderInProgress: React.FC<OrderInProgressProps> = ({ onClose, onRefresh }) => {
  const [remainingTime, setRemainingTime] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.refreshButton}>↻</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>        
        {isCompleted ? (
          <View style={styles.checkContainer}>
            <Image source={cookIcon} style={styles.checkIcon} />          
            <Text style={styles.title}>결제가 완료되었습니다.</Text>
            <Text style={styles.subtitle}>평균 대기 시간은 3분 정도 입니다.</Text>
            <Text style={styles.subtitle}>주문 번호는 010-1234-5678 입니다.(이건 보여주지말까 ?)</Text>                   
          </View>                    
        ) : (
          <>
            <Image source={readyIcon} style={styles.checkIcon} />          
            <Text style={styles.title}>주문 진행 중이에요</Text>
            <Text style={styles.subtitle}>잠시만 기다려 주세요</Text>
            <Text style={styles.subtitle}>잠시 후 다시 주문해 주세요</Text>
            <Text style={styles.timer}>남은시간 {remainingTime}초</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timer: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  checkIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  checkContainer: {   
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
});

export default OrderInProgress;