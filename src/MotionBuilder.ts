import { formatNumberToString } from "./helpers";
import { Builder, BuilderContext, Frame } from "./types";

const ERR_INIT_MSG = "Motion is not initialized. Please, call the 'init' method to initialize it.";

export interface MotionBuilder extends Builder<string> {
    init(period: number): MotionBuilder;
    addFrame(frame: Frame): MotionBuilder;
}

export default function getMotionBuilder(context: BuilderContext): MotionBuilder {
    return {
        init(period: number): MotionBuilder {
            if (context.motion) {
                throw new Error("Motion context has been already initialized");
            }

            context.motion = {
                period,
            };

            return this;
        },
        addFrame(frame: Frame): MotionBuilder {
            if (!context.motion) {
                throw new Error(ERR_INIT_MSG);
            }

            if (!context.motion.frames) {
                context.motion.frames = [];
            }

            if (frame.values.length !== context.channelCount) {
                throw new Error("Frame values count is not equal counted number of channels from the header");
            }

            frame.values.forEach((value) => {
                if (typeof(value) !== "number") {
                    throw new Error("Value in the motion frame should be a number");
                }
            });

            context.motion.frames.push(frame);

            return this;
        },
        build(): string {
            if (!context.motion) {
                throw new Error(ERR_INIT_MSG);
            }

            if (!context.motion.frames) {
                throw new Error("There are no frames to build a motion part")
            }

            let result = `MOTION\nFrames: ${context.motion.frames.length}\nFrame Time: ${context.motion.period.toFixed(4)}\n`;

            context.motion.frames.forEach((frame) => {
                result += frame.values.map((value) => {
                    return `${formatNumberToString(value)}\t`;
                }).join("") + "\n";
            });

            return result;
        },
    };
}
