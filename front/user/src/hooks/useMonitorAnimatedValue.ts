import {useState, useEffect} from 'react'
import {Animated} from 'react-native'

export const useMonitorAnimatedValue = (animValue: Animated.Value) => {
    const [realAnimValue, setRealAnimValue] = useState<number>(0)

    useEffect(() => {
        const id = animValue.addListener((state: {value: number}) => {
            setRealAnimValue(state.value)
        })
        return () => animValue.removeListener(id) // 프로그램이 종료되는 상태
    }, [])
    return realAnimValue
}