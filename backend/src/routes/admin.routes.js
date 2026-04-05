import { Router } from "express";
import { 
        getProfile,
        handleProfile,
        updateEmployee,
        getManageEmployees,
        addEmployee,
        deleteEmployee
    } from "../controllers/admin.controller.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const adminRouter=Router()
adminRouter.get("/profile",
    verifyJwt,
    getProfile
)
adminRouter.post("/profile",
    verifyJwt,
     upload.fields([
    { name: "profilePhoto", maxCount: 1 }
     ]),
    handleProfile
)
adminRouter.post("/add-employee",
    verifyJwt,
    addEmployee
)

adminRouter.patch("/update-employee",
    verifyJwt,
    updateEmployee
)

adminRouter.get("/manage-employee",
    verifyJwt,
    getManageEmployees
)
adminRouter.delete("/employee/:id",
    verifyJwt,
    deleteEmployee
)

export default adminRouter