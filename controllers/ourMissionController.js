import OurMission from "../models/OurMission.js";

export const createMission = async (req, res) => {
  try {
    const {
      description,
      yearsOfExperience,
      happyCustomers,
      productsAvailable,
      customerSatisfaction,
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const mission = new OurMission({
      description,
      yearsOfExperience,
      happyCustomers,
      productsAvailable,
      customerSatisfaction,
      image,
    });

    await mission.save();
    res.status(201).json(mission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllMissions = async (req, res) => {
  try {
    const missions = await OurMission.find().sort({ createdAt: -1 });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMissionById = async (req, res) => {
  try {
    const mission = await OurMission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: "Not found" });
    res.json(mission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMission = async (req, res) => {
  try {
    const {
      description,
      yearsOfExperience,
      happyCustomers,
      productsAvailable,
      customerSatisfaction,
    } = req.body;

    const updatedData = {
      description,
      yearsOfExperience,
      happyCustomers,
      productsAvailable,
      customerSatisfaction,
    };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const mission = await OurMission.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(mission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMission = async (req, res) => {
  try {
    await OurMission.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
