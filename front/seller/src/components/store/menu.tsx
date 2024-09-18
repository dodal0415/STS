import { useEffect, useState } from 'react';
import { Button, FlatList, Image, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { MenuProps } from './type';
import { MenuOption } from './menuoption';

type CategoryType = {
    category_pk: number;
    subject: string;
    deleteMenuGroup: (arg: number) => void;
};

export const Menu: React.FC<CategoryType> = ({ category_pk, subject, deleteMenuGroup }) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [menuLists, setMenuLists] = useState<Array<MenuProps>>([]);
    const [form, setForm] = useState<MenuProps>({
        category_pk,
        menu_pk: 1,
        subject: '',
        imageURL: '',
        description: '',
        price: 0,
        isBestMenu: false,
        isAlcohol: false,
        optionList: [],
    });

    const addMenuLists = (form: MenuProps) => {
        setMenuLists((prevMenuLists) => [...prevMenuLists, form]);
    };

    const updateMenuLists = (form: MenuProps) => {
        setMenuLists((prevMenuLists) => prevMenuLists.map((menu) => (menu.menu_pk === form.menu_pk ? form : menu)));
    };

    const deleteMenuLists = (form: number) => {
        setMenuLists((prevMenuLists) => prevMenuLists.filter((menu) => menu.menu_pk !== form));
    };

    //form 값 초기화
    const hml = () => {
        const cnt = Math.round(menuLists.length * Math.random() * 100000);

        setForm({
            category_pk,
            menu_pk: cnt,
            subject: '',
            imageURL: '',
            description: '',
            price: 0,
            isBestMenu: false,
            isAlcohol: false,
            optionList: [],
        });
        setIsModalVisible(false);
    };

    const handleMenuLists = () => {
        addMenuLists(form);
        hml();
    };

    return (
        <View>
            <View
                style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Text>{subject}</Text>
                <View style={{ gap: 5, flexDirection: 'row' }}>
                    <View style={{ width: 120, margin: 10 }}>
                        <Button title="메뉴 추가" onPress={() => setIsModalVisible(!isModalVisible)} />
                    </View>
                    <View style={{ width: 120, margin: 10 }}>
                        <Button color={'red'} title="메뉴 그룹 삭제" onPress={() => deleteMenuGroup(category_pk)} />
                    </View>
                </View>
            </View>
            {isModalVisible && (
                <View style={{ backgroundColor: '#D9D9D9', padding: 5, gap: 5 }}>
                    <TextInput
                        style={{ height: 40, backgroundColor: 'white' }}
                        placeholder="메뉴 이름"
                        onChangeText={(newText) => setForm({ ...form, subject: newText })}
                        defaultValue={form.subject}
                    />
                    <TextInput
                        style={{ height: 40, backgroundColor: 'white' }}
                        placeholder="메뉴 설명"
                        onChangeText={(newText) => setForm({ ...form, description: newText })}
                        defaultValue={form.description}
                    />
                    <TextInput
                        style={{ height: 40, backgroundColor: 'white' }}
                        placeholder="메뉴 이미지"
                        onChangeText={(newText) => setForm({ ...form, imageURL: newText })}
                        defaultValue={form.imageURL}
                    />
                    <TextInput
                        style={{ height: 40, backgroundColor: 'white' }}
                        placeholder="메뉴 가격"
                        keyboardType="numeric"
                        onChangeText={(newText) => {
                            // 숫자만 필터링
                            const numericValue = newText.replace(/[^0-9]/g, '');
                            console.log(numericValue);
                            setForm({ ...form, price: Number(numericValue) });
                        }}
                        value={String(form.price)} // 입력 필드에 상태 반영
                    />
                    <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            <Button
                                title="주류 여부"
                                onPress={() => setForm({ ...form, isAlcohol: !form.isAlcohol })}
                            />
                            {!form.isAlcohol ? (
                                <Text style={{ color: 'blue' }}>주류가 아니다</Text>
                            ) : (
                                <Text style={{ color: 'red' }}>주류이다</Text>
                            )}

                            <Button
                                title="대표 메뉴 여부"
                                onPress={() => setForm({ ...form, isBestMenu: !form.isBestMenu })}
                            />

                            {!form.isBestMenu ? (
                                <Text style={{ color: 'blue' }}>대표 메뉴 아님</Text>
                            ) : (
                                <Text style={{ color: 'red' }}>대표 메뉴 임</Text>
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            <Button title="추가" onPress={() => handleMenuLists()} />
                            <Button title="취소" onPress={() => hml()} />
                        </View>
                    </View>
                </View>
            )}
            {menuLists.map((element) => (
                <MenuOption
                    key={element.menu_pk.toString()}
                    item={element}
                    updateMenuLists={updateMenuLists}
                    deleteMenuLists={deleteMenuLists}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#F1F1F1',
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionTitle: {
        marginTop: 10,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        padding: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
});
