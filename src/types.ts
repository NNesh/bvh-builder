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

export interface NodeParams {
    channels: Channel[];
    offset: Offset;
}

export interface Node extends NodeParams {
    parent?: Node;
    type: NodeType;
    name: string;
}

export interface EndSite extends Node {
    type: "end-site";
}

export interface Joint extends Node {
    type: "joint" | "root";
    children: (Joint | EndSite)[];
}

export interface Root extends Joint {
    type: "root";
}

export function IsEndSite(node: Node): node is EndSite {
    return node.type === "end-site";
}

export function IsJoint(node: Node): node is Joint {
    return node.type === "joint";
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
