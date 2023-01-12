import { request, response } from "express";

import { Ult, User } from "../models/index.js";
import { Create, PushUltToUser } from "../database/helpers/index.js";

export const getUlt = async (req = request, res = response) => {
  res.status(501).json({
    code: 501,
    error: true,
    data: "Not implemented",
  });
};

export const createUlt = async (req = request, res = response) => {
  const { user, message, ult = null } = req.body;

  const dataToSave = {
    user,
    message,
    datetime: Date.now(),
    ult,
  };

  try {
    const created = await Create(Ult, dataToSave);

    const { _id: ultId } = created;

    await PushUltToUser(User, { id: user, ultId });

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
