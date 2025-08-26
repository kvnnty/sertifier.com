"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import React, { useState } from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full border-[1px] border-gray-300 rounded-md p-3"
      disabled={disabled}
    />
  </div>
);

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
}) => (
  <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      className={checked ? "bg-[#187361] border-[#187361]" : "bg-gray-300"}
    />
  </div>
);

interface ReminderValue {
  condition: string;
  after: number;
  unit: string;
}

interface ReminderItemProps {
  index: number;
  value: ReminderValue;
  onChange: (index: number, updatedReminder: ReminderValue) => void;
  onDelete: () => void;
}

const ReminderItem: React.FC<ReminderItemProps> = ({
  index,
  value,
  onChange,
  onDelete,
}) => (
  <div className="mb-4 p-4 border rounded-md bg-white shadow-sm">
    <div className="flex justify-between items-center mb-3">
      <h1 className="text-md font-semibold text-gray-800">Reminder</h1>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <Trash size={18} />
      </button>
    </div>
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Send a reminder to recipients who haven't
        </span>
        <Select
          value={value.condition}
          onValueChange={(val) => onChange(index, { ...value, condition: val })}
        >
          <SelectTrigger className=" border-[1px] border-gray-300  p-2 text-sm">
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not opened">
              not opened credential notification emails
            </SelectItem>
            <SelectItem value="opened">
              opened credential notification emails
            </SelectItem>
            <SelectItem value="viewed">viewed their credentials</SelectItem>
            <SelectItem value="shared">shared their credentials</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">after</span>
        <input
          type="number"
          value={value.after}
          onChange={(e) =>
            onChange(index, { ...value, after: parseInt(e.target.value) || 1 })
          }
          className=" p-2 border-[1px] border-gray-300 rounded-md text-center text-sm"
          min="1"
        />
        <Select
          value={value.unit}
          onValueChange={(val) => onChange(index, { ...value, unit: val })}
        >
          <SelectTrigger className="w-[100px] border-[1px] border-gray-300 rounded-md p-2 text-sm">
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Hours">Hours</SelectItem>
            <SelectItem value="Days">Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

const TopBar: React.FC = () => (
  <div className="flex justify-between items-center p-4 px-10 border-b border-gray-200">
    <h1 className="text-xl font-semibold">Campaign Options</h1>
    <Button className="bg-[#187361] text-white px-4 py-2 rounded">
      Continue
    </Button>
  </div>
);

const CampaignOptions: React.FC = () => {
  const [campaignTitle, setCampaignTitle] = useState("Credential 14");
  const [isPrivate, setIsPrivate] = useState(true);
  const [socialText, setSocialText] = useState(
    "Check out my [credential name] digital badge issued by [issuer name] via Sertifier!"
  );

  const handleAttributeChange = (value: string) => {
    setSocialText(value);
  };

  return (
    <div className="p-6 bg-white rounded-md w-1/2 border-r-[1px] border-gray-200">
      <InputField
        label="Campaign Title"
        value={campaignTitle}
        onChange={(e) => setCampaignTitle(e.target.value)}
        placeholder="Credential 14"
      />
      <p className="text-xs text-gray-500 mb-4">
        Give this campaign a name to easily find it later. Don’t worry;
        recipients won’t see this name.
      </p>
      <div className="flex items-center my-5 space-x-3">
        <ToggleSwitch
          label="Campaign Privacy"
          checked={isPrivate}
          onChange={setIsPrivate}
        />
        <h1 className="font-bold text-md">
          {isPrivate ? "Private" : "Public"}
        </h1>
      </div>
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700">
          Social Sharing Text
        </label>
        <div className="flex flex-col space-x-2 mt-1 border-[1px] border-gray-300 p-2 rounded-sm">
          <Select onValueChange={handleAttributeChange}>
            <SelectTrigger className="w-[30%] border-gray-300 rounded-md shadow-sm">
              <SelectValue placeholder="Attributes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Attributes" disabled>
                Attributes
              </SelectItem>
              <h1 className="text-[#187361] pl-2">RECIPIENT</h1>
              <SelectItem value="Recipient Name">Recipient Name</SelectItem>
              <SelectItem value="Recipient E-Mail">Recipient E-Mail</SelectItem>
              <hr className="my-5" />
              <h1 className="text-[#187361] pl-2">CREDENTIAL</h1>
              <SelectItem value="Credential ID">Credential ID</SelectItem>
              <SelectItem value="Issue Date">Issue Date</SelectItem>
              <SelectItem value="Credential Name">Credential Name</SelectItem>
            </SelectContent>
          </Select>
          <hr className="border-gray-300 my-4" />
          <textarea
            value={socialText}
            onChange={(e) => setSocialText(e.target.value)}
            placeholder="Attributes"
            className="mt-1 block w-full outline-none h-24 resize-none"
          />
        </div>
        <p className="text-xs text-gray-500">
          This is the post when recipients share their credentials on social
          platforms.
        </p>
      </div>
    </div>
  );
};

const RecipientNotificationEmailSettings: React.FC = () => {
  const [senderName, setSenderName] = useState("");
  const [emailSubject, setEmailSubject] = useState("Subject");
  const [senderAddress, setSenderAddress] = useState("verified@sertifier.com");
  const [reminders, setReminders] = useState<ReminderValue[]>([
    { condition: "not opened", after: 1, unit: "Hours" },
  ]);
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);

  const handleReminderChange = (
    index: number,
    updatedReminder: ReminderValue
  ) => {
    const newReminders = [...reminders];
    newReminders[index] = updatedReminder;
    setReminders(newReminders);
  };

  const handleReminderDelete = (index: number) => {
    const newReminders = reminders.filter((_, i) => i !== index);
    setReminders(newReminders);
  };

  const addReminder = () => {
    if (reminders.length < 3) {
      setReminders([
        ...reminders,
        { condition: "not opened", after: 1, unit: "Hours" },
      ]);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md w-1/2">
      <h2 className="text-lg font-semibold mb-4">
        Recipient Notification Email Settings
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Customize the email notification sent with your certificates to add a
        personal touch
      </p>
      <select className="mb-4 p-1 border-gray-300 rounded-md w-full">
        <option>Default Email Template</option>
      </select>
      <InputField
        label="Email Sender Name*"
        value={senderName}
        onChange={(e) => setSenderName(e.target.value)}
        placeholder="Name"
      />
      <p className="text-xs text-gray-500 mb-4">
        Enter a name (e.g., your company name) to help recipients recognize you
        in their inbox.
      </p>
      <InputField
        label="Email Subject**"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        placeholder="Subject"
      />
      <p className="text-xs text-gray-500 mb-4">
        Type a subject line that clearly describes your email content. It’ll be
        visible in your recipients’ inbox.
      </p>
      <InputField
        label="Email Sender Address"
        value={senderAddress}
        onChange={(e) => setSenderAddress(e.target.value)}
        placeholder="Email Address"
        type="email"
        disabled={true}
      />
      <div className="mt-4">
        <div className="flex justify-between items-center p-2 rounded-md">
          <h3 className="text-md font-medium">Engagement Reminder Emails</h3>
          <ToggleSwitch
            label=""
            checked={isReminderEnabled}
            onChange={setIsReminderEnabled}
          />
        </div>
        {isReminderEnabled && (
          <>
            {reminders.map((reminder, index) => (
              <ReminderItem
                key={index}
                index={index}
                value={reminder}
                onChange={handleReminderChange}
                onDelete={() => handleReminderDelete(index)}
              />
            ))}
            <button
              onClick={addReminder}
              className="mt-2 text-[#187361]"
              disabled={reminders.length >= 3}
            >
              {reminders.length < 3
                ? "Add another reminder (" + (3 - reminders.length) + " Left)"
                : "Maximum reminders reached"}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Add up to three reminders for each credential. These reminders
              will be automatically sent to recipients according to selected
              rule, using default email template.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default function CampaignOptionsPage() {
  return (
    <div className="">
      <TopBar />
      <div className="flex justify-between p-6 border-[1px] border-gray-200 m-10 rounded-sm shadow-sm">
        <CampaignOptions />
        <RecipientNotificationEmailSettings />
      </div>
    </div>
  );
}
