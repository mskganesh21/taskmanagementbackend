import axios from "axios";
import mongoose from "mongoose";
import Task from "../models/TaskModel.js";
import { validateTitle, validateDeadLine } from "../utils/validations.js";
import Category from "../models/CategoryModel.js";
import Priority from "../models/PriorityModel.js";
import { CreateCategory } from "../controller/CategoryController.js";
import { CreatePriority } from "../controller/PriorityController.js";
import User from "../models/UserModel.js";
import { Capitalise } from "../utils/convertString.js";
import { GetData } from "../utils/getData.js";


const CreateTask = async (req, res) => {
  const { title, description, category, deadline, priority } = req.body;
  const userId = req.authdata;

  try {
    // Validate title, deadline, category, and priority
    const isValidTitle = validateTitle(title);
    const isValidDeadLine = validateDeadLine(deadline);

    if (!isValidTitle || !isValidDeadLine) {
      return res.status(422).json({
        error: true,
        success: false,
        data: "Invalid title or deadline",
      });
    }

    // Capitalize category and priority
    const capitalisedCategory = Capitalise(category);
    const capitalisedPriority = Capitalise(priority);

    // Find or create category
    let createdCategory;
    const categoryResponse = await GetData(
      `http://localhost:8082/api/category/getcategory/${capitalisedCategory}`,
      "get"
    );

    if (categoryResponse.status === 404) {
      const createCategoryResponse = await GetData(
        `http://localhost:8082/api/category/createcategory`,
        "post",
        {
          category: capitalisedCategory,
        }
      );

      if (createCategoryResponse.status === 201) {
        createdCategory = createCategoryResponse.data._id;
      } else if (createCategoryResponse.status === 400) {
        return res.status(400).json({
          error: true,
          success: false,
          data: "Error creating category",
        });
      } else if (createCategoryResponse.status === 500) {
        return res.status(500).json({
          error: true,
          success: false,
          data: "Error creating category. Please try again later",
        });
      }
    } else if (categoryResponse.status === 200) {
      createdCategory = categoryResponse.data._id;
    } else if (categoryResponse.status === 500) {
      return res.status(500).json({
        error: true,
        success: false,
        data: "Error fetching category data. Please try again later",
      });
    }

    // Find or create priority
    let createdPriority;
    const priorityResponse = await GetData(
      `http://localhost:8082/api/priority/getpriority/${capitalisedPriority}`,
      "get"
    );

    if (priorityResponse.status === 200) {
      createdPriority = priorityResponse.data._id;
    } else if (priorityResponse.status === 404) {
      const createPriorityResponse = await GetData(
        `http://localhost:8082/api/priority/createpriority`,
        "post",
        {
          priority: capitalisedPriority,
        }
      );

      if (createPriorityResponse.status === 201) {
        createdPriority = createPriorityResponse.data._id;
      } else if (createPriorityResponse.status === 400) {
        return res.status(400).json({
          error: true,
          success: false,
          data: "Error creating priority",
        });
      } else if (createPriorityResponse.status === 500) {
        return res.status(500).json({
          error: true,
          success: false,
          data: "Error creating priority. Please try again later",
        });
      }
    } else if (priorityResponse.status === 500) {
      return res.status(500).json({
        error: true,
        success: false,
        data: "Error fetching priority data. Please try again later",
      });
    }

    // Create a new task
    const creatingANewTask = await Task.create({
      user: userId,
      title,
      description,
      deadline,
      priority: createdPriority,
      category: createdCategory,
    });

    return res.status(201).json({
      error: false,
      success: true,
      data: creatingANewTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      success: false,
      data: "Internal Server Error",
    });
  }
};

