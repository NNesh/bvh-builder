const fs = require("fs");
const getBVHBuilder = require("../lib").default;

const builder = getBVHBuilder();

builder
    .header()
    .setHierarchy({
        type: "root",
        name: "Root",
        offset: { x: 1, y: 2, z: 1 },
        channels: ["Xposition", "Yposition", "Zposition", "Zrotation", "Xrotation", "Yrotation"],
        children: [
            {
                type: "joint",
                name: "Leg",
                offset: { x: 1, y: 2, z: 1 },
                channels: ["Zrotation", "Xrotation", "Yrotation"],
                children: [
                    {
                        type: "end-site",
                        offset: { x: 1, y: 2, z: -1 },
                    }
                ],
            },
        ],
    });
builder.motion()
    .init(0.013)
    .addFrame({
        values: [0, 1, -2, 0, 1, -2, 0, 0, 0],
    });


fs.writeFile("out.bvh", builder.build(), (err) => {
    if (err) {
        return console.error(err);
    }

    console.log("out.bvh file has been created");
});
