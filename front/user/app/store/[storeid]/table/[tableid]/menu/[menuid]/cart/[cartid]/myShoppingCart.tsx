import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from "react-native";
import HorizonLine from "../../../../../../../../../src/utils/store/HorizontalLine";
import {Button, MD2Colors as Colors} from 'react-native-paper'
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import ShoppingCart from "../../../../../../../../../src/components/store/shoppingCart";
import MenuItem from "react-native-paper/lib/typescript/components/Menu/MenuItem";
import axios from "axios";

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

function myShoppingCart() {

  const isMember = Platform.OS !== 'web';

  const router = useRouter();

  // const cartPk = getGlobalCartPk
  
  const [cartPk, setCartPk] = useState<number>(0)
  const [userPk, setUserPk] = useState<number>(0)

  const apiClient = axios.create({
    baseURL: 'http://192.168.30.10:8080',
  });

  const { height, width } = useWindowDimensions();

  const param = useGlobalSearchParams();

  const [Number, setNumber] = useState(1);

  const {storeid, tableid} = useLocalSearchParams();

  const [numColumns, setNumColumns] = useState<number>(1)
  useEffect(() => {
    if (width >= 768) {
      setNumColumns(2)
    } else {
      setNumColumns(1)
    }
  }, [width])

  const handleEnter = (userPk: number | null, cartPk: number, storeid : any) => {
    router.push(`/store/${param.storeid}/table/${param.tableid}/menu/${param.menuid}/cart/${param.cartid}/payments`)
  }
  // 총 가격은 amount로 줘야 함. 
  // userPk = null(비회원) / number(회원)

  const [cartItems, setCartItems] = useState<ShoppingCarts>()

  const requestCart = async (cartPk: number) => {
    try {
      if(isMember) {
      const res = await apiClient.get(`/api/cart/user/${cartPk}`)
      setCartItems(res.data)
      console.log('회원 장바구니 불러오기 성공')
    } else {
      const res = await apiClient.get(`/api/cart/nonuser/${cartPk}`)
      setCartItems(res.data)
      console.log('비회원 장바구니 불러오기 성공')
    } } catch(e) {
      console.log('장바구니 불러오기 실패')
    }
  }

  useEffect(() => {
    () => requestCart(cartPk)
  }, [cartPk]);

return (
  <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{backgroundColor: '#F2F2F2',  alignItems:'center'}}>
      <View style={{backgroundColor: '#FFFFFF', width: width >= 786 ? 786 : width}}>
        <Text style={{fontSize: 40, textAlign:'center', margin: 10}}>{cartItems?.store_name}</Text>
      {cartItems?.cartItem.map(Menu => <ShoppingCart key={cartItems.cart_pk} cartData={cartItems} cartPk={cartItems.cart_pk} cartItemId={Menu.cart_item_pk}/>)}
    <Button style={[styles.button]} onPress={() => handleEnter(userPk, cartPk, storeid)}>
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

export default myShoppingCart;
