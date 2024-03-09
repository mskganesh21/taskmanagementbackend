import bcryptjs from "bcryptjs";

export const CreateHash = async (str) => {
  const salt = await bcryptjs.genSalt(10);
  const hashedString = await bcryptjs.hash(str, salt);
  return hashedString;
};
