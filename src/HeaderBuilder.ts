import { formatNumberToString } from "./helpers";
import { Builder, BuilderContext, IsJoint, IsRoot, Root, Node, IsEndSite, Joint } from "./types";

import cloneDeep = require("lodash/cloneDeep");


export interface HeaderBuilder extends Builder<string> {
    setHierarchy(root: Root): HeaderBuilder;
}

function checkNode(node: Node, parent: Joint | null): number {
    if (IsJoint(node)) {
        if (node.children.length === 0) {
            throw new Error("Joint must have 1 or more children");
        }

        if (!node.name) {
            throw new Error("Joint must have a name");
        }

        let channels = 0;
        node.children.forEach((child) => {
            channels += checkNode(child, node)
        });

        return channels + node.channels.length;
    } else if (IsEndSite(node)) {
        if (!parent) {
            throw new Error("End site node must have a parent");
        }

        if (parent.children.length > 1) {
            throw new Error("A parent of the end site node cannot have more children than ");
        }

        return 0;
    } else {
        throw new Error("Unacceptable node!");
    }
}

function checkHierarchy(root: Root): number {
    if (!IsRoot(root)) {
        throw new Error("Top node should be a root");
    }

    return checkNode(root, null);
}

function getTypeName(node: Node): string {
    if (IsEndSite(node)) {
        return "End Site";
    }

    return node.type.toUpperCase();
}

function nodeToString(node: Node, level: number = 0): string {
    let result = "";
    const tabs = "\t".repeat(level);
    const typeName = getTypeName(node);
    const name = IsJoint(node) ? node.name : "";

    result += `${tabs}${typeName} ${name}\n`;
    result += `${tabs}{\n`;
    result += `${tabs}\tOFFSET\t${formatNumberToString(node.offset.x)}\t${formatNumberToString(node.offset.y)}\t${formatNumberToString(node.offset.z)}\n`;

    if (IsJoint(node)) {
        result += `${tabs}\tCHANNELS ${node.channels.length} ${node.channels.join(" ")}\n`;
        result += node.children.map(child => nodeToString(child, level + 1)).join();
    }

    result += `${tabs}}\n`;

    return result;
}

export default function getHeaderBuilder(context: BuilderContext): HeaderBuilder {
    return {
        setHierarchy(root: Root): HeaderBuilder {
            if (context.motion) {
                throw new Error("Changing the hierarchy is not allowed after motion creating");
            }

            if (!root) {
                throw new Error("null is not allowed");
            }

            context.channelCount = checkHierarchy(root);
            context.root = cloneDeep(root);

            return this;
        },
        build(): string {
            if (!context.root) {
                throw new Error("Hierarchy is not provided");
            }

            return `HIERARCHY\n${nodeToString(context.root, 0)}`;
        },
    };
}
