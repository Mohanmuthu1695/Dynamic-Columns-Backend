const express=require("express");
const{addSchema,getSchema,getID}=require("../controllers/jsonSchema")
const router=express.Router();

router.post("/add",addSchema);
router.get("/get/:id", getSchema);
router.get("/getID",getID);

module.exports=router;