import type { Ref } from "vue";

export type NavButton = {
  key: string;
  name: string;
  icon: ["fas" | "fal" | "fad" | "fab", string];
  showIconOnDesktop: boolean;
  route?: string;
  children?: NavButton[];
  visible?: () => Ref<boolean>;
  onClick?: (
    event: MouseEvent,
    button: NavButton,
    next: (event: Event) => void
  ) => void;
};
