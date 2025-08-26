import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";

const Skills = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const predefinedSkills = [
    "JavaScript",
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "HTML",
    "CSS",
    "UI/UX Design",
  ];

  const skillColors = ["#ECE1CF", "#CAC8DC", "#E8C6CA", "#C2D5D1"];

  const filteredSkills = predefinedSkills.filter((skill) =>
    skill.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setInputValue("");
    setOpen(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  return (
    <div className="space-y-4 mt-6 w-full max-w-full font-global">
      <div className="space-y-2 w-full">
        <Label className="font-medium">Skills</Label>
        <div className="flex gap-2 w-full max-w-full">
          <div className="flex-1 w-full relative">
            <Select open={open} onOpenChange={setOpen}>
              <SelectTrigger onClick={() => setOpen(true)} className="w-full">
                <SelectValue placeholder="Search skill" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <div className="p-1 w-full">
                  <Input
                    placeholder="Search skill"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full mb-1 border-[1px] border-[#086956]"
                  />
                  <div className="max-h-60 overflow-auto">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => (
                        <div
                          key={skill}
                          className="px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer"
                          onClick={() => handleAddSkill(skill)}
                        >
                          {skill}
                        </div>
                      ))
                    ) : (
                      <div className="py-2 text-center text-sm text-muted-foreground">
                        {inputValue ? (
                          <div className="flex justify-between items-center">
                            <span>No results</span>
                            <Button
                              className="text-black font-medium p-3 bg-gray-200 text-sm"
                              onClick={() => handleAddSkill(inputValue)}
                            >
                              Add '{inputValue}'
                            </Button>
                          </div>
                        ) : (
                          "No skills found"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          This information will be displayed on your credential page.
        </p>
      </div>

      {selectedSkills.length > 0 && (
        <div className="space-y-2 w-full">
          <Label className="font-bold text-md">Skills Added</Label>
          <div className="flex flex-wrap gap-2 w-full">
            {selectedSkills.map((skill, index) => (
              <div
                key={skill}
                className="flex items-center justify-between p-3 rounded-sm text-md w-full font-bold"
                style={{
                  backgroundColor: skillColors[index % skillColors.length],
                }}
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
