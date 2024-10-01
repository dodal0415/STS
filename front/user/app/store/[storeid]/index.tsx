import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, FlatList, Image, View, Animated, Button, Linking, useWindowDimensions, ScrollView, TouchableOpacity, Text, SafeAreaView, TextInput } from 'react-native'
import HorizonLine from "../../../src/utils/store/HorizontalLine";
import { MD2Colors as Colors, IconButton } from "react-native-paper";
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import RepresentativeMenu, { RepresentativeMenuHandle } from "../../../src/components/store/RepresentativeMenu";
import BestMenuList from "../../../src/components/store/BestMenuList";
import Swiper from 'react-native-swiper'
import { Alert } from "react-native";
import { InteractionManager } from "react-native";
import Modal from '../../../src/components/store/Modal'
import { Platform } from "react-native";
import Timer from "../../../src/components/store/Timer";
import useCountDownTimer from "../../../src/components/store/Timer";
import dayjs from 'dayjs';
import axios from 'axios'
import MenuItem from "react-native-paper/lib/typescript/components/Menu/MenuItem";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MenusItem {
  category_pk : number
  menu_pk : number
  name : string
  price : number
  description : string
  imageURL : string
  isBestMenu : boolean
  isAlcohol : boolean
  menuOptionData : menuOptions[]
}


//가게 메뉴 Data
interface storeMenuData {
  category_pk : number
  subject : string
  menu_pk : number
  name : string
  price : number
  description : string
  imageURL : string
  isBestMenu : boolean
  isAlcohol : boolean
  menuOptionData : menuOptions[]
}

// 선택한 메뉴 옵션 Data
interface menuOptions {
  name : string
	price : number
	description : String
	imageUrl : String
	isBestMenu : Boolean
	isAlcohol : Boolean
}

interface MenuCategory {
  subject: string;
  Menus: MenusItem[];
}

interface storeInfomation {
store_pk : number
owner : number
storeName : string,
address : string,
phone : string,
storeImages : string[]
}

interface store {
  address: string
  createdAt: string
  deletedAt: string | null
  distance: number | null
  isOpen: boolean
  lat: number | null
  lng: number | null
  operatingHours: string | null
  ownerPk: number
  phone: string | null
  storeImages: string[]
  storeName: string | null
  storePk: number
  storeState: string | null
}

interface storeInfomation {
  categoryPks: number[]
  store: store
}

