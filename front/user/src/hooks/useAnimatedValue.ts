import {useRef} from 'react'
import {Animated} from 'react-native'

    
    // 기본적으로는 initValue를 매개변수로 사용, 0으로 초기화
    // : Animated.Value = Animated.Value으로 리턴하겠다.(반환타입)
    // initValue값 넣어서 Animated.Value 객체 새로 생성한 값을 useRef에 넣고 현재의 값 반환
export const useAnimatedValue = (initValue: number = 0 ): Animated.Value => {
    return useRef(new Animated.Value(initValue)).current
}