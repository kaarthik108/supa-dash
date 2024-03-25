type MonthFilterProps = {
  selectedMonth: string | null;
  onMonthChange: (month: string | null) => void;
};

export function MonthFilter({
  selectedMonth,
  onMonthChange,
}: MonthFilterProps) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div>
      <label htmlFor="month-filter">Filter by Month:</label>
      <select
        id="month-filter"
        value={selectedMonth || ""}
        onChange={(e) => onMonthChange(e.target.value)}
      >
        <option value="">All Months</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
}
