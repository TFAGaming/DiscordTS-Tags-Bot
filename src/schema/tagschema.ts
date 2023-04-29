import { model, Schema } from "mongoose";

export default model('TagSchema',
    new Schema({
        name: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        visibility: {
            type: String,
            required: true
        },
        createdAt: {
            type: Number,
            required: true
        }
    })
);