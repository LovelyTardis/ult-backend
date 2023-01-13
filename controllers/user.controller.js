import { request, response } from "express";

import { UserModel } from "../models/index.js";

import { passwordHash, passwordVerify } from "../helpers/index.js";
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

  try {
    const created = await Create(UserModel, dataToSave);

    const { _id, name, username, profilePicture, email, ults, likedUlts } =
      created;

    const logged = {
      uid: _id,
      name,
      username,
      profilePicture,
      email,
      ults,
      likedUlts,
    };

    res.status(201).json({
      code: 201,
      error: false,
      data: logged,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: false,
      data: error,
    });
  }
};

export const loginUser = async (req = request, res = response) => {
  const { password } = req.body;
  const {
    name,
    username,
    profilePicture,
    email,
    password: hashedPassword,
    ults,
    likedUlts,
  } = req.user;

  const verified = passwordVerify(password, hashedPassword);

  if (!verified)
    return res.status(404).json({
      code: 404,
      error: true,
      data: "Not found - email, username or password wrong",
    });

  const logged = {
    uid: req.user._id,
    name,
    username,
    profilePicture,
    email,
    ults,
    likedUlts,
  };

  res.json({
    code: 200,
    error: true,
    data: logged,
  });
};
