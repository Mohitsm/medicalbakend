import express from "express";
import {
  createContact,
  getAllContacts,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);        // POST /api/contacts
router.get("/", getAllContacts);        // GET /api/contacts
router.delete("/:id", deleteContact);   // DELETE /api/contacts/:id

export default router;
