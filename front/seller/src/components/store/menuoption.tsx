import {
  Button,
  Image,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { MenuProps, OptionListProps } from "./type";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { OptionCategory } from "./optionCategory";
import { FireBaseImage } from "../common";
import { firestore, storage } from "../../../fierbaseConfig";
import { ref, deleteObject } from "firebase/storage";
import { collection, query, where } from "firebase/firestore";

type MenuOption = {
  item: MenuProps;
  updateMenuLists: (args: MenuProps) => void;
  deleteMenuLists: (args: number) => void;
};

export const MenuOption: React.FC<MenuOption> = ({
  item,
  updateMenuLists,
  deleteMenuLists,
}) => {
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [menuItem, setMenuItem] = useState<MenuProps>(item);
  const [option, setOption] = useState<Array<OptionListProps>>([]);
  const [isOption, setIsOption] = useState<boolean>(false);
  const [form, setForm] = useState<OptionListProps>({
    optionListPk: Math.round(Math.random() * 100000),
    opSubject: "",
    optionItem: [],
  });

  const handleOptionCategory = () => {
    setOption([...option, form]);
    setForm({
      optionListPk: Math.round(Math.random() * 100000),
      opSubject: "",
      optionItem: [],
    });
    setIsOption(!isOption);
  };

  const updateOptionCate = (element: OptionListProps) => {
    setOption((prevOptions) =>
      prevOptions.map((opt) =>
        opt.optionListPk === element.optionListPk ? element : opt
      )
    );
  };
  const deleteOptionCate = (pk: number) => {
    setOption((prev) => prev.filter((e) => e.optionListPk != pk));
  };

  const handleImage = (img: Array<string>) => {
    if (img.length != 0) {
      setMenuItem({ ...menuItem, imageURL: img[0] });
    } else {
      setMenuItem({ ...menuItem, imageURL: "" });
    }
  };

  const onhandleImages = async (uri: string) => {
    try {
      // Get the reference to the file in Firebase Storage
      const storageRef = ref(storage, uri);
      await deleteObject(storageRef);
      console.log("Deleted from Firebase Storage");

      // Firestore에서 해당 URL 삭제
      const q = query(collection(firestore, "images"), where("url", "==", uri));

      // Remove the image from the local list
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <View style={styles.menuItem}>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <Image source={{ uri: item.imageURL }} style={styles.image} />
        <View>
          <Text style={styles.title}>메뉴 이름: {item.subject}</Text>
          <Text>메뉴 설명: {item.description}</Text>
          <Text>가격: {item.price}</Text>
          <Text>베스트 메뉴: {item.isBestMenu ? "Yes" : "No"}</Text>
          <Text>주류 여부: {item.isAlcohol ? "Yes" : "No"}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 5 }}>
        <Button title="옵션 추가" onPress={() => setIsOption(!isOption)} />
        <Button title="수정" onPress={() => setIsUpdate(!isUpdate)} />
        <Button
          title="삭제"
          onPress={() => {
            deleteMenuLists(item.menu_pk), onhandleImages(item.imageURL);
          }}
        />
      </View>

      {/* 옵션 카테고리  */}
      {isOption && (
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <View style={{ margin: 10 }}>
            <TextInput
              style={{ height: 40, backgroundColor: "white" }}
              placeholder="옵션 카테고리"
              onChangeText={(newText) =>
                setForm({ ...form, opSubject: newText })
              }
              defaultValue={form.opSubject}
            />
          </View>
          <View>
            <Button title="등록" onPress={() => handleOptionCategory()} />
          </View>
        </View>
      )}
      <View style={{ marginTop: 10 }}>
        {option.map((el) => (
          <View key={el.optionListPk}>
            <OptionCategory
              val={el}
              updateOptionCate={updateOptionCate}
              deleteOptionCate={deleteOptionCate}
            />
          </View>
        ))}
      </View>

      {/* 메뉴 수정 부분 */}
      {isUpdate && (
        <View style={{ backgroundColor: "#D9D9D9", padding: 5, gap: 5 }}>
          <TextInput
            style={{ height: 40, backgroundColor: "white" }}
            placeholder="메뉴 이름"
            onChangeText={(newText) =>
              setMenuItem({ ...menuItem, subject: newText })
            }
            defaultValue={menuItem.subject}
          />
          <TextInput
            style={{ height: 40, backgroundColor: "white" }}
            placeholder="메뉴 설명"
            onChangeText={(newText) =>
              setMenuItem({ ...menuItem, description: newText })
            }
            defaultValue={menuItem.description}
          />

          <FireBaseImage
            count={1}
            imgs={menuItem.imageURL == "" ? [] : [menuItem.imageURL]}
            handleImages={handleImage}
          />
          <TextInput
            style={{ height: 40, backgroundColor: "white" }}
            placeholder="메뉴 가격"
            keyboardType="numeric"
            onChangeText={(newText) => {
              // 숫자만 필터링
              const numericValue = newText.replace(/[^0-9]/g, "");
              setMenuItem({ ...menuItem, price: Number(numericValue) });
            }}
            value={String(menuItem.price)} // 입력 필드에 상태 반영
          />
          <View
            style={{
              width: "100%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Button
                title="주류 여부"
                onPress={() =>
                  setMenuItem({ ...menuItem, isAlcohol: !menuItem.isAlcohol })
                }
              />
              {!menuItem.isAlcohol ? (
                <Text style={{ color: "blue" }}>주류가 아니다</Text>
              ) : (
                <Text style={{ color: "red" }}>주류이다</Text>
              )}

              <Button
                title="대표 메뉴 여부"
                onPress={() =>
                  setMenuItem({
                    ...menuItem,
                    isBestMenu: !menuItem.isBestMenu,
                  })
                }
              />

              {!menuItem.isBestMenu ? (
                <Text style={{ color: "blue" }}>대표 메뉴 아님</Text>
              ) : (
                <Text style={{ color: "red" }}>대표 메뉴 임</Text>
              )}
            </View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Button
                title="확인"
                onPress={() => {
                  updateMenuLists(menuItem);
                  setIsUpdate(false);
                }}
              />
              <Button
                title="취소"
                onPress={() => {
                  setIsUpdate(false);
                  setMenuItem(item);
                }}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#F1F1F1",
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionTitle: {
    marginTop: 10,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    padding: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
});