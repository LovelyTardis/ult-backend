/**
 * Updates a document.
 *
 * @param {model} Model mongoose model.
 * @param {object} data {id: String, updatedData: object, populate?: [String], populate2?: [String]}
 * @return {object} updated document.
 */
export const Update = async (Model, data) => {
  const { id, updatedData, populate, populate2 } = data;

  return populate2
    ? await Model.findByIdAndUpdate(id, updatedData)
        .populate(...populate)
        .populate(...populate2)
    : populate
    ? await Model.findByIdAndUpdate(id, updatedData).populate(...populate)
    : await Model.findByIdAndUpdate(id, updatedData);
};
