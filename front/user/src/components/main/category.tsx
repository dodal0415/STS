import { FC, useEffect, useState } from "react";
import {
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
} from "react-native";

interface TopbarProps {
  onSearch: (word: string) => void;
  handleCategoryBtnState: (state: boolean) => void;
  categoryState: boolean;
}

export const CategoryList: FC<TopbarProps> = ({
  onSearch,
  handleCategoryBtnState,
  categoryState,
}) => {
  const { height, width } = useWindowDimensions();
  const categoryClick = (cate: String) => {
    console.log(cate);
  };
  const [selectedId, setSelectedId] = useState<string>();
  useEffect(() => {
    if (!categoryState) {
      setSelectedId("");
    }
  }, [categoryState]);

  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor = item.cate === selectedId ? "black" : "#D9D9D9";
    const color = item.cate === selectedId ? "white" : "black";

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.cate),
            onSearch(item.id),
            handleCategoryBtnState(true);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView style={{ marginTop: 10 }}>
      <FlatList
        horizontal={true}
        scrollEnabled={true}
        data={category}
        renderItem={renderItem}
        keyExtractor={(item) => item.cate}
        extraData={selectedId}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

type ItemData = {
  id: string;
  cate: string;
};

const category: ItemData[] = [
  { id: "1", cate: "족발,보쌈" },
  { id: "2", cate: "돈까스,회 일식" },
  { id: "3", cate: "고기,구이" },
  { id: "4", cate: "피자" },
  { id: "5", cate: "찜,탕,찌개" },
  { id: "6", cate: "양식" },
  { id: "7", cate: "중식" },
  { id: "8", cate: "아시안" },
  { id: "9", cate: "치킨" },
  { id: "10", cate: "백반,죽,국수" },
  { id: "11", cate: "버거" },
  { id: "12", cate: "분식" },
  { id: "13", cate: "카페,디저트" },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.categoryBtn, { backgroundColor }]}
  >
    <Text style={[styles.categoryText, { color: textColor }]}>{item.cate}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scrollview: {},
  categoryBtn: {
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    marginLeft: 10,

    padding: 7,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 17,
  },
});
