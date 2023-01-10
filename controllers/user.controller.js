import { request, response } from "express";

import { User } from "../models/index.js";
import { passwordHash, passwordVerify } from "../helpers/passwordHash.js";

export const getUser = async (req = request, res = response) => {
  return res.status(501).json({ error: true, data: "Not implemented" });
};

export const createUser = async (req = request, res = response) => {
  const { email, password, name, username, profilePicture = "" } = req.body;

  // hash password using bcryptjs
  const hashedPassword = passwordHash(password);

  // profilePicture must be given as a string from the front-end

  const newUser = new User({
    email,
    password: hashedPassword,
    name,
    username,
    profilePicture,
  });

  const created = await newUser.save();

  res.status(201).json({
    error: false,
    data: created,
  });
};
