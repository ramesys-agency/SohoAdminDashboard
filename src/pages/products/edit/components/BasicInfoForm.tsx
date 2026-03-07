interface BasicInfoFormProps {
  name: string;
  onNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  gender: string[];
  onGenderChange: (v: string[]) => void;
  attributes: Record<string, string>;
  onAttributesChange: (v: Record<string, string>) => void;
}

const GENDER_OPTIONS = ["MALE", "FEMALE", "UNISEX", "KIDS"];

import Button from "../../../../components/ui/Button";

export default function BasicInfoForm({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  gender,
  onGenderChange,
  attributes,
  onAttributesChange,
}: BasicInfoFormProps) {
  const toggleGender = (g: string) => {
    if (gender.includes(g)) {
      onGenderChange(gender.filter((item) => item !== g));
    } else {
      onGenderChange([...gender, g]);
    }
  };

  const addAttribute = () => {
    onAttributesChange({ ...attributes, "": "" });
  };

  const removeAttribute = (key: string) => {
    const newAttributes = { ...attributes };
    delete newAttributes[key];
    onAttributesChange(newAttributes);
  };

  const updateAttributeKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const newAttributes = { ...attributes };
    const value = newAttributes[oldKey];
    delete newAttributes[oldKey];
    newAttributes[newKey] = value;
    onAttributesChange(newAttributes);
  };

  const updateAttributeValue = (key: string, value: string) => {
    onAttributesChange({ ...attributes, [key]: value });
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-slate-900">
        Basic Information
      </h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Description
          </label>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
              {[
                "format_bold",
                "format_italic",
                "format_list_bulleted",
                "link",
              ].map((icon) => (
                <Button
                  key={icon}
                  variant="ghost"
                  size="sm"
                  className="p-1 size-8"
                >
                  <span className="material-symbols-outlined text-xl text-slate-600">
                    {icon}
                  </span>
                </Button>
              ))}
            </div>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full border-none focus:outline-none text-sm p-3 text-slate-900 resize-none"
              placeholder="Enter product description here..."
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-2">
          <label className="text-sm font-semibold text-slate-700">Gender</label>
          <div className="flex gap-2 flex-wrap">
            {GENDER_OPTIONS.map((g) => (
              <Button
                key={g}
                onClick={() => toggleGender(g)}
                variant={gender.includes(g) ? "primary" : "outline"}
                size="sm"
              >
                {g}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Attributes
            </label>
            <Button
              variant="link"
              size="sm"
              onClick={addAttribute}
              leftIcon={
                <span className="material-symbols-outlined text-sm">add</span>
              }
            >
              Add Attribute
            </Button>
          </div>
          <div className="space-y-2">
            {Object.entries(attributes).map(([key, value], index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  type="text"
                  placeholder="Key"
                  value={key}
                  onChange={(e) => updateAttributeKey(key, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={value}
                  onChange={(e) => updateAttributeValue(key, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttribute(key)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <span className="material-symbols-outlined">delete</span>
                </Button>
              </div>
            ))}
            {Object.keys(attributes).length === 0 && (
              <p className="text-xs text-slate-400 italic">
                No attributes added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