const Main = () => {

    //클릭 시 이동
    const param = useGlobalSearchParams();
    const router = useRouter();

  const {storeid, tableid} = useLocalSearchParams();
  

  const storePk = param.storeid

      // 서버 ip주소를 baseURL로 설정.
      const apiClient = axios.create({
        baseURL: 'http://192.168.30.10:8080',
      });

      // 가게 정보 담을 변수
      const [storeInfo, setStoreInfo] = useState<storeInfomation | null>(null)
      // 가게 이미지 담을 변수
      const [storeImageInfo, setStoreImageInfo] = useState<string[]>([])

      // 일단 store_pk 받았다 생각하고 진행.
      const requestStoreInfo = async () => {
        try {
          const res = await apiClient.get<storeInfomation>(`/api/store/38/menu`)
          setStoreInfo(res.data)
          setStoreImageInfo(res.data.storeImages)
        } catch(e) {
          console.log('가게 정보 요청 실패!')
        }
      }

      // 메뉴 옵션 요청(대표메뉴)
      const requestMenuOption1 = async (menu_pk: number) => {
        try {
          const response = await apiClient.get(`/api/menu/${menu_pk}/menu`)
          console.log({menu_pk})
          const menuOptionsData = response.data;
          setBestMenus(menuOptionsData)
          console.log(response.data)
          console.log('param.storeid :', {storeid})
          console.log('param.menuid :', {menu_pk})
          router.push(`store/${param.storeid}/table/1/menu/${menu_pk}`)
        } catch(e) {
          console.log('옵션을 불러오는 것을 실패했습니다!')
        }
      };

      // 메뉴 옵션 요청(전체메뉴)
      const requestMenuOption2 = async (menu_pk: number) => {
        try {
          const res = await apiClient.get(`/api/menu/${menu_pk}/menu`)
          const menuOptionsData = res.data
          setBaseMenus(menuOptionsData)
          router.push(`store/${param.storeid}/table/1/menu/${menu_pk}`)
        } catch(e) {
          console.log('옵션을 불러오는 것을 실패했습니다!')
        }
      };

      //전화번호 인증 요청
      const requestPhoneAuth = async () => {
        try {
          await apiClient.post(`/api/sms/send`, {phoneNum:textNum})
          console.log(textNum)
        } catch(e) {
          console.log("전화번호 인증 요청 실패") 
        }
      }

      //전화번호 인증 요청
        const userPhoneAuth = async () => {
          try {
            await apiClient.post(`/api/sms/verify?phoneNum=${textNum}&inputCode=${phoneNum2}`, {phoneNum:textNum, inputCode:phoneNum2})
            return true
          } catch(e) {
            console.log("전화번호 인증 실패") 
            return false
          }
        }

        //가게 메뉴 요청
        const RequestMenus = async () => {
          try {
            const res = await apiClient.get<storeMenuData[]>(`/api/store/38/menu`)
            const filteredBestMenus  = res.data.filter((item) => item.isBestMenu === true);
            setBestMenus(filteredBestMenus)
            const convertMenuArray = transformData(res.data)
            setBaseMenuArray(convertMenuArray)
            setBaseMenus(res.data)
          } catch(e) {
            console.log("메뉴 불러오기 실패") 
          }
        }

        //데이터 변경 옵션
        const transformData = (dataA: storeMenuData[]) => {
          return dataA.reduce((acc: MenuCategory[], current) => {

            // acc에서 current.Z 값이 있는지 찾는다.
            const existing = acc.find(item => item.subject === current.subject);

            if (existing) {
              // 이미 존재하면 해당 X 배열에 현재 항목의 나머지 데이터를 추가
              existing.Menus.push({
                category_pk: current.category_pk,
                description: current.description,
                imageURL: current.imageURL,
                isAlcohol: current.isAlcohol,
                isBestMenu: current.isBestMenu,
                menuOptionData: current.menuOptionData,
                menu_pk: current.menu_pk,
                name: current.name,
                price: current.price,
              });
            } else {
              // 존재하지 않으면 새로운 Z 값을 추가하고, X 배열에 현재 항목 추가
              acc.push({
                subject: current.subject,
                Menus: [{
                category_pk: current.category_pk,
                description: current.description,
                imageURL: current.imageURL,
                isAlcohol: current.isAlcohol,
                isBestMenu: current.isBestMenu,
                menuOptionData: current.menuOptionData,
                menu_pk: current.menu_pk,
                name: current.name,
                price: current.price,
              }]
                })
              };
              return acc;
            }, []) }

      useEffect(() => {
          RequestMenus(); // 첫 렌더링 시 실행
          requestStoreInfo()
        }, []); // 빈 배열을 의존성 배열로 넘기면 첫 렌더링 후에만 실행

  // useEffect(() => {
  //   console.log('Store Info:', storeInfo);
  //   console.log('Store Images1:', storeImageInfo);
  // }, [storeInfo]); // storeInfo가 업데이트될 때마다 로그를 출력

      // 기본 메뉴 배열에서 대표메뉴만 뽑아와서 저장할 변수 하나 더 추가.
      const [bestMenus, setBestMenus] = useState<storeMenuData[]>([]);

      // 전체 메뉴 데이터가 저장될 배열 하나 더 만들어야겠지?
      const [baseMenus, setBaseMenus] = useState<storeMenuData[]>([]);

      // 근데 백에서 내 생각이랑 다르게 보내줬으니 내 생각대로 배열할 배열 만들어야겠지?
      const [baseMenuArray, setBaseMenuArray] = useState<MenuCategory[]>([]);

      // 인증 확인 버튼 활성화/비활성화
      const [isButton1Active, setIsButton1Active] = useState(false);

      // 인증 완료 버튼 활성화/비활성화
      const [isButton2Active, setIsButton2Active] = useState(false);

      // 인증번호 인증하는 메소드(인증 완료랑은 다름. 인증완료는 db에 저장, 요건 인증만.), API 연결하면 밑에 쪽으로.
      const handleButton1Click = async () => {
        const isSuccess = await userPhoneAuth(); // userPhoneAuth 호출
        if (isSuccess) {
          setIsButton2Active(true); // 버튼 2 활성화
        } else {
          alert("전화번호 인증 요청이 실패했습니다."); // 에러 처리
        }
      };
    
      // 전화번호 인증 보내는 메소드.
      const handlePress = () => {
        if (textNum.length === 11) {
          requestPhoneAuth()
          setPhoneAuth(true);
          const newTargetTime = new Date(Date.now() + 5 * 60 * 1000); // 현재 시간 + 5분
          // const fiveMinutesLater = now.add(5, 'minute').toISOString();
          setTargetTime(newTargetTime.toISOString()); // ISO 형식으로 변환
          setIsButton1Active(true)
        } else {
          alert("입력한 전화번호가 11자리가 아닙니다!") } }

      // 전화번호 인증 완료 후 등록하기
      // userPk 값 수정하기
      const userPhoneReg = async () => {
        try {
          await apiClient.post(`/api/sms/register?userPk=5&phoneNum=${textNum}`, {userPk:5, phoneNum:textNum})
          handleReservation()
        } catch(e) {
          console.log("전화번호 인증 실패") 
        }
      }

      const [targetTime, setTargetTime] = useState('');

      // const [countDown, setCountDown] = useState('')
      
      const { remainingTime } = useCountDownTimer(targetTime);

      // 예약확인 버튼 클릭 시 전화번호 인증을 위한 Modal 창
      const [open, setOpen] = useState(false);

      // 전화번호 인증 시 숫자만 입력 가능하도록.
      const [textNum, setTextNum] = useState("");
      const [phoneNum2, setPhoneNum2] = useState("");

      // 전화번호 인증 시 숫자 제외 문자 입력하면 제거하도록
      const handleInputValue = (text: string) => {
        const validInputValue = text.replace(/[^0-9]/g, "");
        setTextNum(validInputValue)
      };

      const handleInputValue2 = (text: string) => {
        const validInputValue = text.replace(/[^0-9]/g, "");
        setPhoneNum2(validInputValue)
      };

      // 인증 버튼 누르면 인증번호 입력할 수 있는 텍스트창 보이게
      const [phoneAuth, setPhoneAuth] = useState(false)

      // 스크롤뷰 이동 코드
      // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

      const [categoryPositions, setCategoryPositions] = useState<{ [key: string]: number }>({});

      const handleCategoryClick = (categoryName: string) => {
        const yPosition = categoryPositions[categoryName];
        if (yPosition !== undefined) {
          InteractionManager.runAfterInteractions(() => {
            scrollRef.current?.scrollTo({ y: yPosition, animated: true });
          });
      }
    }

      const handleLayout = (categoryName: string) => (event: any) => {
        const { y } = event.nativeEvent.layout;
        setCategoryPositions((prev) => ({
          ...prev,
          [categoryName]: y,
        }));
      };

  const scrollRef = useRef<ScrollView | null>(null);

  const handleReservation = () => {
    router.push(`store/${param.storeid}`);
  };

  const handlePaymentRequest = () => {
    router.push(`store/${param.storeid}/table/1`);
  };

  
  //장바구니 클릭(tableNumber 1로 고정했음)
  const handleEnter = async () => {
    if(isWeb) {
      const cartPk = await AsyncStorage.getItem('cart_pk')
      apiClient.get(`api/cart/nonuser/${cartPk}`)
      router.push(`store/38/table/1/cart/51/myShoppingCart`);
    } else {
      const cartPk = await apiClient.get(`/api/cart/user`)
      apiClient.get(`api/cart/user/${cartPk}`)
      router.push(`store/${param.storeid}/table/1/cart/${cartPk}/myShoppingCart`);
    }
  };

  // 임시 user_pk 값 1 지정
  const user_pk = 1

  const listEnter = () => {
    // apiClient.get(`/api/order/simple/${user_pk}`, {user_pk : user_pk})
    router.push(`store/${param.storeid}/myOrderList`,);
  };
  const OptionEnter = () => {
    router.push(`store/${param.storeid}/menuOption`);
  };
  
  // 화면크기별 width, height 구하기
  const { height, width } = useWindowDimensions();

  //장바구니 위치 조정
  const getCartIconRightPosition = () => {
    if (Platform.OS === 'web') {
      return width > 1024 ? 600 : width > 786 ? 100 : 50;
    } else {
      return 20;
    }
  };

  // 앱에서 좀 이상해서;;
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true }); // y: 0 => 최상단으로 이동
    }
  };
  
  // const [autoplay, setAutoplay] = useState(false);

  // 예약 인원 설정할 때.
  const [RNoP, setRNoP] = useState(1)

  const [showResPer, setShowResPer] = useState(false);

    // db로 인원수를 전송하는 API 추가해야 함.
  useEffect(() => {
      if (showResPer) {
        console.log(`현재 인원수: ${RNoP}명`);
      }
    }, [RNoP, showResPer]);
  
  const handleResPerClick = () => {
    setShowResPer(!showResPer);
  }

  const handleDecrement = () => {
    RNoP > 1 && setRNoP(RNoP - 1);
  };

  // +버튼 클릭 시 숫자 +1
  const handleIncrement = () => {
    setRNoP(RNoP + 1);
  };

  //Platform별 Category 개수 차이에 따른 스크롤뷰 구현하기 위함
  const isWeb = Platform.OS === 'web';

  //웹일 때 & Category가 7개 이상일 때 || 웹 아닐 때 & Category가 4개 이상일 때 스크롤 가능하게
  const shouldScroll = (isWeb && baseMenuArray.length > 6) || (!isWeb && baseMenuArray.length > 3);

  //전화번호 인증 여부
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)


  // 전화번호 인증 연결 시 밑 완성해야 함
  const verifyPhoneNumber = async () => {
    try {
      // 전화번호 인증 API 호출 예시
      const response = await fetch('전화번호 인증 API 주소', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setIsPhoneVerified(true); // 인증 성공 시 상태 업데이트
        Alert.alert('전화번호 인증 성공');
      } else {
        Alert.alert('전화번호 인증 실패');
      }
    } catch (error) {
      Alert.alert('전화번호 인증 중 오류 발생');
    }
  };

  // 확인 API 호출
  const handleConfirmation = async () => {
    try {
      // 확인 API 호출 예시
      const response = await fetch('확인 API 주소', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        Alert.alert('확인 완료');
      } else {
        Alert.alert('확인 실패');
      }
    } catch (error) {
      Alert.alert('확인 중 오류 발생');
    }
  };

  // 버튼 클릭 시 처리 로직
  const handleButtonPress = async () => {
    if (!isPhoneVerified) {
      // 전화번호 인증이 안 되어 있으면 인증 API 호출
      await verifyPhoneNumber();
    }

    // 인증이 완료되면 확인 API 호출
    if (isPhoneVerified) {
      await handleConfirmation();
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1, 
    slidesToScroll: 1,
    speed: 500,
    autoplaySpeed: 500,
    cssEase: "linear"
  };

  const menuSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  }

  const styles = StyleSheet.create({
    box_big: {backgroundColor: Colors.grey50, marginBottom: 10, margin: 10, marginLeft: 10, padding: 20},
    box_small: {backgroundColor: Colors.grey50},
    border: {borderWidth: 10, borderColor: Colors.grey400},
    container: {flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 16},
    numberBox: {
      backgroundColor: '#000', 
      paddingHorizontal: 15,
      paddingVertical: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    counterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#000', 
      borderColor: '#000', 
      paddingHorizontal: 10,
    },
    counterText : {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    counterButton : {
      backgroundColor: '#000', // 검은색 배경
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    input: {
      height: 40,
      margin: 1,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      backgroundColor: "#FFFFFF",
    },
  })

  console.log('가게 이미지 뭐임', storeImageInfo)
  console.log('가게 이미지 뭐임', storeInfo)

  return (
    <SafeAreaView style={{flex: 1}}>
          {/* 장바구니 */}
    <View style={{position: 'absolute', bottom: 150, right: getCartIconRightPosition(),
      zIndex: open ? -1 : 100,
      display: open ? 'none' : 'flex'}}>
          <TouchableOpacity onPress={handleEnter}>
            <Image source={require('../../../assets/ShoCart.png')} style={{ width: 50, height: 50, borderRadius: 30 }} />
          </TouchableOpacity>
        </View>
    <ScrollView style={{flex: 1}} ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
    <View style={{backgroundColor: '#F2F2F2', flex: 1, alignItems:'center'}}>
      <View style={{backgroundColor: '#FFFFFF', width: width >= 786 ? 786 : '100%'}}>
      <View style={{ width: '100%', margin: 'auto' }}>
      {/* {storeInfo ? (
      <Swiper style={{width: '100%', height: 200}}
        horizontal={true}
        loop={true}
        autoplay={true}>
        {storeInfo.storeImages.map((imageUrl, index) => (
          <View key={index}>
            <Image source={{ uri: imageUrl }} style={{width: '100%', height: 200, resizeMode:'stretch'}}/>
          </View>
        ))}
      </Swiper> ) : (<Text>loading.....</Text>) } */}
      </View>
      <View>
      <Text style={{fontSize:30, margin: 10}}>{storeInfo?.storeName}</Text>
      <View style={{margin:10 }}>
        <ScrollView horizontal={shouldScroll} showsHorizontalScrollIndicator={false} style={{margin:10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
        {baseMenuArray.map((category) => (
          <TouchableOpacity key={category.subject} onPress={() => {
          handleCategoryClick(category.subject)}}>
            <Text style={{ fontSize: 25, marginHorizontal: 10 }}>
              {category.subject}</Text>
            </TouchableOpacity> ))}
            </View>
          </ScrollView>
        </View>
        <HorizonLine />
      </View>

        {/* 대표메뉴 불러오는 곳 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 10}}>
            <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'column'}}>
             <Text style={{fontSize: 20}}>대표 메뉴</Text>
              <View style={{flexDirection:'row'}}>
              {bestMenus.map((BM: { menu_pk: number; imageURL: string; name: string; price: number; }) =>
                ( <TouchableOpacity key={BM.menu_pk} onPress={() => requestMenuOption1(BM.menu_pk)}>
            <BestMenuList key={BM.menu_pk} menu_pk={BM.menu_pk} imageURL={BM.imageURL} name={BM.name} price={BM.price} />
            </TouchableOpacity>
             ))}
            </View>
            </View>
            </View>
          </ScrollView>
      <HorizonLine/>

      {/* 메뉴 리스트 불러올 곳 */}
        <View>
          <TouchableOpacity onPress={() => requestMenuOption2}>
            <RepresentativeMenu  inputData={baseMenuArray} onLayout={handleLayout}/>
          </TouchableOpacity>
        </View>
      {/* <View>
        <RepresentativeMenu inputData={RepresentativeMenuLists} onLayout={handleLayout}/>)}
      </View> */}

      {/* 예약 인원 */}
      <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
      {showResPer && <Text style={{fontSize:16, textAlign:'center'}}>인원수</Text>}
      <View style={[styles.counterContainer, {flexDirection:'row', borderColor:Colors.grey900, width:200, justifyContent:'space-between'}]}>
      {showResPer && (<TouchableOpacity onPress={handleDecrement} style={styles.counterButton}>
            <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>-</Text>
          </TouchableOpacity>)}
      {showResPer && (<View>
        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>{RNoP}</Text>
        </View> )}
      {showResPer && (<TouchableOpacity onPress={handleIncrement} style={styles.counterButton}>
            <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>+</Text>
          </TouchableOpacity>)}
      </View>
      {showResPer && (
        <TouchableOpacity style={{backgroundColor: Colors.red200, paddingHorizontal: 20, paddingVertical: 10}}>
          <Text onPress={() => setOpen(true)} style={{fontWeight:'bold'}}>확인</Text>
        </TouchableOpacity>
      )}
      </View>
        <View style={{width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          <TouchableOpacity onPress={() => Linking.openURL('tel:01021113308')} style={{flex: 1, backgroundColor:Colors.red300, borderColor:Colors.red200, height: 40}}>
            <Text style={{ justifyContent: 'center', textAlign:'center', paddingVertical: 10,}}>전화</Text>
          </TouchableOpacity> 
          <TouchableOpacity onPress={() => {handleResPerClick(); if(Platform.OS !== 'web') {scrollToTop()}}} style={{flex: 4, backgroundColor:Colors.grey200, borderColor:Colors.grey200}}>
            <Text style={{ justifyContent:'center', textAlign:'center', paddingVertical: 10,}}>{showResPer ? '예약 인원 설정 풀기' : '예약 인원 설정'}</Text>
          </TouchableOpacity> 
        </View>
      </View>
    </View>
    </ScrollView>
    <Modal isOpen={open} onClose={() => setOpen(false)}>
        <View style={{width: width * 0.8, height: height * 0.6, backgroundColor:Colors.grey500, padding: 10}}>
          <Text style={{fontSize: 20, margin: 10}}>전화번호 미인증 계정입니다.</Text>
          <Text style={{fontSize: 20, margin: 10}}>서비스 진행을 위해 전화번호를 인증해주세요!</Text>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', margin: 20, flexWrap:'wrap'}}>
          <TextInput
            style={[
              styles.input,
              { width: width >= 630 ? 215 : 150 },
            ]}
            id='PhoneNumber'
            value={textNum}
            onChangeText={handleInputValue}
            keyboardType="numeric"
            placeholder="전화번호를 입력해주세요"
            maxLength={11}
          />
          <View style={{ marginLeft: 10 }}>
            <Button title="인증번호 받기" onPress={handlePress}/>
          </View>
          <View style={{ marginLeft: 10, marginTop: Platform.OS === 'web' ? 0 : 20 }}>
              <Button title="전화번호 인증 취소하기" onPress={() => setOpen(false)}></Button>
          </View>
          </View>
          {phoneAuth && ( <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center', margin: 10}}>
              <Text style={{marginBottom: 20, fontSize: 30}}>남은 시간 : <Text style={{color:Colors.red900}}>{remainingTime}</Text>
              </Text>
              <View style={{flexDirection:'row'}}>
          <TextInput
            style={[
              styles.input,
              { width: width >= 440 ? 215 : 150 },
            ]}
            id='AuthNumber'
            value={phoneNum2}
            onChangeText={handleInputValue2}
            keyboardType="numeric"
            placeholder="인증번호를 입력해주세요"
            maxLength={4}
          />
          <View style={{ marginLeft: 10 }}>
            <Button title="인증번호 확인" onPress={handleButton1Click} disabled={!isButton1Active} ></Button>
          </View>
          </View>
          <View style={{margin:20, marginTop: 50, width: '30%', flexDirection:'row', justifyContent:'center', alignItems:'center' }}>
          <Button title="인증 완료" onPress={userPhoneReg} disabled={!isButton2Active}></Button>
          </View>
          </View>)}
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Main