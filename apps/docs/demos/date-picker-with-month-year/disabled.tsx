import { DatePickerWithMonthYear } from "@strait/ui/components/date-picker-with-month-year";

const FIXED_DATE = new Date(2025, 4, 15);

export default function DatePickerWithMonthYearDisabled() {
  return (
    <div className="w-64">
      <DatePickerWithMonthYear
        disabled
        placeholder="Selecione uma data"
        value={FIXED_DATE}
      />
    </div>
  );
}
