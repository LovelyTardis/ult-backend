/**
 * Deletes a document.
 *
 * For a given "Model", deletes the document that matches the id.
 *
 * @param {model} Model mongoose model.
 * @param {String} id document id.
 */
export const Delete = async (Model, id) => {
  await Model.findByIdAndDelete(id);
};
