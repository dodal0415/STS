import { useEffect, useState } from "react";
import { Searchbar } from "react-native-paper";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router, useRouter } from "expo-router";

interface TopbarProps {
  onSearch: (word: string) => void;
  handleCategoryBtnState: (state: boolean) => void;
  categoryState: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  onSearch,
  handleCategoryBtnState,
  categoryState,
}) => {
  const [search, setSearch] = useState<string>("");

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  const router = useRouter()

  const profileClick = () => {
    router.push(`./myOrderList`)
  };

  const searchKeyword = () => {
    onSearch(search);
    handleCategoryBtnState(false);
  };
  useEffect(() => {
    if (categoryState) setSearch("");
  }, [categoryState]);

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "#e1e8ee",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
      }}
    >
      <View style={{ flexDirection: "row-reverse" }}>
        <Icon name="account" size={40} onPress={profileClick} />
      </View>
      <Searchbar
        style={{ backgroundColor: "white" }}
        placeholder="가게를 검색해주세요"
        onChangeText={updateSearch}
        onIconPress={() => searchKeyword()}
        value={search}
        inputStyle={{ borderRadius: 5, padding: 5 }}
        onSubmitEditing={() => searchKeyword()}
      />
    </View>
  );
};
