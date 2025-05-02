import { type Directive } from "vue";
import tippy, { type Instance } from "tippy.js";
import { sleep } from "@/util/misc";

type ElementWithTooltip = HTMLElement & { _tippy?: Instance };

/** basic tooltip directive, using tippy directly for more control */
export const tooltip: Directive<ElementWithTooltip, string> = {
  mounted: (el, { value }) => {
    if (!value?.trim()) return;
    tippy(el, {
      delay: [100, 0],
      allowHTML: true,
      onHide: (instance) => {
        sleep().then(() => {
          /** https://github.com/Akryum/floating-vue/issues/939 */
          if (instance.state.isMounted) instance.unmount();
        });
      },
    });
    el._tippy?.setContent(value);
  },
  updated: (el, { value }) => {
    if (!value?.trim()) return;
    el._tippy?.setContent(value);
  },
  beforeUnmount: (el) => {
    el._tippy?.destroy();
  },
};
