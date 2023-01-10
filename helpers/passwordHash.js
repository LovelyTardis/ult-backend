import bcryptjs from "bcryptjs";

export const passwordHash = (password) => {
  const salt = bcryptjs.genSaltSync();
  return bcryptjs.hashSync(password, salt);
};

export const passwordVerify = (password, hashedPassword) => {
  return bcryptjs.compareSync(password, hashedPassword);
};
