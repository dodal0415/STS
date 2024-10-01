import { useGlobalSearchParams, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Button, useWindowDimensions, ScrollView, Image, Platform} from 'react-native'
import './index.css'
// import HorizonLine from "../../../src//utils/store/HorizontalLine";
import { Checkbox } from 'react-native-paper';
// import OptionList from '../../../src/components/store/OptionList';
import {MD2Colors as Colors } from 'react-native-paper'
import { isRunningInExpoGo } from 'expo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getGlobalMenuPk, getGlobalStorePk, getGlobalUserPk} from "./global";
import HorizonLine from '../../../../../../../src/utils/store/HorizontalLine';
import OptionList from '../../../../../../../src/components/store/OptionList';
import MenuItem from 'react-native-paper/lib/typescript/components/Menu/MenuItem';

interface menuOptions {
    categry_pk: number
    subject : string,
    menu_pk : number,
    name: string,
    price: number,
    description: string,
    imageURL: string,
    isBestMenu: boolean,
    isAlcohol: boolean,
    options: options[]
}

interface options {
    menu_option_pk : number
    opSubject: string,
    minCount: number,
    maxCount: number,
    optionItems: optionItem[]
    }

interface optionItem {
    option_item_pk: number
    name: string
    extraPrice: number
    // isChecked : boolean
}

