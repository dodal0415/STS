import {useStyle} from './useStyle'
//prettier-ignore
export const useTransformStyle = (
    transform: Record<string, any>, deps: any[] = []
) => {
    return useStyle({
        transform: Object.keys(transform).map((key) => ({[key]: transform[key]}))
    }, deps)
}