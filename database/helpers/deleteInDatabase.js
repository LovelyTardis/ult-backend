/**
 * Change "state" to false.
 *
 * For a given "Model", change its state to false in order to threat it like it is not active.
 *
 * @param {model} Model mongoose model.
 * @param {String} id document id.
 */
export const Delete = async (Model, id) => {
  await Model.findByIdAndUpdate(id, { state: false });
};
