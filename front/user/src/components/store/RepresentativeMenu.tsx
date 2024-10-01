import  React, { forwardRef } from 'react'
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { MD2Colors as Colors} from 'react-native-paper'
import HorizonLine from '../../utils/store/HorizontalLine';
import {useGlobalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

type MenuItem = {
  category_pk : number
  menu_pk : number
  name : string
  price : number
  description : string
  imageURL : string
  isBestMenu : boolean
  isAlcohol : boolean
  menuOptionData : menuOptions[]
  };

  interface menuOptions {
    name : string
    price : number
    description : String
    imageUrl : String
    isBestMenu : Boolean
    isAlcohol : Boolean
  }
  
  type MenuCategory = {
    subject: string;
    Menus: MenuItem[];
  };

  type RepresentativeMenuProps = {
    inputData: MenuCategory[]
    onLayout?: (subject: string) => (event: any) => void;
  
  };
  export interface RepresentativeMenuHandle {
    scrollToCategory: (subject: string) => void;
  }

const RepresentativeMenu = forwardRef<RepresentativeMenuHandle, RepresentativeMenuProps>(({ inputData, onLayout  }, ref) => {

  const param = useGlobalSearchParams();
  const router = useRouter();

  const handleEnter = () => {
    router.push(`store/${param.storeid}/myShoppingCart`);
  }

  const apiClient = axios.create({
    baseURL: 'http://192.168.30.10:8080',
  })

  const requestMenuOption = async (menu_pk: number) => {
    try {
      await apiClient.get(`/api/menu/${menu_pk}/menu`)
      router.push(`store/${param.storeid}/menuOption`)
    } catch(e) {
      console.log('옵션을 불러오는 것을 실패했습니다!')
    }
  };
  
    return (
      <ScrollView style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
             {inputData.map((category, index) => (
                <View style={{flexDirection: 'column', marginBottom: 10}} key={index} onLayout={onLayout ? onLayout(category.subject) : undefined} >
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10,  margin:10}}>{category.subject}</Text>
          {category.Menus.map((menuItem) => (
            <TouchableOpacity key={menuItem.menu_pk} onPress={() => requestMenuOption(menuItem.menu_pk)}>
            <React.Fragment key={menuItem.menu_pk}>
              <View key={menuItem.menu_pk} style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Image
                      source={{ uri: menuItem.imageURL }}
                      style={{ width: 170, height: 170, margin: 10 }} alt="menu" />
                  <View style={{flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{menuItem.name}</Text>
                      <Text style={{ fontSize: 16 }}>{menuItem.price.toLocaleString()}원</Text>
                      <Text style={{ fontSize: 14 }}>{menuItem.description}</Text>
                  </View>
              </View>
            <HorizonLine />
            </React.Fragment>
            </TouchableOpacity>
         ))}
        </View>
      ))}
</SafeAreaView>
</ScrollView>
  )
})

export default RepresentativeMenu