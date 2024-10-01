import { useRouter } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import {FlatList, Image, StyleSheet, useWindowDimensions, View, SafeAreaView, Text, TouchableOpacity} from "react-native";
import HorizonLine from "../../utils/store/HorizontalLine";
import {MD2Colors as Colors} from 'react-native-paper'
import axios from "axios";

// 아래는 MainPage가 더 어울리는듯
// export const bestMenuList: React.FC<InputDateProps> = ({ inputData }) => {
// export const bestMenuList: React.FC<InputDateProps> = ({ inputData }) => {

const apiClient = axios.create({
  baseURL: 'http://192.168.30.10:8080',
});

interface menuOptions {
  categry_pk: number
  subject : string,
  menu_pk : number,
  name: string,
  price: number,
  description: string,
  imageUrl: string,
  isBestMenu: boolean,
  isAlcohol: boolean,
  options: options[]
}

interface options {
  menu_option_pk : number
  opSubject: string,
  minCount: number,
  maxCount: number,
  optionItem: optionItem[]
  }

interface optionItem {
  option_item_pk: number
  name: string
  extraPrice: number
  isChecked: boolean
}

  function BestMenuList(BM : { menu_pk : number, imageURL: string, name: string, price: number}) {
  const { height, width } = useWindowDimensions();

  console.log('BestMenuComponent:', BM.menu_pk)
 
  // 넘겨받은 data meniOptions에 저장
  const [menuOptions, setMenuOptions] = useState<menuOptions | null>(null)

  // 넘겨받은 data 중 options값만 저장
  const [menuOpt, setMenuOpt] = useState<options | null>(null)

  // 넘겨받은 data 중 options값의 option을 저장
  const [menuOpt_detail, setMenuOpt_detail] = useState<optionItem | null>(null)

  const requestMenuOption = async (menu_pk: number) => {
    try {
      console.log('menu_pk:', {menu_pk})
      const res = await apiClient.get<menuOptions>(`/api/menu/${menu_pk}/menu`)
      setMenuOptions(res.data)
    } catch(e) {
      console.log("메뉴 옵션 불러오기 실패")
    }
  }

  // const { storepk } = inputData;


  //storepk랑 menupk로 해당 메뉴 및 옵션 data 받아와야 함. 현재 테스트용
  //현재 여긴 대표메뉴 Component임. 따라서 옵션이고 뭐고 필요 없이 사진, 이름, 가격만 받아와서 화면에 뿌리면 된다.
  
  return (
      <View style={[styles.box_big, styles.border, {borderRadius: 20, flexDirection:'row', width:300, marginHorizontal: 10}]}>
      <View>
        <Image source={{uri : BM.imageURL}} style={{width: 240, height:100, marginBottom:10}}></Image>
        <HorizonLine />        
        <Text style={{fontSize:18}}>{BM.name}</Text>
        <Text style={{fontSize:16}}>{BM.price}</Text>
      </View>
      </View>
  )
}
const styles=StyleSheet.create({
  box_big: {backgroundColor: Colors.grey50, margin: 20, marginLeft: 10, padding: 20},
  border: {borderWidth: 10, borderColor: Colors.grey400},
})
export default BestMenuList;