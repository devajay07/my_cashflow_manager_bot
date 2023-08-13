const todayDate = new Date();
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let expense = {
  total: 0,
  today: 0,
  week: 0,
  month: 0,
  year: 0,
  weekData: {},
};

// Initialize weekData for current date and previous six dates
for (let i = 0; i <= 6; i++) {
  const currentDate = new Date();
  currentDate.setDate(todayDate.getDate() - i);
  const currentDayOfMonth = currentDate.getDate();
  const currentMonthName = monthNames[currentDate.getMonth()];
  const dayAndMonth = `${currentDayOfMonth} ${currentMonthName}`;
  expense.weekData[dayAndMonth] = 0; // Initialize with 0
}

const calculatedExpense = (user) => {
  for (const item of user.expense) {
    // total expense
    expense.total += item.amount;

    const itemDate = new Date(item.date);

    // current day expense
    if (
      itemDate.getDate() === todayDate.getDate() &&
      itemDate.getMonth() === todayDate.getMonth() &&
      itemDate.getFullYear() === todayDate.getFullYear()
    ) {
      expense.today += item.amount;
    }

    // month expense
    if (
      itemDate.getMonth() === todayDate.getMonth() &&
      itemDate.getFullYear() === todayDate.getFullYear()
    ) {
      expense.month += item.amount;
    }

    // year expense
    if (itemDate.getFullYear() === todayDate.getFullYear()) {
      expense.year += item.amount;
    }

    // week expense
    const timeDiff = todayDate.getTime() - itemDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    if (daysDiff <= 6 && daysDiff >= 0) {
      const currentDay = new Date();
      currentDay.setDate(todayDate.getDate() - daysDiff);
      const currentDayOfMonth = currentDay.getDate();
      const currentMonthName = monthNames[currentDay.getMonth()];
      const dayAndMonth = `${currentDayOfMonth} ${currentMonthName}`;
      expense.weekData[dayAndMonth] += item.amount; // Accumulate amounts
      expense.week += item.amount;
    }
  }
  return expense;
};

export default calculatedExpense;
