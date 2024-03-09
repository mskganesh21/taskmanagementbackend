import Priority from '../models/PriorityModel.js';
import { Capitalise } from '../utils/convertString.js';


const CreatePriority = async (req, res) => {
    try {
      // Create priority
      const { priority } = req.body;
      console.log(priority, "aaa");
      const convertedPriority = Capitalise(priority);
  
      // Check if the priority already exists
      const existingPriority = await Priority.findOne({ priority: convertedPriority });
  
      if (!existingPriority) {
        // Create a new priority
        const newPriority = await Priority.create({
          priority: convertedPriority,
        });
  
        console.log(newPriority, "iii");
  
        return res.status(201).json({
          error: false,
          success: true,
          data: newPriority,
        });
      } else {
        return res.status(400).json({
          error: true,
          success: false,
          data: "Priority already exists",
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
  

const GetAllPriorities = async (req, res) => {
    try {
      const Priorities = await Priority.find({}, { priority: 1, _id: 0 });
  
      if (Priorities.length === 0) {
        return res.status(200).json({
          error: false,
          success: true,
          data: "No priorities found",
        });
      }
  
      return res.status(200).json({
        error: false,
        success: true,
        data: Priorities,
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
  

 const GetPriority = async (req,res) => {
  try {
    const {priority} = req.params;
    const CapitalisedPriority = Capitalise(priority);

    const response = await Priority.findOne({priority: CapitalisedPriority});
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


export {CreatePriority,GetAllPriorities, GetPriority};