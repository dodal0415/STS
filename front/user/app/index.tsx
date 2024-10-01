import { Link, useRouter } from "expo-router";
import {
  useWindowDimensions,
  Text,
  View,
  StyleSheet,
  Button,
} from "react-native";
import { SocialLogin } from "../src/components/login";

export default function index() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();

  const handleEnter = () => {
    router.push("/main");
  };
  return (
    <View style={[style.container, { height: height }]}>
      <View
        style={[
          style.view,
          { height: height, width: width >= 768 ? 768 : width },
        ]}
      >
        <Text> Login 화면 입니다</Text>
        <Button
          onPress={handleEnter}
          title="main 화면으로 이동"
          // style={{
          //   width: width >= 768 ? 768 : width,
          // }}
        ></Button>
        <SocialLogin />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  view: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  container: { alignItems: "center", backgroundColor: "#F2F2F2" },
});
