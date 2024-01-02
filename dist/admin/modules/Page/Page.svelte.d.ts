/** @typedef {typeof __propDef.props}  PageProps */
/** @typedef {typeof __propDef.events}  PageEvents */
/** @typedef {typeof __propDef.slots}  PageSlots */
export default class Page extends SvelteComponentTyped<{
    [x: string]: unknown;
    title?: string | undefined;
    content?: unknown;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type PageProps = typeof __propDef.props;
export type PageEvents = typeof __propDef.events;
export type PageSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: unknown;
        title?: string | undefined;
        content?: unknown;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
