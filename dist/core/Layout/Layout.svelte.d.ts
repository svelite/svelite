/** @typedef {typeof __propDef.props}  LayoutProps */
/** @typedef {typeof __propDef.events}  LayoutEvents */
/** @typedef {typeof __propDef.slots}  LayoutSlots */
export default class Layout extends SvelteComponentTyped<
	{
		[x: string]: unknown;
		children: unknown;
		theme?: string | undefined;
		dir?: string | undefined;
		showSidebar: unknown;
		sidebar: unknown;
		header: unknown;
	},
	{
		[evt: string]: CustomEvent<any>;
	},
	{}
> {}
export type LayoutProps = typeof __propDef.props;
export type LayoutEvents = typeof __propDef.events;
export type LayoutSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: unknown;
		children: unknown;
		theme?: string | undefined;
		dir?: string | undefined;
		showSidebar: unknown;
		sidebar: unknown;
		header: unknown;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export {};
