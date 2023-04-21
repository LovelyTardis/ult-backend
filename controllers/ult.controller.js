import { request, response } from "express";

import { UltModel, UserModel } from "../models/index.js";
import {
  Create,
  FindAll,
  Update,
  PushToArray,
  DeleteInArray,
  Find,
} from "../database/helpers/index.js";
import { customError } from "../utils/customError.js";

export const getAllUlts = async (req = request, res = response) => {
  const { limit, from } = req.body;
  let ults = await FindAll(UltModel, { limit, from, populate: ["user"] });

  ults = ults.map(({ message, datetime, ult, likes, comments, user }) => {
    const { _id, name, username, profilePicture } = user;

    return {
      message,
      datetime,
      ult,
      likes,
      comments,
      user: { _id, name, username, profilePicture },
    };
  });

  return res.json({
    code: 200,
    error: false,
    data: ults,
  });
};

export const getUlt = async (req = request, res = response) => {
  const { _id, message, datetime, user, ult, likes, comments } = req.ult;

  return res.json({
    code: 200,
    error: false,
    data: { _id, message, datetime, user, ult, likes, comments },
  });
};

export const createUlt = async (req = request, res = response, next) => {
  const { message, ult = null } = req.body;
  const { user } = req;

  const dataToSave = {
    user,
    message,
    datetime: Date.now(),
    ult,
  };

  try {
    const created = await Create(UltModel, dataToSave);

    // Ult is created by User
    await PushToArray(UserModel, user, { ults: created });

    // Ult could be added as a comment for other Ult
    if (ult) await PushToArray(UltModel, ult, { comments: created });

    res.status(201).json({
      code: 201,
      error: false,
      data: "Created - ult",
    });
  } catch (err) {
    return next(customError(err));
  }
};

export const likeUlt = async (req = request, res = response, next) => {
  const { _id: userId } = req.user;
  const { _id: ultId, likes } = req.ult;
  const { like } = req.body;

  try {
    const updatedUlt = await Update(UltModel, {
      id: ultId,
      updatedData: {
        likes: likes + (like ? 1 : likes > 0 && -1),
      },
    });

    like
      ? await PushToArray(UserModel, userId, { likedUlts: updatedUlt })
      : await DeleteInArray(UserModel, userId, { likedUlts: ultId });

    res.json({
      code: 200,
      error: false,
      data: like ? "Ult liked successfully" : "Ult disliked successfully",
    });
  } catch (err) {
    return next(customError(err));
  }
};
