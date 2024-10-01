import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from "react-native";
import HorizonLine from "../../../../../../../src/utils/store/HorizontalLine";
import {Button, MD2Colors as Colors} from 'react-native-paper'
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import ShoppingCart from "../../../../../../../src/components/store/shoppingCart";
import MenuItem from "react-native-paper/lib/typescript/components/Menu/MenuItem";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface ShoppingCarts {
  cart_pk: number,
  store_pk : number,
  store_name: string,
  tableNum: string,
  cartTotalPrice : number,
  cartItem : cartItems[]
}

interface cartItems {
  cart_item_pk : number
  menu_pk : number
  menu_name : string,
  menuCount : number,
  totalPrice : number,
  imageURL : string,
  optionItemList : string
}

const myShoppingCart = () => {

  const isMember = Platform.OS !== 'web';

  const router = useRouter();

  const apiClient = axios.create({
    baseURL: 'http://192.168.30.10:8080',
  });

  const { height, width } = useWindowDimensions();

  const param = useGlobalSearchParams();

  console.log(param)

  const cartPK = param.cartid ? Number(param.cartid) : 0

  const {storeid, tableid} = useLocalSearchParams();

  const userPk = null
  const cart_pk = cartPK
  const store_pk = storeid

  const handleEnter = () => {
    router.push(`/store/${param.storeid}/table/${param.tableid}/payments?userPk=${userPk}&cart_pk=${cartPK}&amount=${cartItems?.cartTotalPrice}`)
  }
  // 총 가격은 amount로 줘야 함. 
  // userPk = null(비회원) / number(회원)

  const [cartItems, setCartItems] = useState<ShoppingCarts>()

    const requestCart = async (cartPK: number) => {
    try {
      if(isMember) {
        const res = await apiClient.get(`/api/cart/user/${cartPK}`)
        console.log('장바구니 데이터1? : ', res.data)
        setCartItems(res.data)
        console.log('장바구니 데이터2? :', res.data)
      } else {
        const res = await apiClient.get(`/api/cart/nonuser/51`)
        console.log('장바구니 데이터1? : ', res.data)
        setCartItems(res.data)
        console.log('장바구니 데이터1? : ', res.data)
      }
    } catch(e) {
      console.log('장바구니 불러오기 실패')
    }
  }

  useEffect(() => {
    requestCart(cartPK)
    console.log('useEffec : ', cartPK)
  }, [cartPK]);

  console.log('cartItems?: ', cartItems)

return (
  <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{backgroundColor: '#F2F2F2',  alignItems:'center'}}>
      <View style={{backgroundColor: '#FFFFFF', width: width >= 786 ? 786 : width}}>
        <Text style={{fontSize: 40, textAlign:'center', margin: 10}}>{cartItems?.store_name}</Text>
      {cartItems?.cartItem.map(Menu => <ShoppingCart key={Menu.cart_item_pk} cartData={Menu} cartPK={cartPK} cartItemId={Menu.cart_item_pk}/>)}
    <Button style={[styles.button]} onPress={() => handleEnter()}>
      <Text style={[styles.text]}>{cartItems?.cartTotalPrice}원 결제하기</Text>
    </Button>
    </View>
    </View>
  </ScrollView>
  )
}

const styles = StyleSheet.create({
    box_big: {width: '100%', height: '70%', backgroundColor: Colors.grey50, marginBottom: 10, margin: 10, marginLeft: 10, padding: 20},
    box_small: {width: '10%', height: '40%', backgroundColor: Colors.grey50, marginBottom: 10, margin: 10, marginLeft: 10, padding: 20, justifyContent: 'space-around',
    position: 'absolute', top: 70, right: 10},
    border: {borderWidth: 10, borderColor: Colors.grey400},
    text_small: {fontSize: 10, color:Colors.grey900},
    text_medium: {fontSize: 20, color:Colors.grey900},
    text_large: {fontSize: 30, color:Colors.grey900},
    button: {backgroundColor:Colors.grey300},
    text: {color:Colors.black, margin:10}
})

export default myShoppingCart