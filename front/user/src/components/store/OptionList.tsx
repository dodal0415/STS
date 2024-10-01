import { CheckBox } from '@rneui/themed'
import React, {forwardRef, useState} from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Checkbox } from 'react-native-paper'

const subject = '사이드'
const subject_name = '새우튀김'
const subject_price = 3000

type OptionProps = {
  menu_pk : number,
  minCount: number,
  maxCount: number,
  subjectName: string;
  subjectPrice: number;
  isChecked: boolean;
  onCheck: () => void;
};

const OptionList: React.FC<OptionProps> = ({menu_pk, minCount, maxCount, subjectName, subjectPrice, isChecked, onCheck }) => {

  // const [isChecked, setIsChecked] = useState(false)

  // 필수 아이콘 이미지 결정
  const requiredIcon = minCount > 0
    ? { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPdckJCsrCNs9wG6agGZM-5pEKWP-eoIA0Hw&s' } 
    : { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkzda-rJ_6HJq6sNvOYyVjOh48GjQFHJ83Wg&s' };

    const checkboxImage = isChecked
    ? minCount > 0
      ? { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzuWO1Nxd8Gqa6dCYv5aC3v6NY2rnvxgVXZQ&s' }
      : { uri: 'https://icons.veryicon.com/png/o/miscellaneous/twotone/plus-square-11.png' }
    : { uri: 'https://e7.pngegg.com/pngimages/716/420/png-clipart-checkbox-rectangle-square-computer-icons-checkboxes-angle-check-mark.png' }; // 체크박스가 선택되지 않았을 때

  return (
    <View style={{ marginLeft: 20, marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
      <TouchableOpacity onPress={onCheck}>
          <Image
            source={checkboxImage}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, flex: 1 }}>{subjectName}</Text>
        <Text style={{ fontSize: 16, marginLeft: 10, marginRight:'14%'}}>+{subjectPrice}원</Text>
      </View>
    </View>
  );
}



export default OptionList