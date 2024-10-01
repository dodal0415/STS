import axios from 'axios';
import react, { useEffect, useState } from 'react'
import { TouchableOpacity, View, Text, StyleSheet, useWindowDimensions, Image, Platform } from 'react-native'
import { MD2Colors as Colors} from 'react-native-paper';

interface A1Props {
  cartData: cartItems;
  cartPK: number;
  cartItemId: number;
}
interface ShoppingCarts {
  cart_pk: number;
  store_pk : number;
  store_name: string;
  tableNum: string;
  cartTotalPrice : number;
  cartItem : cartItems[]
}
interface cartItems {
  cart_item_pk : number;
  menu_pk : number;
  menu_name : string;
  menuCount : number;
  totalPrice : number;
  imageURL : string;
  optionItemList : string;
}

const ShoppingCart : React.FC<A1Props> = ({ cartData, cartPK, cartItemId})  => {

  const isMember = Platform.OS !== 'web';

  const apiClient = axios.create({
    baseURL: 'http://192.168.30.10:8080',
  });

  const [currentNumber, setCurrentNumber] = useState(cartData.menuCount);

  useEffect(() => {
  }, [currentNumber]);

    // -버튼 클릭 시 1숫자가 1보다 크면 -1, 1이면 장바구니에서 삭제
    const handleDecrement = (cartPK: Number, cartItemId: Number) => {
      const newNumber = currentNumber - 1
      if(isMember) {
        if (currentNumber > 1) {
          setCurrentNumber(newNumber)
          updateData(newNumber)
          apiClient.patch(`/api/cart/user/${cartPK}/cartItem/${cartItemId}`, {menuCount : currentNumber})
          console.log('장바구니 수량 - data user', currentNumber)
      } else if (currentNumber === 1) {
        apiClient.delete(`/api/cart/user/${cartPK}/cartItem/${cartItemId}`)
        console.log('장바구니 아이템 삭제 user')
      } } else {
        if (currentNumber > 1) {
          setCurrentNumber(newNumber)
          updateData(newNumber)
          apiClient.patch(`/api/cart/nonuser/${cartPK}/cartItem/${cartItemId}`, {menuCount : currentNumber})
          console.log('장바구니 수량 - data non', currentNumber)
      } else if (currentNumber === 1) {
        apiClient.delete(`/api/cart/nonuser/${cartPK}/cartItem/${cartItemId}`)
        console.log('장바구니 아이템 삭제 non')
    } 
      }
    }

    // +버튼 클릭 시 숫자 +1
    const handleIncrement = async (cartPK: Number, cartItemId: Number) => {
      const newNumber = currentNumber + 1
      if(isMember) {
        setCurrentNumber(newNumber)
        const res = await apiClient.patch (`/api/cart/user/${cartPK}/cartItem/${cartItemId}`, {menuCount : newNumber})
        console.log(res.data)
        console.log('장바구니 수량 + data: user', newNumber)
      } else if(!isMember) {
        try {
          setCurrentNumber(newNumber)
          const res = await apiClient.patch (`/api/cart/nonuser/${cartPK}/cartItem/${cartItemId}`, {menuCount : newNumber})
          console.log('cartPK : ?', cartPK)
          console.log('cartItemId : ?', cartItemId)
          console.log(res.data)
          console.log('장바구니 수량 + data: non', newNumber)
        } catch(e) {
          console.log('수량 더하기 에러', e)
          console.log('cartPK : ?', cartPK)
          console.log('cartItemId : ?', cartItemId)
          console.log('newNumber : ?', newNumber)
        }
      }
    }

return (
  <View>
    <View style={[styles.box_big, styles.border, { flex: 1, borderRadius: 20, flexDirection: 'row' }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.text_large]}>{cartData.menu_name}</Text> 
        <Text style={[styles.text_medium, { marginTop: 20 }]}>{cartData.optionItemList}</Text>
        <Text style={[styles.text_medium, { marginTop: 20 }]}>{cartData.totalPrice}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View key={cartData.cart_item_pk} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 190, marginRight: 10 }}>
          <Image
            source={{ uri: cartData.imageURL }}  // 불러온 메뉴 이미지 URL 넣어야 함.
            alt={cartData.menu_name}  // 메뉴 이름으로 대체
            style={{ width: 200, height: 90, justifyContent: 'center' }}
          />
          <View style={[styles.small_box, styles.border, { borderRadius: 20, flexDirection: 'row', alignItems: 'center', width: 200, marginRight: 20 }]}>
            <TouchableOpacity onPress={() => handleDecrement(cartPK, cartData.cart_item_pk)} style={{ alignItems: 'center', width: 40 }}>
              <Image 
                source={
                  cartData.menuCount === 1
                    ? require('../../../assets/trash.png') // 장바구니 수량이 1이면 삭제 이미지
                    : require('../../../assets/minus.png') // 장바구니 수량이 2이상이면 - 이미지
                } 
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, flex: 1, textAlign: 'center' }}>{cartData.menuCount}</Text>
            <TouchableOpacity onPress={() => handleIncrement(cartPK, cartData.cart_item_pk)} style={{ alignItems: 'center', width: 40 }}>
              <Image 
                source={require('../../../assets/plus.png')} // + 이미지
                style={{ width: 24, height: 24 }} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
    box_big: {backgroundColor: Colors.grey50, marginBottom: 10, margin: 10, marginLeft: 10, padding: 20},
    box_small: {backgroundColor: Colors.grey50},
    border: {borderWidth: 10, borderColor: Colors.grey400},
    text_small: {fontSize: 20, color:Colors.grey900},
    text_medium: {fontSize: 20, color:Colors.grey900},
    text_large: {fontSize: 30, color:Colors.grey900},
    button: {backgroundColor:Colors.grey300},
    text: {color:Colors.black},
    small_box: {height: 80, backgroundColor: Colors.grey50, margin:10, padding: 20}
    })

export default ShoppingCart;
