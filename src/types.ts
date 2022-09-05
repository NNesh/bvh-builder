export interface Builder<R> {
    build(): R;
}

export type Channel = 'Xposition' | 'Yposition' | 'Zposition' | 'Xrotation' | 'Yrotation' | 'Zrotation';

export type NodeType = 'end-site' | 'joint';

export interface HeaderNode {
    type: NodeType;
    offset: number[];
}

export interface EndSite extends HeaderNode {
    type: 'end-site';
}

export interface Joint extends HeaderNode {
    type: 'joint';
    name: string;
    channels: Channel[];
    children: BvhJoint[];
}

export type BvhJoint = Joint | EndSite;

export function IsEndSite(node: HeaderNode): node is EndSite
{
    return node.type === 'end-site';
}

export function IsJoint(node: HeaderNode): node is Joint
{
    return node.type === 'joint';
}
