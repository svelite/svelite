import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        open?: boolean | undefined;
        children: unknown;
        title: unknown;
    } & Record<string, unknown>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type AccordionProps = typeof __propDef.props;
export type AccordionEvents = typeof __propDef.events;
export type AccordionSlots = typeof __propDef.slots;
export default class Accordion extends SvelteComponentTyped<AccordionProps, AccordionEvents, AccordionSlots> {
}
export {};
