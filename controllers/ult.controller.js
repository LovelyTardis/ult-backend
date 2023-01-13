import { request, response } from "express";

import { UltModel, UserModel } from "../models/index.js";
import { Create, PushToArray } from "../database/helpers/index.js";

export const getUlt = async (req = request, res = response) => {
  return res.json({
    code: 200,
    error: false,
    data: req.ult,
  });
};

export const createUlt = async (req = request, res = response) => {
  const { user, message, ult = null } = req.body;

  const dataToSave = {
    user: user,
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
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: true,
      data: error,
    });
  }
};
