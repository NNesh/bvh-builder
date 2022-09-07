import assert from "assert";
import { describe } from "mocha";
import getBVHBuilder, { BVHBuilder } from "./Builder";


describe("Builder", () => {
    let builder: BVHBuilder = getBVHBuilder();

    it("can create a builder", () => {
        assert.notEqual(builder, null);
    });

    describe("Header initializing", () => {    
        it("can return the motion builder without root", () => {
            assert.throws(builder.motion);
        });
    
        it("cannot accept a different type of the node on top of the hierarchy", () => {
            assert.throws(() => {
                builder.header().setHierarchy({
                    // @ts-ignore
                    type: "joint",
                    name: "Test root",
                    channels: [],
                    offset: [],
                    children: [],
                })
            });
        });
    })

    describe("Motion initializing", () => {
        it("cannot accept to add a frame without motion initializing", () => {
            assert.throws(() => builder.motion().addFrame({
                values: [0, 1],
            }));
        });

        it("cannot accept to build a motion part without motion initializing", () => {
            assert.throws(() => builder.motion().build());
        });

        it("initializing without a hierarchy is not allowed", () => {
            assert.throws(() => builder.motion().init(0.1));
        })
    });
});
