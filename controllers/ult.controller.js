import { request, response } from "express";

import { UltModel, UserModel } from "../models/index.js";
import { Create, FindAll, PushToArray } from "../database/helpers/index.js";
import { customError } from "../utils/customError.js";

export const getAllUlts = async (req = request, res = response) => {
  const allUlts = await FindAll(UltModel, { limit: 10 });

  return res.json({
    code: 200,
    error: false,
    data: {
      ults: allUlts,
    },
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
