import { request, response } from "express";

import { UltModel, UserModel } from "../models/index.js";
import { Create, PushToArray } from "../database/helpers/index.js";
import { customError } from "../utils/customError.js";

export const getUlt = async (req = request, res = response) => {
  return res.json({
    code: 200,
    data: req.ult,
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
      data: "Created - ult",
    });
  } catch (err) {
    return next(customError(err));
  }
};
