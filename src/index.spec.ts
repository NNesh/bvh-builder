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

        it("null is not allowed", () => {
            assert.throws(() => {
                // @ts-ignore
                builder.header().setHierarchy(null);
            });
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
        before(() => {
            builder = getBVHBuilder();
        })

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

    describe("Hierarchy checking", () => {
        before(() => {
            builder = getBVHBuilder();
        });

        it("offset and channels matching is acceptable", () => {
            assert.doesNotThrow(() => {
                builder.header().setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: [1, 2],
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "end-site",
                            name: "",
                            offset: [1, 2],
                            channels: [],
                        }
                    ],
                });
            });
        });

        it("0 children is not allowed for joints", () => {
            assert.throws(() => {
                builder.header().setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: [1, 2],
                    channels: ["Xrotation", "Yrotation"],
                    children: [],
                });
            });
        });

        it("offset and channels mismatching is not allowed", () => {
            assert.throws(() => {
                builder.header().setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: [1, 2],
                    channels: ["Xposition"],
                    children: [
                        {
                            type: "end-site",
                            name: "",
                            offset: [1, 2],
                            channels: [],
                        }
                    ],
                });
            });
        });

        it("empty name is not allowed for joints", () => {
            assert.throws(() => {
                builder.header().setHierarchy({
                    type: "root",
                    name: "",
                    offset: [1, 2],
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "end-site",
                            name: "",
                            offset: [1, 2],
                            channels: [],
                        }
                    ],
                });
            });
        });

        it("root-joint-endsite is acceptable", () => {
            assert.doesNotThrow(() => {
                builder.header().setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: [1, 2],
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "joint",
                            name: "Leg",
                            offset: [1, 2],
                            channels: ["Xrotation", "Xrotation"],
                            children: [
                                {
                                    type: "end-site",
                                    name: "",
                                    offset: [1, 2],
                                    channels: [],
                                }
                            ],
                        },
                    ],
                });
            });
        });

        it("haveing end-site and other joints together is not acceptable", () => {
            assert.throws(() => {
                builder.header().setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: [1, 2],
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "joint",
                            name: "Hip",
                            offset: [1, 2],
                            channels: ["Xrotation", "Xrotation"],
                            children: [
                                {
                                    type: "end-site",
                                    name: "",
                                    offset: [1, 2],
                                    channels: [],
                                },
                                {
                                    type: "joint",
                                    name: "Knee",
                                    offset: [5, 5],
                                    channels: ["Xrotation", "Xrotation"],
                                    children: [
                                        {
                                            type: "end-site",
                                            name: "",
                                            offset: [0.5, 0.5],
                                            channels: [],
                                        }
                                    ],
                                },
                            ],
                        },
                    ],
                });
            });
        });

    });
});
