import type { NavButton } from "./NavButton";
import type { DropdownOption } from "naive-ui";
import NavigationHeaderButton from "@/components/NavigationHeaderButton.vue";
import { h } from "vue";

/**
 * Check if a MouseEvent on a link is accompanied by any of the necessary conditions to open the link in a new tab.
 *   E.g., if the user clicks on a link with the ctrl key pressed, it should open in a new tab.
 *
 *   This method is taken from vue-router. See their license at
 *   {@link https://github.com/vuejs/router/blob/main/LICENSE}.
 * @see https://github.com/vuejs/router/blob/06aefa8d4ea0b4f7d01de091025dea09057e4917/packages/router/src/RouterLink.ts#L282
 * @param e Mouse event which triggered this method call. Technically, this is any MouseEvent, but calling this method
 *   really only makes sense for MouseEvents which occur on links or things which may open a new tab.
 * @returns true if the event is a click which would open a page in a new tab, or false if not.
 */
export function shouldOpenInNewTab(e: MouseEvent): boolean {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
    return true;
  }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) {
    return true;
  }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) {
    return true;
  }
  // don't redirect if `target="_blank"`
  // @ts-expect-error getAttribute does exist
  if (e.currentTarget && e.currentTarget.getAttribute) {
    // @ts-expect-error getAttribute exists
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target)) {
      return true;
    }
  }
  return false;
}

/**
 * Recursive function which converts a NavButton into the expected DropdownOption format for NaiveUI dropdowns.
 *   This function must be written here instead of in NavigationHeaderButton because it refers to
 *   NavigationHeaderButton, and I am not aware of any way to make Vue templates refer to themselves in their
 *   script.
 * @param child
 * @param currentDepth
 */
export function computeNavDropdownChildElement(
  child: NavButton,
  currentDepth: number
): DropdownOption {
  return {
    type: "render",
    key: child.name,
    children:
      child.children?.map((e) =>
        computeNavDropdownChildElement(e, currentDepth + 1)
      ) ?? undefined,
    render: () =>
      h(NavigationHeaderButton, { value: child, depth: currentDepth + 1 }),
  };
}

export type FontAwesomeIconWeights = "fas" | "fal" | "fad" | "fab";


export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends boolean | string | number
      ? T[P]
      : DeepPartial<T[P]>;
};