const EditTask = async (req, res) => {
  const userId = req.authdata;
  const {taskId} = req.params;
  const {title,description,deadline,category,priority,completed} = req.body;
  console.log(req.body, "reqbody")

  //find if the user is the same as the one who created it
  try {
    console.log("Before");
    const oldtask = await Task.findOne({ _id: taskId });
    if(!oldtask){
      return res.status(404).json({
        error:true, 
        successfalse,
        data: "No Such Task Found"
      })
    }

    console.log(oldtask, "oldtask");

    const author = oldtask.user.toString() === userId.toString();
    console.log(oldtask.user.toString(), "useridfromdb");
    console.log(userId.toString(), "userIdfromrequest");
    console.log(author, "author");
    
    if(!author){
      return res.status(401).json({
        error:true,
        success:false,
        data: "Unauthorised to edit Task"
      })
    }

     // Validate title, deadline, category, and priority
     const isValidTitle = validateTitle(title);
     const isValidDeadLine = validateDeadLine(deadline);
 
     if (!isValidTitle || !isValidDeadLine) {
       return res.status(422).json({
         error: true,
         success: false,
         data: "Invalid title or deadline",
       });
     }
 
     // Capitalize category and priority
     const capitalisedCategory = Capitalise(category);
     const capitalisedPriority = Capitalise(priority);
 
     // Find or create category
     let createdCategory;
     const categoryResponse = await GetData(
       `http://localhost:8082/api/category/getcategory/${capitalisedCategory}`,
       "get"
     );
 
     if (categoryResponse.status === 404) {
       const createCategoryResponse = await GetData(
         `http://localhost:8082/api/category/createcategory`,
         "post",
         {
           category: capitalisedCategory,
         }
       );
 
       if (createCategoryResponse.status === 201) {
         createdCategory = createCategoryResponse.data._id;
       } else if (createCategoryResponse.status === 400) {
         return res.status(400).json({
           error: true,
           success: false,
           data: "Error creating category",
         });
       } else if (createCategoryResponse.status === 500) {
         return res.status(500).json({
           error: true,
           success: false,
           data: "Error creating category. Please try again later",
         });
       }
     } else if (categoryResponse.status === 200) {
       createdCategory = categoryResponse.data._id;
     } else if (categoryResponse.status === 500) {
       return res.status(500).json({
         error: true,
         success: false,
         data: "Error fetching category data. Please try again later",
       });
     }
 
     // Find or create priority
     let createdPriority;
     const priorityResponse = await GetData(
       `http://localhost:8082/api/priority/getpriority/${capitalisedPriority}`,
       "get"
     );
 
     if (priorityResponse.status === 200) {
       createdPriority = priorityResponse.data._id;
     } else if (priorityResponse.status === 404) {
       const createPriorityResponse = await GetData(
         `http://localhost:8082/api/priority/createpriority`,
         "post",
         {
           priority: capitalisedPriority,
         }
       );
 
       if (createPriorityResponse.status === 201) {
         createdPriority = createPriorityResponse.data._id;
       } else if (createPriorityResponse.status === 400) {
         return res.status(400).json({
           error: true,
           success: false,
           data: "Error creating priority",
         });
       } else if (createPriorityResponse.status === 500) {
         return res.status(500).json({
           error: true,
           success: false,
           data: "Error creating priority. Please try again later",
         });
       }
     } else if (priorityResponse.status === 500) {
       return res.status(500).json({
         error: true,
         success: false,
         data: "Error fetching priority data. Please try again later",
       });
     }

     //now update the task 
     const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description,deadline, category:createdCategory,priority:createdPriority,completed},
      { new: true } 
    );
    
    if (updatedTask) {
      return res.status(200).json({
        error: false,
        success: true,
        data: updatedTask
      });
    } else {
      return res.status(404).json({
        error: true,
        success: false,
        data: "Task not found"
      });
    }
  } catch (error) {
    return res.status(500).json({
      error:true,
      success:false,
      data: 'Internal Server Error' 
    })
  }
};

const DeleteTask = async (req, res) => {
  const {userId} = req.authdata;
  const {taskId} = req.params;
  try {
    const oldtask = await Task.findOne({ _id: taskId });
    if (!oldtask) {
      return res.status(404).json({
        error: true,
        success: false,
        data: "No Such Task Found"
      });
    }

    const author = oldtask.user.toString() === userId.toString();

    if (!author) {
      return res.status(401).json({
        error: true,
        success: false,
        data: "Unauthorized to delete Task"
      });
    }

    // Proceed to delete the task
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (deletedTask) {
      return res.status(200).json({
        error: false,
        success: true,
        data: deletedTask,
        message: "Task deleted successfully"
      });
    } else {
      return res.status(404).json({
        error: true,
        success: false,
        data: "Task not found"
      });
    }
  } catch (error) {
    console.error("Error in DeleteTask:", error);
    return res.status(500).json({
      error: true,
      success: false,
      data: 'Internal Server Error'
    });
  }
};

const GetAllTasks = async (req, res) => {
  try {
    const response = await Task.find({}, { _id: 0, title: 1, description: 1 });
    if (response.length > 0) {
      return res.status(200).json({
        error: false,
        success: true,
        data: response,
      });
    } else {
      return res.status(200).json({
        error: false,
        success: true,
        data: "There are no tasks",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      data: "Internal Server Error",
    });
  }
};

const GetTasks = async (req, res) => {
  // get all tasks of a user
  const  userId  = req.authdata;
  console.log(userId, "userId");

  try {
    const response = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "priorities",
          localField: "priority",
          foreignField: "_id",
          as: "priorityDetails",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          category: { $arrayElemAt: ["$categoryDetails.category", 0] },
          priority: { $arrayElemAt: ["$priorityDetails.priority", 0] },
          deadline: 1,
          completed: 1,
        },
      },
    ]);

    console.log(response, "gettaskresponse");

    if (response.length > 0) {
      return res.status(200).json({
        error: false,
        success: true,
        data: response,
      });
    } else {
      return res.status(200).json({
        error: false,
        success: true,
        data: "No tasks found for the user",
      });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error); // Log the error for debugging
    return res.status(500).json({
      error: true,
      success: false,
      data: "Internal Server Error",
    });
  }
};

const GetDeadlinePassedTasks = async (req, res) => {
  try {
    const response = await Task.find({ deadline: { $lt: Date.now() } });
    if (response.length > 0) {
      return res.status(200).json({
        error: false,
        success: true,
        data: response,
      });
    } else {
      return res.status(200).json({
        error: false,
        success: true,
        data: "No expired Tasks",
      });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error); // Log the error for debugging
    return res.status(500).json({
      error: true,
      success: false,
      data: "Internal Server Error",
    });
  }
};

const GetDeadlinePassedTasksOfAUser = async (req, res) => {
  const userId = req.params;
  try {
    const response = await Task.find({
      user: userId,
      deadline: { $lt: Date.now() },
    });
    if (response.length > 0) {
      return res.status(200).json({
        error: false,
        success: true,
        data: response,
      });
    } else {
      return res.status(200).json({
        error: false,
        success: true,
        data: "No expired Tasks",
      });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error); // Log the error for debugging
    return res.status(500).json({
      error: true,
      success: false,
      data: "Internal Server Error",
    });
  }
};

export {
  CreateTask,
  EditTask,
  DeleteTask,
  GetAllTasks,
  GetTasks,
  GetDeadlinePassedTasks,
  GetDeadlinePassedTasksOfAUser,
};
