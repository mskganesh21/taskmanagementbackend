import Category from '../models/CategoryModel.js';
import { Capitalise } from '../utils/convertString.js';

const CreateCategory = async (req, res) => {
    try {
      console.log("hello this is the category route")
      const { category } = req.body;
      const convertedCategory = Capitalise(category);
      console.log(convertedCategory, "hhh");
  
      // Check if the category already exists
      const existingCategory = await Category.findOne({category: convertedCategory} );

      console.log(existingCategory, "llll");
  
      if (!existingCategory) {
        // Create a new category
        const newCategory = await Category.create({
          category: convertedCategory,
        });
  
        console.log(newCategory, "iii");
  
        return res.status(201).json({
          error: false,
          success: true,
          data: newCategory,
        });
      } else {
        return res.status(400).json({
          error: true,
          success: false,
          data: "Category already exists",
        });
      }
    } catch (error) {
      console.error(error);
  
      return res.status(500).json({
        error: true,
        success: false,
        data: "Internal server error",
      });
    }
  };
  


const GetAllCategories = async (req, res) => {
    try {
      // Find all categories
      const categories = await Category.find({}, { category: 1, _id: 0 });
  
      if (categories.length === 0) {
        return res.status(200).json({
          error: false,
          success: true,
          data: "No categories found",
        });
      }
  
      return res.status(200).json({
        error: false,
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: true,
        success: false,
        data: "Internal server error",
      });
    }
  };


  const GetCategory = async (req, res) => {
    try {
      const { category } = req.params;
      const CapitalisedCategory = Capitalise(category);
  
      // Query the database for the category by name
      const response = await Category.findOne({ category: CapitalisedCategory });
  
      if (!response) {
        return res.status(404).json({
          error: true,
          success: false,
          data: 'Category not found',
        });
      }
  
      return res.status(200).json({
        error: false,
        success: true,
        data: response,
      });
    } catch (error) {
      console.error(error);
  
      return res.status(500).json({
        error: true,
        success: false,
        data: 'Internal server error',
      });
    }
  };


export {CreateCategory,GetAllCategories,GetCategory};