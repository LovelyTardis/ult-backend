import { request, response } from "express";

import { User } from "../models/index.js";

import { passwordHash } from "../helpers/index.js";
import { Create } from "../database/helpers/index.js";

export const getUser = async (req = request, res = response) => {
  const { user } = req;

  return res.json({
    code: 200,
    error: false,
    data: {
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      ults: user.ults,
      likedUlts: user.likedUlts,
    },
  });
};

export const createUser = async (req = request, res = response) => {
  const { email, password, name, username, profilePicture = "" } = req.body;

  const hashedPassword = passwordHash(password);

  // profilePicture must be given as a string from the front-end

  const dataToSave = {
    email,
    password: hashedPassword,
    name,
    username,
    profilePicture,
  };

  const created = await Create(User, dataToSave);

  res.status(201).json({
    code: 201,
    error: false,
    data: created,
  });
};

export const loginUser = async () => {
  res.status(501).json({
    code: 501,
    error: true,
    data: "Not implemented - login user",
  });
};
