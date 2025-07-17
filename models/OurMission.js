import mongoose from "mongoose";

const OurMissionSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    happyCustomers: { type: Number, required: true },
    productsAvailable: { type: Number, required: true },
    customerSatisfaction: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("OurMission", OurMissionSchema);
