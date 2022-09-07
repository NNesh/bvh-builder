import { cloneDeep } from "lodash";
import { Builder, BuilderContext, IsJoint, IsRoot, Root, Node, IsEndSite, Joint } from "./types";


export interface HeaderBuilder extends Builder<string> {
    setHierarchy(root: Root): void;
}


function checkNode(node: Node, parent: Joint | null) {
    if (IsJoint(node) || IsRoot(node)) {
        if (node.children.length === 0) {
            throw new Error("Joint must have 1 or more children");
        }

        if (!node.name) {
            throw new Error("Joint must have a name");
        }

        if (node.channels.length !== node.offset.length) {
            throw new Error("Channels and offset values are mismatched");
        }

        node.children.forEach((child) => checkNode(child, node));
    } else if (IsEndSite(node)) {
        if (!parent) {
            throw new Error("End site node must have a parent");
        }

        if (parent.offset.length !== node.offset.length) {
            throw new Error("End site should have the same channels as its parent");
        }

        if (parent.children.length > 1) {
            throw new Error("A parent of the end site node cannot have more children than ");
        }
    } else {
        throw new Error("Unacceptable node!");
    }
}

function checkHierarchy(root: Root) {
    if (!IsRoot(root)) {
        throw new Error("Top node should be a root");
    }

    checkNode(root, null);
}

export default function getHeaderBuilder(context: BuilderContext): HeaderBuilder {
    return {
        setHierarchy(root: Root): void {
            if (context.motion) {
                throw new Error("Changing the hierarchy is not allowed after motion creating");
            }

            if (!root) {
                throw new Error("null is not allowed");
            }

            checkHierarchy(root);

            context.root = cloneDeep(root);
        },
        build(): string {
            return "";
        },
    };
}
