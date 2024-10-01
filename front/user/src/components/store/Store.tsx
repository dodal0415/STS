// import React, { ReactNode } from 'react'
// import { useWindowDimensions, View, Text } from 'react-native';

// const IMG_BASE_URL = "https://image.tmdb.org/t/p/w1280/";

// interface Props {
//     MenuCategory: ReactNode;
//     menu_image: ReactNode;
//     menu: ReactNode;
//     price: ReactNode;
//     id: ReactNode;
// }


// export default function Menu({MenuCategory, menu_image, menu, price, id} : Props) {
  
//   const { height, width } = useWindowDimensions();

//     return (
//       <View style={{backgroundColor: '#F2F2F2', alignItems:'center'}}>
//         <View style={{backgroundColor: '#FFFFFF', width: width >= 786 ? 786 : width}}>
//           <View>
//             <View ></View>
//           <Image source={{uri : menu_image}} alt='메뉴 사진'/>
//           <View>
//               <Text style={{fontSize:16}}>{MenuCategory}</Text>
//               <Text>{menu}</Text>
//               <Text>{price}</Text>
//               <>
//                   {id}
//               </>
//           </View>
//       </View>
//       </View>
//       </View>
//     )
//   }