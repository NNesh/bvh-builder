export interface Builder<R> {
    build(): R;
}

export type Channel = "Xposition" | "Yposition" | "Zposition" | "Zrotation" | "Xrotation" | "Yrotation";

export type NodeType = "end-site" | "joint" | "root";

export interface Offset {
    x: number;
    y: number;
    z: number;
}

export interface Node {
    type: NodeType;
    offset: Offset;
}

export interface EndSite extends Node {
    type: "end-site";
}

export interface Joint extends Node {
    type: "joint" | "root";
    name: string;
    channels: Channel[];
    children: (Joint | EndSite)[];
}

export interface Root extends Joint {
    type: "root";
}

export function IsEndSite(node: Node): node is EndSite {
    return node.type === "end-site";
}

export function IsJoint(node: Node): node is Joint {
    return node.type === "joint" || IsRoot(node);
}

export function IsRoot(node: Node): node is Joint {
    return node.type === "root";
}

export interface Frame {
    values: number[];
}

export interface Motion {
    period: number;
    frames?: Frame[];
}

export interface BuilderContext {
    root?: Root;
    motion?: Motion;
    channelCount: number;
}
