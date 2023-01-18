import jwt from "jsonwebtoken";

export const generateJwt = async (uid = "") => {
  const payload = { uid };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(`JsonWebToken could not be generated.\nERROR: ${err}`);
        } else resolve(token);
      }
    );
  });
};
