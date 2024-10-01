import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, SafeAreaView, Button, Pressable } from 'react-native';
import HorizonLine from '../../src/utils/store/HorizontalLine';
import {MD2Colors as Colors} from 'react-native-paper'
import { useGlobalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

interface DetailList {
order_pk : string
storeName : string
storeAddress : string
totalPrice : number
orderedAt : string,
paymentType : string
orderItems : orderItem[]
}

interface orderItem {
menuName : String
menuCount : number
optionltemList : String
}

const orderDetailList = () => {

    const { height, width } = useWindowDimensions();

    const param = useGlobalSearchParams();
    const router = useRouter();

    const apiClient = axios.create({
      baseURL: 'http://192.168.30.10:8080',
    });

    const myOrderListEnter = () => {
      router.push(`./myOrderList`);
    };

    console.log('파람: ', param)

    const orderNum = param.orderNum

    const [orderDetail, setOrderDetail] = useState<DetailList>()

    const requestDetail = async (orderNum: string) => {
      try {
        const res = await apiClient.get(`/api/order/detail/${orderNum}`)
        setOrderDetail(res.data)
        console.log(res.data)
      } catch(e) {
        console.log('디테일 불러오기 실패', e)
      }
    }

    useEffect(() => {
      if (orderNum) {
        requestDetail(orderNum as string)
      }
    },[orderNum])

  return (
    <ScrollView>
    <View style={{backgroundColor: '#F2F2F2', flex: 1, alignItems:'center'}}>
      <View style={{backgroundColor: '#FFFFFF', width: width >= 786 ? 786 : width}}>
            <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop: 20}}>
                <Text style={styles.title}>주문 상세 내역</Text>
            </View>
      <View style={styles.content}>
        <View style={styles.innerContent}>
        <Text style={styles.title}>{orderDetail?.paymentType}</Text>
        <Text style={styles.price}>{orderDetail?.totalPrice}</Text>
        <Text style={styles.description}>{orderDetail?.storeName}</Text>
        <Text style={styles.description}>{orderDetail?.orderedAt}</Text>
        <Text style={styles.description}>{orderDetail?.storeAddress}</Text>
        <Text style={styles.description}>{orderDetail?.order_pk}</Text>
        <Text style={styles.description}>{orderDetail?.orderItems.map((opt) =>
          opt.menuCount)}</Text>
        <Text style={styles.description}>{orderDetail?.orderItems.map((opt) =>
          opt.menuName)}</Text>
        <Text style={styles.description}>{orderDetail?.orderItems.map((opt) =>
          opt.optionltemList)}</Text>
      </View>
      </View>
      <View style={{flexDirection:'row', margin: 20, justifyContent:'center', alignItems:'center'}}>
      <TouchableOpacity onPress={myOrderListEnter} style={styles.button}>
        <Text style={styles.buttonText}>뒤로 가기</Text>
      </TouchableOpacity>
    </View>
      </View>
      </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    margin: 10,
    overflow: 'hidden',
  },
  content: {
    padding: 10,
    borderColor:Colors.grey100,
    borderRadius:20,
    borderWidth: 10,
    margin:20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  innerContent: {
    margin: 10,
    padding: 15,
    borderWidth:1,
  },
  button: {
    flex: 1,               
    backgroundColor: Colors.grey500,
    paddingVertical: 10,   // 버튼 높이 설정
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,   // 버튼 - 버튼 사이 간격
  },
  container: {
    flexDirection: 'row',  
    width: '100%',        
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default orderDetailList;
