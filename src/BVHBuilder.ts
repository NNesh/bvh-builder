import BVHHeaderBuilder from './BVHHeaderBuilder';
import BVHMotionBuilder from './BVHMotionBuilder';
import { Builder } from './types';


export default class BVHBuilder implements Builder<string> {
    private headerBuilder = new BVHHeaderBuilder();

    private motionBuilder = new BVHMotionBuilder();


    header(): BVHHeaderBuilder {
        return this.headerBuilder;
    }

    motion(): BVHMotionBuilder {
        return this.motionBuilder;
    }

    build(): string {
        throw new Error('Method not implemented.');
    }
}
