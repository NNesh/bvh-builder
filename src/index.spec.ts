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
                    offset: { x: 0, y: 0, z: 0 },
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

        it("0 children is not allowed for joints", () => {
            assert.throws(() => {
                builder.header().setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: { x: 0, y: 0, z: 0 },
                    channels: ["Xrotation", "Yrotation"],
                    children: [],
                });
            });
        });

        it("empty name is not allowed for joints", () => {
            assert.throws(() => {
                builder.header().setHierarchy({
                    type: "root",
                    name: "",
                    offset: { x: 0, y: 0, z: 0 },
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "end-site",
                            name: "",
                            offset: { x: 0, y: 0, z: 0 },
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
                    offset: { x: 0, y: 0, z: 0 },
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "joint",
                            name: "Leg",
                            offset: { x: 0, y: 0, z: 0 },
                            channels: ["Xrotation", "Xrotation"],
                            children: [
                                {
                                    type: "end-site",
                                    name: "",
                                    offset: { x: 0, y: 0, z: 0 },
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
                    offset: { x: 0, y: 0, z: 0 },
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "joint",
                            name: "Hip",
                            offset: { x: 0, y: 0, z: 0 },
                            channels: ["Xrotation", "Xrotation"],
                            children: [
                                {
                                    type: "end-site",
                                    name: "",
                                    offset: { x: 0, y: 0, z: 0 },
                                    channels: [],
                                },
                                {
                                    type: "joint",
                                    name: "Knee",
                                    offset: { x: 0, y: 0, z: 0 },
                                    channels: ["Xrotation", "Xrotation"],
                                    children: [
                                        {
                                            type: "end-site",
                                            name: "",
                                            offset: { x: 0, y: 0, z: 0 },
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

        it("build is matching", () => {
            builder
                .header()
                .setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: { x: 1, y: 2, z: 1 },
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "joint",
                            name: "Leg",
                            offset: { x: 1, y: 2, z: 1 },
                            channels: ["Xrotation", "Xrotation"],
                            children: [
                                {
                                    type: "end-site",
                                    name: "",
                                    offset: { x: 1, y: 2, z: -1 },
                                    channels: [],
                                }
                            ],
                        },
                    ],
                });

            const expectingResult = "HIERARCHY\nROOT Root\n{\n\tOFFSET\t 1.00\t 2.00\t 1.00\n\tCHANNELS 2 Xrotation Xrotation\n\tJOINT Leg\n\t{\n\t\tOFFSET\t 1.00\t 2.00\t 1.00\n\t\tCHANNELS 2 Xrotation Xrotation\n\t\tEnd Site \n\t\t{\n\t\t\tOFFSET\t 1.00\t 2.00\t-1.00\n\t\t}\n\t}\n}\n";

            assert.equal(builder.header().build(), expectingResult);
        });

        it("adding wrong motion frame is not allowed", () => {
            builder
                .header()
                .setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: { x: 1, y: 2, z: 1 },
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "joint",
                            name: "Leg",
                            offset: { x: 1, y: 2, z: 1 },
                            channels: ["Xrotation", "Xrotation"],
                            children: [
                                {
                                    type: "end-site",
                                    name: "",
                                    offset: { x: 1, y: 2, z: -1 },
                                    channels: [],
                                }
                            ],
                        },
                    ],
                });

            assert.throws(() => {
                builder.motion().init(0.013);
                builder.motion().addFrame({
                    values: [0, 1, -2],
                });
            });
        });

        it("adding correct motion frame is allowed", () => {
            assert.doesNotThrow(() => {
                builder.motion().addFrame({
                    values: [0, 1, -2, 0],
                });
            });
        });
    });

    describe("Motion adding", () => {
        before(() => {
            builder = getBVHBuilder();

            builder
                .header()
                .setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: { x: 1, y: 2, z: 1 },
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "joint",
                            name: "Leg",
                            offset: { x: 1, y: 2, z: 1 },
                            channels: ["Xrotation", "Xrotation"],
                            children: [
                                {
                                    type: "end-site",
                                    name: "",
                                    offset: { x: 1, y: 2, z: -1 },
                                    channels: [],
                                }
                            ],
                        },
                    ],
                });
            builder.motion().init(0.013);
        })

        it("adding motion frame with wrong length is not allowed", () => {
            assert.throws(() => {
                builder.motion().addFrame({
                    values: [0, 1, -2],
                });
            });
        });

        it("adding wrong motion frame is not allowed", () => {
            assert.throws(() => {
                builder.motion().addFrame({
                    // @ts-ignore
                    values: [0, 1, 0, "hello"],
                });
            });
        });

        it("adding correct motion frame is allowed", () => {
            assert.doesNotThrow(() => {
                builder.motion().addFrame({
                    values: [0, 1, -2, 0],
                });
            });
        });

        it("motion part is matched", () => {
            const expectingMotion = "HIERARCHY\nROOT Root\n{\n\tOFFSET\t 1.00\t 2.00\t 1.00\n\tCHANNELS 2 Xrotation Xrotation\n\tJOINT Leg\n\t{\n\t\tOFFSET\t 1.00\t 2.00\t 1.00\n\t\tCHANNELS 2 Xrotation Xrotation\n\t\tEnd Site \n\t\t{\n\t\t\tOFFSET\t 1.00\t 2.00\t-1.00\n\t\t}\n\t}\n}\nMOTION\nFrames: 1\nFrame Time: 0.0130\n 0.00\t 1.00\t-2.00\t 0.00\t\n";
            const actual = builder.build();

            assert.equal(actual, expectingMotion);
        });
    });

    describe("BVH building", () => {
        before(() => {
            builder = getBVHBuilder();

            builder
                .header()
                .setHierarchy({
                    type: "root",
                    name: "Root",
                    offset: { x: 1, y: 2, z: 1 },
                    channels: ["Xrotation", "Xrotation"],
                    children: [
                        {
                            type: "joint",
                            name: "Leg",
                            offset: { x: 1, y: 2, z: 1 },
                            channels: ["Xrotation", "Xrotation"],
                            children: [
                                {
                                    type: "end-site",
                                    name: "",
                                    offset: { x: 1, y: 2, z: -1 },
                                    channels: [],
                                }
                            ],
                        },
                    ],
                });
            builder.motion().init(0.013);
            builder.motion().addFrame({
                values: [0, 1, -2, 0],
            });
        })

        it("bvh is matched", () => {
            const expectingMotion = "MOTION\nFrames: 1\nFrame Time: 0.0130\n 0.00\t 1.00\t-2.00\t 0.00\t\n";
            const actual = builder.motion().build();

            assert.equal(actual, expectingMotion);
        });
    });
});
