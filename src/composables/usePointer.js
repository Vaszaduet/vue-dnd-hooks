import { getOffset } from '../utils/geometry';
import { useDnDStore } from './useDnDStore';
export const usePointer = (elementRef) => {
    const store = useDnDStore();
    const onPointerStart = (event) => {
        store.pointerPosition.start.value = { x: event.clientX, y: event.clientY };
        store.pointerPosition.current.value = {
            x: event.clientX,
            y: event.clientY,
        };
        const { pixel, percent } = getOffset(elementRef.value, {
            x: event.clientX,
            y: event.clientY,
        });
        store.pointerPosition.offset.pixel.value = pixel;
        store.pointerPosition.offset.percent.value = percent;
    };
    const onPointerMove = (event) => {
        store.pointerPosition.current.value = {
            x: event.clientX,
            y: event.clientY,
        };
    };
    const onPointerEnd = () => {
        store.pointerPosition.current.value = null;
        store.pointerPosition.start.value = null;
        store.pointerPosition.offset.pixel.value = null;
        store.pointerPosition.offset.percent.value = null;
    };
    return {
        onPointerStart,
        onPointerMove,
        onPointerEnd,
    };
};
