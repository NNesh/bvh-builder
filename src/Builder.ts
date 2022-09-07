import getHeaderBuilder, { HeaderBuilder } from "./HeaderBuilder";
import getMotionBuilder, { MotionBuilder } from "./MotionBuilder";
import { Builder, BuilderContext } from "./types";


export interface BVHBuilder extends Builder<string> {
    motion: () => MotionBuilder;
    header: () => HeaderBuilder;
}

export default function getBVHBuilder(): BVHBuilder {
    const context: BuilderContext = {};

    const headerBuilder = getHeaderBuilder(context);
    const motionBuilder = getMotionBuilder(context);

    return {
        header(): HeaderBuilder {
            return headerBuilder;
        },
        motion(): MotionBuilder {
            if (!context.root) {
                throw new Error("To make motion part you have to define a hierarchy in the header");
            }

            return motionBuilder;
        },
        build(): string {
            return headerBuilder.build() + "\n" + motionBuilder.build();
        },
    };
}
