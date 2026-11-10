/** A map definition as the viewer receives it: after scripts/render.py has filled in the defaults
 *  (scripts/defaults.py), the library assets and the sanitizer. Strings may contain authored HTML/SVG. */
export interface MapNode {
  id: string; zone?: string;
  cat: string; group: string; /** Build step that adds this node (1-based). */ step: number; icon: string; tool: string; concept: string;
  what: string; why: string; tools: string;
  logo?: string; inside?: string;
  /** C4 kind drawn as the card outline. Defaults to "component". */
  shape?: 'component' | 'person' | 'worker' | 'database' | 'queue' | 'external'; decision?: string; art?: boolean;
  [key: string]: unknown;
}
export interface MapEdge { id: string; from: string; to: string; [key: string]: unknown; }
export interface Flow { title: string; desc: string; hue: string; hops: Array<{e: string; t: string; [key: string]: unknown}>; [key: string]: unknown; }
export interface ToolDefinition {
  id: string;
  page: {title:string;slots?:Record<string,string>};
  panels: {introHtml?:string;overviewHtml?:string};
  /** Every interface string; see scripts/defaults.py UI for the keys. Plain text, {name} placeholders. */
  ui: Record<string,string>;
  roles: Record<string,{label:string;light:string;dark:string;fillLight:string;fillDark:string}>;
  logos: Record<string,{name:string;src:string;size:number;/** Tile colour behind a light mark. */ tile?:string}>;
  settings: {
    recapOrder:string[];
    appearanceRoles:{accent:string;artifact:string;error:string};
    /** Role colour of the build-step panel. */
    buildRole:string;
  };
  /** Exact authored layout. No automatic fallback is provided in this version. */
  layout: {
    viewBoxes:{map:[number,number];map0:[number,number]};
    overviewCard:{width:number;height:number};scale:{x:number;y:number};
    nodes:Record<string,{x:number;y:number;w:number;h:number}>;
    edges:Record<string,{d:string;[key:string]:unknown}>;
    zones:Record<string,{x:number;y:number;w:number;h:number}>;
    overview:Record<string,{x:number;y:number}>;
    overviewEdges:Record<string,{d:string;x:number;y:number;anchor:string}>;
    insides:Record<string,{w:number;h:number;svg:string}>;
    annotations:Array<{zone?:string;label:string;rect:Record<string,number>;text:Record<string,number>}>;
    insideMarkers:string;
  };
  nodes: MapNode[]; edges: MapEdge[];
  zones: Array<{id:string;label:string;hue:string;[key:string]:unknown}>;
  groups: Record<string,{title:string;members:string[];[key:string]:unknown}>;
  overview: Array<{g:string}>;
  overviewEdges: Array<{id:string;from:string;to:string;label:string;dashed?:boolean}>;
  flows: Record<string,Flow>;
  buildSteps: Array<null | {title:string;nodes:string[];[key:string]:unknown}>;
  insides: Record<string,{title:string;[key:string]:unknown}>;
  icons: Record<string,string>;
  tourChapters: Array<Record<string,unknown>>; tour: Array<Record<string,unknown>>;
  beatSeconds: number; flowBeatSeconds: number;
  source?: {repo:string;ref?:string};
  /** Optional files view: annotated repository paths tied to map nodes. A path ending in "/" is a folder. */
  files?: {title?:string;intro?:string;heading?:string;panel?:string;
    entries:Array<{path:string;t:string;why?:string;tag?:string;nodes?:string[];open?:boolean;more?:string}>};
}
export interface ToolController {
  selectNode(id:string): boolean;
  openStage(id:string): boolean;
  setBuildStep(step:number): boolean;
  playFlow(id:string): false | Promise<void>;
  startTour(step?:number):void;
  resumeTour():void;
  next():void;
  back():void;
  exitTour():void;
  setZoom(zoom:number):void;
  fit():void;
  setTheme(theme:'light'|'dark'):void;
  getState():{level:number;focused:string|null;selected:string|null;buildStep:number;flow:string|null;zoom:number;pan:{x:number;y:number};fullscreen:boolean;tour:{active:boolean;step:number;phase:number;complete:boolean}};
  destroy():void;
}
export function mount(root:HTMLElement, definition:ToolDefinition):Promise<ToolController>;
