const express=require("express");
const{addUser,getUsers}=require("../controllers/userDetails");
const router=express.Router();


router.post("/add",addUser);
router.get("/get/:tableName",getUsers);

module.exports=router;