import { computed, effectScope, ref } from 'vue';
let initialized = false;
let state;
/**
 * Global store for managing drag and drop state.
 * Uses singleton pattern to ensure single source of truth across the application.
 *
 * The store manages:
 * - Active drag operations
 * - Dragged elements
 * - Drop zones
 * - Pointer positions
 * - Hover states
 *
 * @returns {IDnDStore} Global drag and drop state
 *
 * @example
 * ```ts
 * const {
 *   // Drag state
 *   isDragging,          // Whether drag operation is active
 *   draggingElements,    // Currently dragged elements
 *   selectedElements,    // Selected elements (for multi-drag)
 *
 *   // Container state
 *   activeContainer,     // Current drag container
 *
 *   // Elements and zones
 *   elements,            // All registered draggable elements
 *   zones,              // All registered drop zones
 *
 *   // Hover state
 *   hovered: {
 *     zone,             // Currently hovered drop zone
 *     element           // Currently hovered element
 *   },
 *
 *   // Pointer tracking
 *   pointerPosition: {
 *     current,          // Current pointer coordinates
 *     start,           // Initial drag start coordinates
 *     offset: {
 *       percent,       // Offset as percentage
 *       pixel         // Offset in pixels
 *     }
 *   }
 * } = useDnDStore();
 *
 * // Example: Watch for drag state changes
 * watch(isDragging, (dragging) => {
 *   if (dragging) {
 *     console.log('Drag started with elements:', draggingElements.value);
 *   } else {
 *     console.log('Drag ended');
 *   }
 * });
 *
 * // Example: Track hover states
 * watch(() => hovered.zone.value, (zone) => {
 *   if (zone) {
 *     console.log('Hovering over zone:', zone.data);
 *   }
 * });
 * ```
 */
export const useDnDStore = () => {
    if (!initialized) {
        const scope = effectScope(true);
        state = scope.run(() => ({
            /** Whether any drag operation is currently active */
            isDragging: computed(() => state.draggingElements.value.length > 0),
            /** Active container where dragging occurs */
            activeContainer: {
                /** Component instance of active container */
                component: ref(null),
                /** DOM reference of active container */
                ref: ref(null),
            },
            /** All registered draggable elements */
            elements: ref([]),
            /** Elements currently being dragged */
            draggingElements: ref([]),
            /** Elements currently selected (for multi-drag) */
            selectedElements: ref([]),
            /** All registered drop zones */
            zones: ref([]),
            /** Current hover states */
            hovered: {
                /** Currently hovered drop zone */
                zone: ref(null),
                /** Currently hovered draggable element */
                element: ref(null),
            },
            /** Pointer position tracking */
            pointerPosition: {
                /** Current pointer coordinates */
                current: ref(null),
                /** Initial coordinates when drag started */
                start: ref(null),
                /** Offset from start position */
                offset: {
                    /** Offset as percentage of container */
                    percent: ref(null),
                    /** Offset in pixels */
                    pixel: ref(null),
                },
            },
        }));
        initialized = true;
    }
    return state;
};
