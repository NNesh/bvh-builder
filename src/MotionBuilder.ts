import { Builder, BuilderContext, Frame } from "./types";

const ERR_INIT_MSG = "Motion is not initialized. Please, call the 'init' method to initialize it.";

export interface MotionBuilder extends Builder<string> {
    init(period: number): void;
    addFrame(frame: Frame): void;
}

export default function getMotionBuilder(context: BuilderContext): MotionBuilder {
    return {
        init(period: number): void {
            if (context.motion) {
                throw new Error("Motion context has been already initialized");
            }

            context.motion = {
                period,
            };
        },
        addFrame(frame: Frame): void {
            if (!context.motion) {
                throw new Error(ERR_INIT_MSG);
            }

            if (!context.motion.frames) {
                context.motion.frames = [];
            }

            context.motion.frames.push(frame);
        },
        build(): string {
            if (!context.motion) {
                throw new Error(ERR_INIT_MSG);
            }

            return "";
        },
    };
}
