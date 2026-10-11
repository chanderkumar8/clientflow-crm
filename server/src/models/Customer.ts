
import mongoose, {
  Schema,
  type Document,
  type Types,
} from "mongoose";

export interface ICustomer extends Document {
  owner: Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: "lead" | "active" | "inactive";
  notes?: string;
}

const customerSchema = new Schema<ICustomer>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    company: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    status: {
      type: String,
      enum: ["lead", "active", "inactive"],
      default: "lead",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

// Improve customer list sorting by user.
customerSchema.index({ owner: 1, createdAt: -1 });

const Customer = mongoose.model<ICustomer>(
  "Customer",
  customerSchema
);

export default Customer;
