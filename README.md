# BVH Builder

## Description
This is a NPM module to build BVH (BioVision Hierarchy). This module convert JSON to BVH format.

## Basic usage
```
const builder = getBVHBuilder();

builder
    .header()
    .setHierarchy({
        type: "root",
        name: "Hip",
        offset: { x: 0, y: 0, z: 0 },
        channels: ["Xposition", "Yposition", "Zposition", "Zrotation", "Xrotation", "Yrotation"],
        children: [
            {
                type: "joint",
                name: "Leg",
                offset: { x: 1, y: 2, z: -1 },
                channels: ["Zrotation", "Xrotation", "Yrotation"],
                children: [
                    {
                        type: "end-site",
                        name: "",
                        offset: { x: 0, y: 5, z: 0 },
                        channels: [],
                    }
                ],
            },
        ],
    });

builder.motion().init(0.013);
builder.motion().addFrame({
    values: [0, 1, -2, 0, 1, -2, 0, 0, 0],
});

const output = builder.build();

```
