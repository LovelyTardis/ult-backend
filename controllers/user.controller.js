import { request, response } from "express";

import { UltModel, UserModel } from "../models/index.js";

import { passwordHash, passwordVerify, generateJwt } from "../helpers/index.js";
import { Create, FindById, FindOne } from "../database/helpers/index.js";
import { customError } from "../utils/customError.js";

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
      biography: user.biography,
    },
  });
};

export const getUlts = async (req = request, res = response, next) => {
  const { username: paramUsername } = req.params;
  const data = {};

  try {
    // GET USER INFORMATION FROM DATABASE
    const { name, username, profilePicture, ults } = await FindOne(UserModel, {
      filter: { username: paramUsername },
      populate: ["ults"],
    });

    // SET NAME, USERNAME AND PROFILE PICTURE
    data.name = name;
    data.username = username;
    data.profilePicture = profilePicture;

    // A MAP OF ULTS WITH A PROMISE.ALL IN ORDER TO SET data.ults VALUE
    data.ults = await Promise.all(
      ults.map(async ({ _id, ult, comments, message, datetime, likes }) => {
        let parentUlt = null;
        let newComments = [];

        // IF AN ULT HAS A PARENT ULT
        if (ult) {
          const found = await FindById(UltModel, { id: ult.toString() });
          const { _id, name, username, profilePicture } = await FindById(
            UserModel,
            {
              id: found.user.toString(),
            }
          );

          parentUlt = found.toObject();
          parentUlt.user = { _id, name, username, profilePicture };
        }

        // IF THE ULT HAS COMMENTS
        if (comments.length > 0) {
          // A MAP OF COMMENTS WITH A PROMISE.ALL IN ORDER TO SET newComments VARIABLE
          newComments = await Promise.all(
            comments.map(
              async (comment) =>
                // RETURN DESTRUCTURED DATA THAT COMES FROM THE DATABASE
                ({ _id, ult, comments, message, datetime, likes } =
                  await FindById(UltModel, {
                    id: comment.toString(),
                  }))
            )
          );
        }

        return {
          _id,
          message,
          datetime,
          likes,
          ult: parentUlt,
          comments: newComments,
        };
      })
    );

    return res.json({
      code: 200,
      error: false,
      data,
    });
  } catch (err) {
    console.log(err);
    return next(customError(err));
  }
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

    const { _id } = created;

    const token = await generateJwt(_id);

    res.status(201).json({
      code: 201,
      error: false,
      data: { token },
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

export const autoLogin = async (req = request, res = response, next) => {
  const {
    _id: uid,
    name,
    username,
    profilePicture,
    email,
    ults,
    likedUlts,
    biography,
  } = req.user;

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
