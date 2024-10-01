import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, useWindowDimensions, Image, TouchableOpacity, Button } from 'react-native';
// import HorizonLine from '../../../src/utils/store/HorizontalLine';
// import OrderList from '../../../src/components/store/OrderList'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import {MD2Colors as Colors} from 'react-native-paper'
import axios from 'axios';
import HorizonLine from '../../src/utils/store/HorizontalLine';
import OrderList from '../../src/components/store/OrderList';

const imageUrl='https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240730_266%2F1722342582932jnQFn_JPEG%2FKakaoTalk_20240730_212808944_01.jpg'
const nickname='STS'

const apiClient = axios.create({
  baseURL: 'http://192.168.30.10:8080',
});

interface Lists {
  list : List[]
}

interface List {
  order_pk: string
  user_pk: number
  storeName: string
  storeAddress: string
  orderedAt: string 
  storeImageUrl: string
}

function myOrderList() {

  const userPk = 1

  const [orderList, setOrderList] = useState<List[]>()
  const [orderNum, setOrderNum] = useState<string>()

  const orderLists = async (userPk : number) => {
    try {
      const res = await apiClient.get(`api/order/simple/${userPk}`)
      setOrderList(res.data)
      setOrderNum(res.data.order_pk)
      console.log('오더리스트1', res.data)
  } catch(e) {
    console.log('주문 내역 불러오기 실패', e)
  } }

  useEffect(() => {
    orderLists(userPk)
  }, [userPk])

  useEffect(() => {
    console.log('오더리스트2', orderList)
    console.log('오더Number', orderNum)
  }, [orderLists])

  const { height, width } = useWindowDimensions();

  const router = useRouter();

  const handleOrderDetail = (order_pk:string) => {
    router.push(`./myDetailOrderList?orderNum=${order_pk}`);
    console.log('최후의 오더넘버?', {order_pk})
  };

  const handleMain = () => {
    router.push(`main`);
  };

  const logOut = async () => {
    await apiClient.post(`/api/auth/logout`)
    router.push(`main`)
  }

return (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{backgroundColor: '#F2F2F2', flex: 1, alignItems:'center'}}>
      <View style={{backgroundColor: '#FFFFFF', width: width >= 786 ? 786 : width}}>
        <View style={{height:'10%', margin:10, flexDirection:'row'}}>
          <View style={{flex: 1, justifyContent:'space-between'}}>
            <Text style={{fontSize: 20}}>내 정보</Text>
            <Image source={{uri : imageUrl}} style={{width:120, height:80, marginRight:10}}/>
          </View>
            <View style={{flex: 2, marginTop:55}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text >{nickname}</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection:'row' }}>
          <TouchableOpacity style={{width: 85, height : 30, marginRight : 10, backgroundColor:Colors.grey300}} onPress={handleMain}>
            <Text style={{textAlign:'center', justifyContent:'center', alignContent:'center'}}>메인화면</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logOut} style={{width: 85, height : 30, marginRight : 10, backgroundColor:Colors.grey300}}>
            <Text style={{textAlign:'center', justifyContent:'center', alignContent:'center'}}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
        <HorizonLine/>
        <View style={{marginTop: 20}}>
            <Text style={{fontSize: 20, marginLeft: 15}}>주문 내역 리스트</Text>
            {orderList?.map((order) => (
          <TouchableOpacity key={order?.order_pk} onPress={() => handleOrderDetail(order?.order_pk)}>
            <OrderList key={order?.order_pk} orderedAt={order?.orderedAt} storeImageUrl={order?.storeImageUrl} storeName={order?.storeName} storeAddress={order?.storeAddress} order_pk={order?.order_pk} user_pk={userPk}/>
            </TouchableOpacity>
          ))}
            </View>
      </View>
    </View>
  </ScrollView>
  )
}

export default myOrderList