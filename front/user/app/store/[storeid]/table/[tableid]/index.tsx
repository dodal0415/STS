import { useGlobalSearchParams, useRouter } from "expo-router";
import { Text, View, Button } from "react-native";

export default function index() {
  const param = useGlobalSearchParams();
  const router = useRouter();
  const handleEnter = () => {
    router.push(`store/${param.storeid}/table/${param.tableid}/payments`);
  };
  return (
    <View>
      <Text> table 화면 입니다</Text>
      <Text> store id : {param.storeid}</Text>
      <Text> table id : {param.tableid}</Text>
      <Button onPress={handleEnter} title="payments로 이동"></Button>
    </View>
  );
}
