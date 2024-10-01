import { useRouter } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";

interface InputDateProps {
  inputData: { type: number; val: string };
}

export const StoreList: React.FC<InputDateProps> = ({ inputData }) => {
  const { height, width } = useWindowDimensions();
  const { type, val } = inputData;
  const [storeList, setStoreList] = useState<itemData[]>([]);
  const [numColumns, setNumColumns] = useState<number>(1);
  const router = useRouter();
  const handleEnter = (storepk : number) => {
    router.push(`/store/${storepk}`);
  };
  useEffect(() => {
    if (width >= 768) {
      setNumColumns(2);
    } else {
      setNumColumns(1);
    }
  }, [width]);

  const store = {
    storePk: 1,
    storeImage:
      "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240723_36%2F1721719991223QOQ3E_JPEG%2F%25B9%25E9%25BC%25D2%25C1%25A4_IMG_29.jpg",

    storeName: "백소정 센텀점",
    address: "부산 해운대구 센텀동로 35 103호",
    info: "부산 센텀 맛집, 백소정 센텀점을 찾아주셔서 감사합니다^^",
  };

  useEffect(() => {
    const arr: itemData[] = [];
    for (let i = 0; i < type * 5; i++) {
      const newStore = { ...store, storePk: i };
      arr.push(newStore);
    }
    setStoreList(arr);
  }, [type]);
  const renderItem = ({ item }: { item: itemData }) => {
    return (
      <Item
        item={item}
        onPress={() => {
          handleEnter(item.storePk)
        }}
        backgroundColor={"#FFFFFF"}
        width={width >= 768 ? 384 : width}
      />
    );
  };

  return type !== 0 ? (
    <SafeAreaView style={{ marginTop: 10, flex: 1 }}>
      <FlatList
        scrollEnabled={true}
        data={storeList}
        key={`${numColumns}`}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.storePk}`}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
      />
    </SafeAreaView>
  ) : null;
};

type itemData = {
  storePk: number;
  storeImage: string;
  storeName: string;
  address: string;
  info: string;
};
type ItemProps = {
  item: itemData;
  onPress: () => void;
  backgroundColor: string;
  width: number;
};

const Item = ({ item, onPress, backgroundColor, width }: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[{ backgroundColor: backgroundColor, width: width }]}
  >
    <View style={styles.storeContainer}>
      <Image source={{ uri: item.storeImage }} style={styles.storeImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.storeName}>{item.storeName}</Text>
        <Text style={styles.storeAddress}>{item.address}</Text>
        <Text style={styles.storeInfo}>{item.info}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  storeContainer: {
    flexDirection: "row",
    margin: 10,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    borderWidth: 3,
    padding: 5,
  },
  storeImage: {
    width: 150,
    height: 150,
    marginRight: 10,
  },
  storeName: {
    fontSize: 20,
    fontWeight: "bold",
    flexShrink: 1,
    color: "#0068C3",
  },
  storeAddress: {
    fontSize: 17,
    fontWeight: "bold",
    flexShrink: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  storeInfo: {
    fontSize: 15,
    fontWeight: "bold",
    flexShrink: 1,
  },
});
