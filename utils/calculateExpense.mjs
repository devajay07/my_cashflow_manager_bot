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

const calculatedExpense = (user) => {
  let expense = {
    total: 0,
    today: 0,
    week: 0,
    month: 0,
    year: 0,
    weekData: {},
    monthData: {},
    yearData: {},
  };

  // Initialize weekData, monthData, and yearData
  for (let i = 0; i <= 6; i++) {
    const currentDate = new Date();
    currentDate.setDate(todayDate.getDate() - i);
    const currentDayOfMonth = currentDate.getDate();
    const currentMonthName = monthNames[currentDate.getMonth()];
    const dayAndMonth = `${currentDayOfMonth} ${currentMonthName}`;
    expense.weekData[dayAndMonth] = 0; // Initialize weekData with 0
    expense.monthData[dayAndMonth] = 0; // Initialize monthData with 0
  }

  for (const month of monthNames) {
    expense.yearData[month] = 0;
  }

  for (const item of user.expense) {
    // total expense
    expense.total += item.amount;

    const itemDate = new Date(item.date);

    // every month expense
    if (itemDate.getFullYear() === todayDate.getFullYear()) {
      const itemMonth = itemDate.getMonth();
      expense.yearData[monthNames[itemMonth]] += item.amount;
    }

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
      expense.weekData[dayAndMonth] += item.amount; // Accumulate weekData amounts
      expense.week += item.amount; // Don't accumulate again here
    }

    // Month expense (individual days)
    const itemMonth = itemDate.getMonth();
    const itemDayOfMonth = itemDate.getDate();
    const itemDayAndMonth = `${itemDayOfMonth} ${monthNames[itemMonth]}`;
    expense.monthData[itemDayAndMonth] += item.amount; // Accumulate monthData amounts
  }

  // Sort monthData based on day of the month
  const sortedMonthData = {};
  const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const dayAndMonth = `${i} ${monthNames[currentMonth]}`;
    sortedMonthData[dayAndMonth] = expense.monthData[dayAndMonth] || 0;
  }
  expense.monthData = sortedMonthData;
  return expense;
};

export default calculatedExpense;
