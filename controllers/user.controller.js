import { request, response } from "express";

import { UltModel, UserModel } from "../models/index.js";
import { passwordHash, passwordVerify, generateJwt } from "../helpers/index.js";
import { Create, FindById, FindOne } from "../database/helpers/index.js";
import { customError } from "../utils/customError.js";

export const getUser = async (req = request, res = response, next) => {
  const { username: paramUsername } = req.params;

  try {
    // GET USER INFORMATION FROM DATABASE
    const {
      _id,
      name,
      username,
      email,
      profilePicture,
      ults: oldUlts,
    } = await FindOne(UserModel, {
      filter: { username: paramUsername },
      populate: ["ults"],
    });

    // A MAP OF ULTS WITH A PROMISE.ALL IN ORDER TO SET data.ults VALUE
    const ults = await Promise.all(
      oldUlts.map(
        async ({
          _id,
          ult: parentUlt,
          comments: oldComments,
          message,
          datetime,
          likes,
        }) => {
          let ult = null;
          let comments = [];

          console.log(message);
          if (parentUlt) console.log(parentUlt);

          // IF AN ULT HAS A PARENT ULT
          if (parentUlt) {
            ult = await FindById(UltModel, { id: parentUlt.toString() });

            const { _id, name, username, profilePicture } = await FindById(
              UserModel,
              {
                id: ult.user.toString(),
              }
            );

            ult.user = { _id, name, username, profilePicture };
          }

          // IF THE ULT HAS COMMENTS
          if (oldComments.length > 0) {
            // A MAP OF COMMENTS WITH A PROMISE.ALL IN ORDER TO SET newComments VARIABLE
            comments = await Promise.all(
              oldComments.map(async (comment) => {
                // RETURN DESTRUCTURED DATA THAT COMES FROM THE DATABASE
                const { _id, message, datetime, likes, ult, comments } =
                  await FindById(UltModel, {
                    id: comment.toString(),
                  });

                return { _id, message, datetime, likes, ult, comments };
              })
            );
          }

          return {
            _id,
            message,
            datetime,
            likes,
            ult,
            comments,
          };
        }
      )
    );

    // SET CUSTOM DATA OBJECT TO SEND
    const data = {
      _id,
      name,
      username,
      email,
      profilePicture,
      ults,
    };

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
    console.log(err);
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

  try {
    const token = await generateJwt(uid);

    const data = {
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

  try {
    const token = await generateJwt(uid);

    const data = {
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
