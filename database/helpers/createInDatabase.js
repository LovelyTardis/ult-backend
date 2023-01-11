/**
 * Creates a new document.
 *
 * @param {model} Model mongoose model.
 * @param {object} dataToSave
 * @return {object} created object.
 */
export const Create = async (Model, dataToSave) => {
  const created = new Model(dataToSave);
  await created.save();
  return created;
};
