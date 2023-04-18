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

/**
 * Pushes something into an array.
 *
 * @param {model} Model mongoose model.
 * @param {String} idToUpdate mongoId to update
 * @param {object} dataToPush data to be pushed in the array
 */
export const PushToArray = async (Model, idToUpdate, dataToPush) => {
  await Model.updateOne({ _id: idToUpdate }, { $push: dataToPush });
};

/**
 * Deletes something from an array.
 *
 * @param {model} Model mongoose model.
 * @param {String} idToUpdate mongoId to update
 * @param {object} dataToDelete data to be deleted in the array
 */
export const DeleteInArray = async (Model, idToUpdate, dataToDelete) => {
  await Model.updateOne({ _id: idToUpdate }, { $pull: dataToDelete });
};
