import { useRef } from 'react';
import { ScrollView } from 'react-native';

function useMoveScroll() {
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollTo = (y: number) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y, animated: true });
      }
    };
    return { scrollViewRef, scrollTo };
}

export default useMoveScroll;