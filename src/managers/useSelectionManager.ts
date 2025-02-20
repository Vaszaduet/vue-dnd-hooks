import { computed, type Ref } from 'vue';
import { useDnDStore } from '../composables/useDnDStore';
import { isDescendant } from '../utils/dom';

export const useSelectionManager = (elementRef: Ref<HTMLElement | null>) => {
  const { selectedElements, elements } = useDnDStore();

  const element = computed(() =>
    elements.value.find((element) => element.node === elementRef.value)
  );

  const isSelected = computed<boolean>(() =>
    selectedElements.value.some((element) => element.node === elementRef.value)
  );

  const isParentOfSelected = computed(() => {
    if (!elementRef.value) return false;
    return selectedElements.value.some(
      (selected) =>
        selected.node &&
        isDescendant(
          selected.node as HTMLElement,
          elementRef.value as HTMLElement
        )
    );
  });

  const hasSelectedParent = computed(() => {
    if (!elementRef.value) return false;
    return selectedElements.value.some(
      (selected) =>
        selected.node &&
        isDescendant(
          elementRef.value as HTMLElement,
          selected.node as HTMLElement
        )
    );
  });

  const handleUnselect = () => {
    if (!element.value) return;

    selectedElements.value = selectedElements.value.filter(
      (element) => element.node !== elementRef.value
    );
  };

  const handleSelect = () => {
    if (!element.value) return;

    // Если элемент содержит выбранные элементы, удаляем их и выбираем родителя
    if (isParentOfSelected.value) {
      selectedElements.value = selectedElements.value.filter(
        (selected) =>
          selected.node &&
          !isDescendant(
            selected.node as HTMLElement,
            elementRef.value as HTMLElement
          )
      );
    }

    // Если у элемента есть выбранный родитель, удаляем родителя из выбранных
    if (hasSelectedParent.value) {
      selectedElements.value = selectedElements.value.filter(
        (selected) =>
          selected.node &&
          !isDescendant(
            elementRef.value as HTMLElement,
            selected.node as HTMLElement
          )
      );
    }

    selectedElements.value.push(element.value);
  };

  const handleToggleSelect = () => {
    if (!element.value) return;

    selectedElements.value.some((element) => element.node === elementRef.value)
      ? handleUnselect()
      : handleSelect();
  };

  return {
    handleUnselect,
    handleSelect,
    handleToggleSelect,
    isSelected,
    isParentOfSelected,
  };
};
