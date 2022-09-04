import assert from 'assert';
import { describe } from 'mocha';
import BVHBuilder from './';

describe('Builder', () => {
    it('can create a builder', () => {
        const builder = new BVHBuilder();
        assert.notEqual(builder, null);
    })
});
