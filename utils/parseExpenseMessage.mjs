const parseExpenseMessage = (text) => {
  const keywords = ["on", "in"];
  const message = text.toLowerCase();

  let amount, category;

  // parse if keywords are present
  for (const keyword of keywords) {
    const index = message.indexOf(keyword);
    if (index !== -1) {
      amount = parseFloat(message.substring(0, index).trim());
      category = message.substring(index + keyword.length).trim();
      break;
    }
  }

  // parse if keyword is not present
  if (amount === undefined || category === undefined) {
    const parts = message.split(" ");
    const amountPart = parts[0].toLowerCase();
    if (!isNaN(parseFloat(amountPart))) {
      amount = parseFloat(amountPart);
      category = parts.slice(1).join(" ").trim();
    }
  }

  if (amount !== undefined && category !== undefined) {
    return { amount, category };
  } else {
    return 400;
  }
};

export default parseExpenseMessage;
