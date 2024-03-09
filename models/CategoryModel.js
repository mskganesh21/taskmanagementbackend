import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: {
        type:String,
        required: true,
        unique:true,
    }
},
{
    // this keeps a track of the createdAt and updateAt timestamps
    timestamps: true,
});

const Category = new mongoose.model("category", categorySchema);

export default Category;
