import { model } from "mongoose";
import { UserSchema } from "./userModel";


import { EventSchema } from "./allSchemas";

export const models = {
  User: model("User", UserSchema),
 
  Event: model("Events", EventSchema),
};
