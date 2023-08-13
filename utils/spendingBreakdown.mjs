const spending_breakdown = (user) => {
  const categoriesData = {};

  for (const item of user.expense) {
    const category = item.category;
    const amount = item.amount;

    if (!categoriesData.hasOwnProperty(category)) {
      categoriesData[category] = amount;
    } else {
      categoriesData[category] += amount;
    }
  }

  return categoriesData;
};

export default spending_breakdown;
