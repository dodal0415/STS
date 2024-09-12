import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, Image, View, Animated, Button, Linking, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import HorizonLine from "../../../src/utils/store/HorizontalLine";
import Menu from '../../../src/components/store/Store'
import { MD2Colors as Colors, IconButton } from "react-native-paper";
import './index.css'
import { useGlobalSearchParams, useRouter } from "expo-router";
import RepresentativeMenu from "../../../src/components/store/RepresentativeMenu";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const RepresentativeMenuLists = [
  {   id: 1,
      imageUrl: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13262118&filePath=L2Rpc2sxL25ld2RhdGEvMjAyMC8yMS9DTFMxMDAwNi82MmZhMWExMy03ZjRmLTQ1NWMtYTZlNy02ZTk2YjhjMjBkYTk=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006',
      storeName: 'Test1',
      price: 14000
    },
    {id: 2,
      imageUrl: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046601&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2FzYWRhbFBob3RvXzI0MTRfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',
      storeName: 'Test2',
      price: 20000
    },
    { id: 3,
      imageUrl: 'data:image/jpeg;base64,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',
      storeName: 'Test3',
      price: 34000
    },
    { id: 4,
      imageUrl: 'data:image/jpeg;base64,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',
      storeName: 'Test4',
      price: 46000
    },
    { id: 5,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2XnzPo_7UTgjK6MCH7l6tx8XTvsv24XNDw&s',
      storeName: 'Test5',
      price: 66000
    },
    { id: 6,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2XnzPo_7UTgjK6MCH7l6tx8XTvsv24XNDw&s',
      storeName: 'Test5',
      price: 66000
    },
    { id: 7,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2XnzPo_7UTgjK6MCH7l6tx8XTvsv24XNDw&s',
      storeName: 'Test5',
      price: 66000
    },
    { id: 8,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2XnzPo_7UTgjK6MCH7l6tx8XTvsv24XNDw&s',
      storeName: 'Test5',
      price: 66000
    },
    { id: 9,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2XnzPo_7UTgjK6MCH7l6tx8XTvsv24XNDw&s',
      storeName: 'Test5',
      price: 66000
    },
    { id: 10,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2XnzPo_7UTgjK6MCH7l6tx8XTvsv24XNDw&s',
      storeName: 'Test5',
      price: 66000
    },
    { id: 11,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi2XnzPo_7UTgjK6MCH7l6tx8XTvsv24XNDw&s',
      storeName: 'Test5',
      price: 66000
    },
]

