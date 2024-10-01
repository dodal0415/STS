import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Button,
} from "react-native";
import KakaoImage from "../../../assets/images/ic-login-kakao.svg";
import NaverImage from "../../../assets/images/ic-login-naver.svg";
import GoogleImage from "../../../assets/images/ic-login-google.svg";

const MAINIMAGE = require("../../../assets/images/icon.png");

export const SocialLogin = () => {
  const { height, width } = useWindowDimensions();
  const [checkOrder, setCheckOrder] = useState(false);

  const [textNum, setTextNum] = useState("");
  const kakaoClick = () => {
    console.log("카카오");
  };
  const naverClick = () => {
    console.log("네이버");
  };
  const googleClick = () => {
    console.log("구글");
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={styles.kakaoButtonImage}
          source={MAINIMAGE}
        />
      </View> */}
      <TouchableOpacity
        style={[
          styles.kakaoButtonContainer,
          {
            backgroundColor: "#FEE500",
            width: width >= 440 ? 430 : width - 10,
          },
        ]}
        onPress={kakaoClick}
      >
        <View style={styles.kakaoButtonContent}>
          <KakaoImage style={styles.kakaoButtonImage} />
          <Text style={[styles.kakaoButtonText, { color: "#191919" }]}>
            카카오로 시작하기
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.kakaoButtonContainer,
          {
            backgroundColor: "#03C75A",
            width: width >= 440 ? 430 : width - 10,
          },
        ]}
        onPress={naverClick}
      >
        <View style={styles.kakaoButtonContent}>
          <NaverImage style={styles.kakaoButtonImage} />
          <Text style={[styles.kakaoButtonText, { color: "#FFFFFF" }]}>
            네이버로 시작하기
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.kakaoButtonContainer,
          {
            backgroundColor: "#FFFFFF",
            width: width >= 440 ? 430 : width - 10,
            borderWidth: 1,
            borderColor: "#191919",
          },
        ]}
        onPress={googleClick}
      >
        <View style={styles.kakaoButtonContent}>
          <GoogleImage style={styles.kakaoButtonImage} />
          <Text style={[styles.kakaoButtonText, { color: "#191919" }]}>
            Google로 시작하기
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ marginTop: 10, width: 110 }}>
        <Button
          title="주문 내역 확인"
          onPress={() => setCheckOrder((checkOrder) => !checkOrder)}
        ></Button>
      </View>
      <View
        style={{
          opacity: checkOrder ? 100 : 0,
          marginTop: 5,
          padding: 10,
          borderWidth: 1,
          borderRadius: 5,
        }}
      >
        <View style={styles.inputContainer}>
          <TextInput
            editable={checkOrder}
            style={[
              styles.input,
              { width: width >= 440 ? 215 : (width - 10) / 2 },
            ]}
            value={textNum}
            onChangeText={(text) => setTextNum(text)}
            placeholder="주문 내역 확인"
          />
          <View style={{ marginLeft: 6 }}>
            <Button disabled={!checkOrder} title="확인"></Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  kakaoButtonContainer: {
    // 버튼 자체의 스타일 (마진, 패딩 등)
    backgroundColor: "#FEE500",
    paddingVertical: 10, // 버튼의 세로 패딩
    paddingHorizontal: 20, // 버튼의 가로 패딩
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    padding: 10,
  },
  kakaoButtonContent: {
    flexDirection: "row", // 이미지와 텍스트를 가로로 배치
    alignItems: "center", // 이미지와 텍스트 수직 중앙 정렬
  },
  kakaoButtonImage: {
    width: 30, // 이미지 크기 조정
    height: 30,
  },

  kakaoButtonText: {
    marginLeft: 10, // 이미지와 텍스트 사이 간격
    fontSize: 16,
    fontWeight: "bold",
  },
  checkOrder: { marginTop: 10, alignSelf: "flex-start" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
});
