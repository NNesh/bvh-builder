import { Builder, BuilderContext, IsRoot, Root } from "./types";


export interface HeaderBuilder extends Builder<string> {
    setHierarchy(root: Root): void;
}

export default function getHeaderBuilder(context: BuilderContext): HeaderBuilder {
    return {
        setHierarchy(root: Root): void {
            if (!IsRoot(root)) {
                throw new Error("Top node should be a root");
            }

            if (context.motion) {
                throw new Error("Changing the hierarchy is not allowed after motion creating");
            }

            context.root = root;
        },
        build(): string {
            return "";
        },
    };
}