function AutoPlay() {

  const [showResPer, setShowResPer] = useState(false);

  function handleResPerClick() {
    setShowResPer(!showResPer);
  }

  const handlePaymentRequest = () => {
    router.push(`store/${param.storeid}/table/1`);
  };

  const param = useGlobalSearchParams();
  const router = useRouter();
  const handleEnter = () => {
    router.push(`store/${param.storeid}/myShoppingCart`);
  };
  const listEnter = () => {
    router.push(`store/${param.storeid}/myOrderList`);
  };
  const OptionEnter = () => {
    router.push(`store/${param.storeid}/menuOption`);
  };

  const { height, width } = useWindowDimensions();
  
  const [autoplay, setAutoplay] = useState(false);

  const [RNoP, setRNoP] = useState(1)

  const handleDecrement = () => {
    RNoP > 1 && setRNoP(RNoP - 1);
  };

  // +버튼 클릭 시 숫자 +1
  const handleIncrement = () => {
    setRNoP(RNoP + 1);
  };


  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setAutoplay(true);
  //   }, 500); // 5 seconds delay

  //   return () => clearTimeout(timer);
  // }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1, 
    slidesToScroll: 1,
    autoplay: autoplay,
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
    box: {width: 300, height: 100, backgroundColor: Colors.green900, marginBottom: 10},
    border: {borderWidth: 10, borderColor: Colors.blue900},
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
      borderWidth: 1,
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
    }
  
  })

  const imageUrls = [
    'https://via.placeholder.com/400x300.png?text=Image+1',
    'https://via.placeholder.com/400x300.png?text=Image+2',
    'https://via.placeholder.com/400x300.png?text=Image+3',
    'https://via.placeholder.com/400x300.png?text=Image+4',
    'https://via.placeholder.com/400x300.png?text=Image+5',
    'https://via.placeholder.com/400x300.png?text=Image+6',
  ];


  return (
    <ScrollView >
    <View style={{backgroundColor: '#F2F2F2', flex: 1, alignItems:'center'}}>
      <View style={{backgroundColor: '#FFFFFF', width: width >= 786 ? 786 : width}}>
        
      <div className="slider-container" style={{ width: '100%', margin: 'auto' }}>
        <Slider {...settings}>
          {imageUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            </div>
          ))}
        </Slider>
      </div>
      <div>
        <h3>가게 이름 - 지점</h3>
      </div>
      <div>
        <h3>대표 메뉴, 메뉴, 사이드, 음료수 등 불러와지는 곳</h3>
      </div>
      <HorizonLine/>
      <h3>Menu Category</h3>
      <View>
        <div className="slider-container" style={{display:'flex', overflowX:'auto', whiteSpace:'none', scrollbarWidth:'none'}}>
          {RepresentativeMenuLists.map(RMenu => <RepresentativeMenu key={RMenu.id} imageUrl={RMenu.imageUrl} 
          name={RMenu.storeName} price={RMenu.price}/> )}
        </div>
      </View>
      <HorizonLine/>
      <View style={styles.container}>
          <TouchableOpacity onFocus={handleEnter}>
            <img src={'../../../assets/ShoCart.png'} style={{position:'absolute', bottom:20, right: 20, width:50, height:50, borderRadius:30}}/>
          </TouchableOpacity>
        </View>
      <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
      {showResPer && <h3 style={{textAlign:'center'}}>인원수</h3>}
      <View style={[styles.counterContainer, {flexDirection:'row', borderColor:Colors.grey900, width:200, justifyContent:'space-between'}]}>
      {showResPer && (<TouchableOpacity onPress={handleDecrement} style={styles.counterButton}>
            <h3 style={{color:'white', fontSize:18, fontWeight:'bold'}}>-</h3>
          </TouchableOpacity>)}
      {showResPer && (<View>
        <h3 style={{color:'white', fontSize:18, fontWeight:'bold'}}>{RNoP}</h3>
        </View> )}
      {showResPer && (<TouchableOpacity onPress={handleIncrement} style={styles.counterButton}>
            <h3 style={{color:'white', fontSize:18, fontWeight:'bold'}}>+</h3>
          </TouchableOpacity>)}
      </View>
      {showResPer && (
        <TouchableOpacity style={{backgroundColor: Colors.red200, paddingHorizontal: 20, paddingVertical: 10}}>
          <h3 style={{fontWeight:'bold'}}>확인</h3>
        </TouchableOpacity>
      )}
      </View>
        <View style={{width:'100%', flexDirection:'row'}}>
          <button onClick={() => Linking.openURL('tel:01021113308')} style={{flex: 1, backgroundColor:Colors.red200, borderColor:Colors.red200}}>전화(전화번호도 받아와야 함)</button> 
          <button onClick={handleResPerClick} style={{flex: 4, borderColor:Colors.grey50}}>{showResPer ? '예약 인원 설정 풀기' : '예약 인원 설정'}</button> 
        </View>
       {/* <button onFocus={handleEnter} style={{ width: 88, height: 88 }} >fab</button> */}
       맡은 영역 바로가기
      <button onClick={listEnter}>내 정보창 가기</button>
      <button onClick={OptionEnter}>옵션창 가기</button>
      <TouchableOpacity onPress={handlePaymentRequest}>
          <text>
            결제방식 설정
          </text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
}