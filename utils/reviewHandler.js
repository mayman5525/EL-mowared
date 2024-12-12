async function createReview(modelData, reviewModel, reviewData) {
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  if (!modelData || !modelData.id || !modelData.type) {
    throw new Error("Invalid model data");
  }

  const foreignKey = `${modelData.type}Id`;

  const review = await reviewModel.create({
    [foreignKey]: modelData.id,
    ...reviewData,
  });

  return review;
}

module.exports = { createReview };
