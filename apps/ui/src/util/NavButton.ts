import type { Ref } from "vue";
import type { FontAwesomeIconWeights } from "@/util/helper";

export type NavButton = {
  key: string;
  name: string;
  icon: [FontAwesomeIconWeights, string];
  showIconOnDesktop: boolean;
  route?: string;
  children?: NavButton[];
  active?: Ref<boolean>;
  visible?: () => Ref<boolean>;
  onClick?: (
    event: MouseEvent,
    button: NavButton,
    next: (event: Event) => void
  ) => void;
};
