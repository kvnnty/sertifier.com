"use client";

import { useState } from "react";
import { CalendarCog, CalendarDays, PlusCircle, X } from "lucide-react";
import { format, add } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FaTrashAlt } from "react-icons/fa";

interface ExpiryDateComponentProps {
  onRemove: () => void;
}

export const ExpiryDateComponent = ({ onRemove }: ExpiryDateComponentProps) => {
  const [expiryType, setExpiryType] = useState<"date" | "period">("date");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState<
    Array<{ days: number; enabled: boolean }>
  >([{ days: 1, enabled: true }]);
  const [validityPeriod, setValidityPeriod] = useState({
    value: 1,
    unit: "months",
  });

  const handleAddReminder = () => {
    if (reminders.length < 3) {
      setReminders([...reminders, { days: 1, enabled: true }]);
    }
  };

  const handleRemoveReminder = (index: number) => {
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    setReminders(newReminders);
  };

  const handleReminderDaysChange = (index: number, value: string) => {
    const newReminders = [...reminders];
    newReminders[index].days = parseInt(value) || 0;
    setReminders(newReminders);
  };

  const handleValidityValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValidityPeriod({
      ...validityPeriod,
      value: parseInt(e.target.value) || 0,
    });
  };

  const handleValidityUnitChange = (value: string) => {
    setValidityPeriod({
      ...validityPeriod,
      unit: value,
    });
  };

  const calculateExpiryDate = () => {
    if (!validityPeriod.value) return undefined;

    const unitsMap: Record<string, any> = {
      minutes: { minutes: validityPeriod.value },
      hours: { hours: validityPeriod.value },
      days: { days: validityPeriod.value },
      weeks: { weeks: validityPeriod.value },
      months: { months: validityPeriod.value },
      years: { years: validityPeriod.value },
    };

    return add(new Date(), unitsMap[validityPeriod.unit]);
  };

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <FaTrashAlt className="text-gray-500 hover:text-gray-700 cursor-pointer" />
      </button>

      <h3 className="font-medium mb-4">Expiry Date</h3>

      <RadioGroup
        defaultValue="date"
        className="flex flex-col gap-4 mb-4"
        onValueChange={(value: "date" | "period") => setExpiryType(value)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="date" id="expiry-date" />
          <Label htmlFor="expiry-date">Select Expiry Date</Label>
        </div>
        {expiryType === "date" && (
          <div className="mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[30%] justify-start text-left font-normal border-[#086956] focus:ring-[#086956]"
                >
                  {expiryDate ? (
                    format(expiryDate, "dd.MM.yyyy")
                  ) : (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="text-gray-200" />
                      <span>End date</span>
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="period" id="validity-period" />
          <Label htmlFor="validity-period">Set Validity Period</Label>
        </div>
        {expiryType === "period" && (
          <div className="flex gap-2 mb-4">
            <div className="flex">
              <Input
                type="number"
                placeholder="1"
                value={validityPeriod.value}
                onChange={handleValidityValueChange}
                className="border-[#086956] focus-visible:ring-[#086956]"
              />
            </div>
            <div className="">
              <Select
                value={validityPeriod.unit}
                onValueChange={handleValidityUnitChange}
              >
                <SelectTrigger className="border-[#086956] focus:ring-[#086956]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </RadioGroup>
      {expiryType === "date" && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Send Expiration Reminder Emails</h4>
            <Switch
              checked={showReminders}
              onCheckedChange={setShowReminders}
              className="data-[state=checked]:bg-[#086956]"
            />
          </div>

          {showReminders && (
            <div className="space-y-4">
              {reminders.map((reminder, index) => (
                <div
                  key={index}
                  className="space-y-2 border-[1px] border-gray-200 p-5 rounded-md"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Reminder {index + 1}</h5>
                    {index > 0 && (
                      <button
                        onClick={() => handleRemoveReminder(index)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt className="cursor-pointer" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-gray-200" />
                    <Input
                      type="number"
                      value={reminder.days}
                      onChange={(e) =>
                        handleReminderDaysChange(index, e.target.value)
                      }
                      className="w-[30%] border-[#086956] focus-visible:ring-[#086956]"
                    />
                    <span>Days before expiration date</span>
                  </div>
                </div>
              ))}

              {reminders.length < 3 && (
                <div
                  onClick={handleAddReminder}
                  className="text-[#086956] border-[#086956] cursor-pointer underline flex items-center gap-x-3"
                >
                  <PlusCircle /> Add Another Reminder ({3 - reminders.length}{" "}
                  Remaining)
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <p className="my-4 text-sm text-black">
        Set up to three expiry reminder email dates to notify recipients that
        their digital credentials are expiring.
      </p>
      <p className="text-sm text-gray-600">
        Set an expiration date for this credential (optional). After this date ,
        the credentials remains accessible but displays an "Expired" banner. You
        can also configure expiry reminders for recipients.
      </p>
    </div>
  );
};
