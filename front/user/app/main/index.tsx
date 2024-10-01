import { useRouter } from "expo-router";
import { Button, Text, useWindowDimensions, View } from "react-native";
import { CategoryList, StoreList, Topbar } from "../../src/components/main";
import { useEffect, useState } from "react";

export default function index() {
  const router = useRouter();
  const handleEnter = () => {
    router.push("/store/38");
  };
  const { height, width } = useWindowDimensions();

  const [inputData, setInputData] = useState<{ type: number; val: string }>({
    type: 0,
    val: "",
  });
  const [categoryState, setCategoryState] = useState<boolean>(false);

  const handleWrod = (keyword: string) => {
    setInputData({ type: 1, val: keyword });
  };

  const handleCate = (category: string) => {
    setInputData({ type: 2, val: category });
  };

  const handleCategoryBtnState = (state: boolean) => {
    setCategoryState(state);
  };

  useEffect(() => {
    console.log(inputData);
  }, [inputData]);
  return (
    <View
      style={{
        backgroundColor: "#F2F2F2",
        height: height,
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          width: width >= 786 ? 786 : width,
          height: height,
        }}
      >
        <Text> main 화면 입니다</Text>
        <Button onPress={handleEnter} title="store로 이동"></Button>

        <Topbar
          onSearch={handleWrod}
          handleCategoryBtnState={handleCategoryBtnState}
          categoryState={categoryState}
        />
        <CategoryList
          onSearch={handleCate}
          handleCategoryBtnState={handleCategoryBtnState}
          categoryState={categoryState}
        />
        <StoreList inputData={inputData} />
      </View>
    </View>
  );
}
