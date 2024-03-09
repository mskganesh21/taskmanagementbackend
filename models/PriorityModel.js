import mongoose from "mongoose";

const prioritySchema = new mongoose.Schema({
    priority: {
        type:String,
        required: true,
        unique:true,
    }
},
{
    // this keeps a track of the createdAt and updateAt timestamps
    timestamps: true,
});

const Priority = new mongoose.model("priority", prioritySchema);

export default Priority;
