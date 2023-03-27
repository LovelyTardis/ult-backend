import { request, response } from "express";

import { UserModel } from "../models/index.js";

import { passwordHash, passwordVerify, generateJwt } from "../helpers/index.js";
import { Create } from "../database/helpers/index.js";
import { customError } from "../utils/customError.js";

export const getUser = async (req = request, res = response) => {
  const { user } = req;

  return res.json({
    code: 200,
    data: {
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      ults: user.ults,
      likedUlts: user.likedUlts,
      biography: user.biography,
    },
  });
};

export const createUser = async (req = request, res = response, next) => {
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

    const {
      _id,
      name,
      username,
      profilePicture,
      email,
      ults,
      likedUlts,
      biography,
    } = created;

    const logged = {
      uid: _id,
      name,
      username,
      profilePicture,
      email,
      ults,
      likedUlts,
      biography,
    };

    res.status(201).json({
      code: 201,
      data: logged,
    });
  } catch (err) {
    next(customError(err));
  }
};

export const loginUser = async (req = request, res = response, next) => {
  const { password } = req.body;
  const {
    _id: uid,
    name,
    username,
    profilePicture,
    email,
    password: hashedPassword,
    ults,
    likedUlts,
    biography,
  } = req.user;

  const verified = passwordVerify(password, hashedPassword);

  if (!verified)
    return next(
      customError("Not found - email, username or password wrong", 404)
    );

  const token = await generateJwt(uid);

  const logged = {
    token,
    uid,
    name,
    username,
    profilePicture,
    email,
    ults,
    likedUlts,
    biography,
  };

  res.json({
    code: 200,
    error: false,
    data: logged,
  });
};
