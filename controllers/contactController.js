import Contact from "../models/contactModel.js";

// Create Contact
export const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const saved = await contact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to submit contact form", details: err.message });
  }
};

// Get All Contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

// Delete Contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
};