const MenuOptions = () => {

  const router = useRouter();

  const param = useGlobalSearchParams();
  const param2 = useLocalSearchParams();

  const menupk = param.menuid ? Number(param.menuid) : 0  

  const store_pk = param.storeid ? Number(param.storeid) : 0

  const [menuOpts, setMenuOpts] = useState<menuOptions | null>(null);
  const [optStates, setOptStates] = useState<Record<number, Set<number>>>({});

  useEffect(() => {
    if (menupk) {
      const requestMenuOption = async () => {
        try {
          const response = await apiClient.get(`/api/menu/${menupk}/menu`);
          const menuOptionsData = response.data;
          setMenuOptions(menuOptionsData);
        } catch (e) {
          console.log('옵션을 불러오는 것을 실패했습니다!', e);
        }
      };
      requestMenuOption();
    }
  }, [menupk]);

  const tableNumber = param.tableid ? Number(param.tableid) : 0

  const apiClient = axios.create({
    baseURL: 'http://192.168.30.10:8080',
  });

  const calculateTotalPrice = (menuOptions: menuOptions): number => {
    let totalPrice = 0

    menuOptions.options.forEach(option => {
      const selectedOptionsPrice = Array.from(optStates[option.menu_option_pk] || [])
        .reduce((acc, item) => {
          const selectedItem = option.optionItems.find(opt => opt.option_item_pk === item);
          return selectedItem ? acc + selectedItem.extraPrice : acc;
        }, 0);

      totalPrice += selectedOptionsPrice;
    });

    return totalPrice;
  };

  const calculatelectedOptions = (menuOptions: menuOptions): string => {
    let selectedNames: string[] = [];
  
    // 각 옵션에서 선택된 option_item의 이름을 추출
    menuOptions.options.forEach(option => {
      const selectedOptions = Array.from(optStates[option.menu_option_pk] || []);
      
      // 선택된 option_item의 이름 추가
      selectedNames = [
        ...selectedNames,
        ...option.optionItems
          .filter(item => selectedOptions.includes(item.option_item_pk))
          .map(item => item.name)
      ];
    });
  
    // 선택된 옵션 이름을 문자열로 변환 (name1, name2, name3 형식)
    const selectedOptionNames = selectedNames.join(', ');
  
    return selectedOptionNames;
  };

  const isMember = Platform.OS !== 'web';

  // 넘겨받은 data meniOptions에 저장
  const [menuOptions, setMenuOptions] = useState<menuOptions>()

  // 넘겨받은 data 중 options값만 저장
  const [menuOpt, setMenuOpt] = useState<options[] | null>(null)

  // 넘겨받은 data 중 options값의 option을 저장
  const [menuOpt_detail, setMenuOpt_detail] = useState<optionItem | null>(null)

  // 메뉴 옵션 불러와라
  const requestMenuOption = async (menu_pk: number) => {
    try {
      const res1 = await apiClient.get<menuOptions>(`/api/menu/${param2.menuid}/menu`)
      console.log('menuoptionsData:', res1.data)
      setMenuOptions(res1.data)
      setMenuOpt(res1.data.options)
      }
    catch(e) {
      console.log("메뉴 옵션 불러오기 실패")
    }
  }

  useEffect(() => {
    const menu_pk = getGlobalMenuPk();
    requestMenuOption(menu_pk)
  }, [menupk])

  const { height, width } = useWindowDimensions();

  const [cartPk, setCartPk] = useState<number | null>(null);

  // 장바구니 추가
  const addCartItem = async () => {
          try {
            const totalPrice = calculateTotalPrice(menuOptions!);
            const optionItemList = calculatelectedOptions(menuOptions!);
            if (!isMember) {
              const cartPk = await AsyncStorage.getItem('cart_pk')
              console.log('cartPK : ', cartPk)
              if (cartPk) {
                console.log('장바구니 어디서 에러나는지 모르겠다 1')
                console.log('store_pk:', {store_pk} + 'menu_pk :', {menupk} + 'tableNumber:', {tableNumber} + 'totalExtraPrice:', {totalPrice} + 'optionItemList :', {optionItemList})
                await apiClient.post(`/api/cart/nonuser/${cartPk}`, {store_pk: store_pk, menu_pk : menupk, tableNumber: tableNumber, optionItemList : optionItemList, totalExtraPrice: totalPrice});
                console.log('비회원 장바구니 메뉴 추가 완료1');
              } else {
                console.log('장바구니 어디서 에러나는지 모르겠다 2')
                await createNonMemberCart();
                console.log('장바구니 어디서 에러나는지 모르겠다 3')
                const cartPk = await AsyncStorage.getItem('cart_pk')
                console.log('비회원 장바구니 생성');

                await apiClient.post(`/api/cart/nonuser/${cartPk}`, {store_pk: store_pk, menu_pk : menupk, tableNumber: tableNumber, optionItemList : optionItemList, totalExtraPrice: totalPrice});
                console.log('비회원 장바구니 물품 추가 성공2');
                console.log('storePk : ', store_pk, 'menuPk : ', menupk, '테이블넘버 : ', tableNumber, '총 가격 : ', totalPrice, '옵션아이템리스트 : ', optionItemList)
                } 
                // 장바구니 제대로 돌아가면 아래 주석처리 풀기
                // router.push(`store/${param.storeid}`)
              } else {
                await getMemberCart()
                console.log('회원 장바구니 조회 완료3')
                await apiClient.post(`/api/cart/user/${cartPk}`, {store_pk: store_pk, menu_pk : menupk, tableNumber: tableNumber, optionItemList : optionItemList, totalExtraPrice: totalPrice})
                console.log('store_pk:', {store_pk} + 'menu_pk :', {menupk} + 'tableNumber:', {tableNumber} + 'totalExtraPrice:', {calculateTotalPrice} + 'optionItemList :', {calculatelectedOptions})
                console.log('회원 장바구니 메뉴 추가 완료4')
            }
          } catch (error) {
            console.error('장바구니 메뉴 추가 실패5:', error);
          }
        };

  // 비회원 장바구니 생성
  const createNonMemberCart = async () => {
    try {
      const response = await apiClient.post('/api/cart/nonuser');
      console.log(response.data)
      const cart_pk = response.data.cart_pk
      if(cart_pk) {
        await AsyncStorage.setItem('cart_pk', String(cart_pk))
        console.log('cart_pk 생성 : ', cart_pk);
      setCartPk(cart_pk);  // 상태 업데이트
    } else {
      console.error('cart_pk가 null입니다.');
    } } catch (e) {
      console.error('비회원 장바구니 생성 실패:', e);
    }
  };

  // 비회원 장바구니 조회
  const getNonMemberCart = async () => {
    try {
      const storedCartPk = await AsyncStorage.getItem('cart_pk');
      if (storedCartPk) {
        const response = await apiClient.get(`/api/cart/nonuser/${cartPk}`);
        console.log('비회원 장바구니 메뉴:', response.data);
      } else {
        createNonMemberCart();
      }
    } catch (error) {
      console.error('비회원 장바구니 조회 실패:', error);
    }
  };

  // 회원 장바구니 조회
  const getMemberCart = async () => {
    try {
      const response = await apiClient.get('/api/cart/user')
      setCartPk(response.data.cart_pk)
      console.log('회원 장바구니 조회:', response.data)
    } catch (error) {
      console.error('회원 장바구니 조회 실패:', error)
    }
  }

  const [menu_count, setMenu_count] = useState(1);

  const handleDecrement = () => {
    if (menu_count > 1) {
      setMenu_count(menu_count - 1);
    } 
  };

  // +버튼 클릭 시 숫자 +1
  const handleIncrement = () => {
    setMenu_count(menu_count + 1);
  };

  console.log("현재 선택된 옵션 상태:", optStates);

  const handleCheck = (option_pk: number, option_item_pk: number) => {
    console.log('메뉴옵션pk : ', option_pk, '옵션아이템pk : ', option_item_pk)
    setOptStates(prevState => {
      const currentOptionState = prevState[option_pk] || new Set<number>();
      if (currentOptionState.has(option_item_pk)) {
        // 체크 해제
        currentOptionState.delete(option_item_pk);
      } else {
        // 체크
        const option = menuOptions?.options.find(opt => opt.menu_option_pk === option_pk);
        if (option) {
          if(currentOptionState.size < option.maxCount) {
            currentOptionState.add(option_item_pk);
          }
        }
      }
      return {
        ...prevState,
        [option_pk]: currentOptionState
      };
    });
  };

  const isChecked = (option_pk: number, option_item_pk: number) => {
  const currentOptionState = optStates[option_pk] || new Set<number>();
  const option = menuOptions?.options.find(opt => opt.menu_option_pk === option_pk);

    if (option) {
      const itemChecked = currentOptionState.has(option_item_pk);
      const minReached = currentOptionState.size >= option.minCount; // minCount 충족 여부
      const maxReached = currentOptionState.size >= option.maxCount; // maxCount 초과 여부
      return itemChecked && (minReached || !maxReached);
    }
  
    return false;
  };
  //   return optStates[menu_option_pk]?.has(option_item_pk) || false;
  // };
  
  useEffect(() => {
    if (menuOpt !== null) {
      console.log('menuOpt : ', menuOpt);
    }
  }, [menuOpt]);

  //메뉴 옵션 체크
  const [add, SetAdd] = useState(false);
  
    return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{backgroundColor: '#F2F2F2', flex: 1, alignItems:'center'}}>
        <View style={{backgroundColor: '#FFFFFF', width: width >= 786 ? 786 : width}}>
            <View style={{ width: '100%'}}>
                <Image source={{uri : menuOptions?.imageURL}} style={{width:'100%', height:300}} resizeMode = 'cover'/>
            </View>
            <View style={{marginLeft:10, marginTop: 30}}>
                <Text style={{fontSize: 20, fontWeight:'bold'}}>{menuOptions?.name}</Text>
                <Text style={{fontSize: 18, marginTop:5}}>{menuOptions?.price}원</Text>
                <View style={{flexDirection: 'row', alignItems:'center', marginTop: 30, marginBottom: 30}}>
                  <Text style={{fontSize: 18, marginLeft:10}}>수량</Text> 
                  <TouchableOpacity onPress={handleDecrement} disabled={menu_count===1} style={{alignItems: 'flex-end', marginLeft:'auto', marginRight:30}}>
                    <Image source={ 
                      menu_count === 1 
                      ? require('../../../../../../../assets/trash.png') // 장바구니 수량이 1이면 삭제 이미지
                      : require('../../../../../../../assets/minus.png') // 장바구니 수량이 2이상이면, 정확히는 1이 아니면 - 이미지
                      }
                    style={{width:20, height:20}}/>
                  </TouchableOpacity>
                  <Text style={{alignItems: 'flex-end', marginRight:30}}>{menu_count}개</Text>
                  <TouchableOpacity onPress={handleIncrement} style={{alignItems: 'flex-end', marginRight:50}}>
                    <Image source= {require('../../../../../../../assets/plus.png')}
                    style={{width:20, height:20}}/>
                  </TouchableOpacity>
                </View>
            </View>
            <HorizonLine/>
            <View style={{ marginTop: 10 }}>
            {menuOpt?.map(option => (
              <View key={option.menu_option_pk}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft:10, marginTop: 20 }}>{option.opSubject}</Text>
                    <Image
                    source={
                      option.minCount > 0
                      ? require('../../../../../../../assets/Must.png')
                      : require('../../../../../../../assets/NMust.png')
                    }
                      style={{ width: 20, height: 20, marginLeft: 10, marginTop: 20 }}
                    />
                </View>
                {option.optionItems && option.optionItems.length > 0 ? (
                option.optionItems.map(opt => (
                <OptionList
                  key={opt.option_item_pk}
                  menu_pk={opt.option_item_pk}
                  minCount={option.minCount}
                  maxCount={option.maxCount}
                  subjectName={opt.name}
                  subjectPrice={opt.extraPrice}
                  onCheck={() => handleCheck(option.menu_option_pk, opt.option_item_pk)}
                  isChecked={isChecked(option.menu_option_pk, opt.option_item_pk)}
                />
              ))
            ) : (
              <Text style={{marginLeft: 10}}>옵션 항목이 없습니다.</Text>
            )} 
            <HorizonLine />
          </View>
            ))}
            <TouchableOpacity onPress={addCartItem} style={{ backgroundColor: Colors.grey300, paddingVertical: 15, marginTop: 50 }}>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>장바구니에 담기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default MenuOptions;

