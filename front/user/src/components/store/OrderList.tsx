import React from 'react'
import { StyleSheet, ScrollView, useWindowDimensions, View, Text, Image } from 'react-native'
import HorizonLine from "../../../src/utils/store/HorizontalLine";
import moment from 'moment'

interface Order {
  order_pk: string | undefined
  user_pk: number | undefined
  storeName: string | undefined
  storeAddress: string | undefined
  orderedAt: string | undefined
  storeImageUrl: string | undefined
}

const OrderList : React.FC<Order> = (Order) => {

  const formatDate = (dateString : string | undefined) => {
    return moment(dateString).format('YYYY-MM-DD'); // 'YYYY-MM-DD' 형식으로 변환
  };
  
  return (
    <><View style={styles.home}>
      <View style={styles.box}>
        <Text style={{ fontSize: 14 }}>{formatDate(Order.orderedAt)}</Text>
        <Image source={{ uri: Order.storeImageUrl || '../../../assets/Must.jpg'}} style={{ width: 100, height: 100, marginTop: 10 }}></Image>
      </View>
      <View style={{ marginTop: 35, marginLeft: 30 }}>
        <Text style={{ fontSize: 20 }}>{Order.storeName}</Text>
        <Text style={{ fontSize: 18 }}>{Order.storeAddress}</Text>
      </View>
    </View><HorizonLine /></>
    )
}

const styles= StyleSheet.create({
home: {width:'100%', display:'flex', flexDirection:'row', marginTop:20, marginBottom:20},
container: {flex: 1, display: 'flex'},
box: {flexBasis: '20%', marginLeft: 25},
})

export default OrderList