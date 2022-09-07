import { cloneDeep } from "lodash";
import { formatNumberToString } from "./helpers";
import { Builder, BuilderContext, IsJoint, IsRoot, Root, Node, IsEndSite, Joint, EndSite } from "./types";


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

function getRowValues(values: (number | string)[]): string {
    var result = "";

    values.forEach((value) => result += `\t${typeof(value) === "string" ? value : formatNumberToString(value)}`);

    return result;
}

function getTypeName(node: Node): string {
    if (IsEndSite(node)) {
        return "End Site";
    }

    return node.type.toUpperCase();
}

function nodeToString(node: Node, level: number = 0): string {
    let result = "";
    let tabs = "\t".repeat(level);
    let typeName = getTypeName(node);

    result += `${tabs}${typeName} ${!IsEndSite(node) ? node.name : ""}\n`;
    result += `${tabs}{\n`;
    result += `${tabs}\tOFFSET${getRowValues(node.offset)}\n`;

    if (IsJoint(node) || IsRoot(node)) {
        result += `${tabs}\tCHANNELS ${node.channels.length} ${node.channels.join(" ")}\n`;
        result += node.children.map(child => nodeToString(child, level + 1)).join();
    }

    result += `${tabs}}\n`;

    return result;
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
            if (!context.root) {
                throw new Error("Hierarchy is not provided");
            }

            return `HIERARCHY\n${nodeToString(context.root, 0)}`;
        },
    };
}
