interface BasicInfoFormProps {
  name: string;
  onNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  gender: string[];
  onGenderChange: (v: string[]) => void;
  attributes: Record<string, string>;
  onAttributesChange: (v: Record<string, string>) => void;
  categoryAttributes?: any[];
}

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
  categoryAttributes = [],
}: BasicInfoFormProps) {

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
            Product Name <span className="text-red-500">*</span>
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
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {["MEN", "WOMEN", "KIDS"].map((g) => {
              const isSelected = gender.includes(g);
              return (
                <Button
                  key={g}
                  type="button"
                  variant={isSelected ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isSelected) {
                      onGenderChange(gender.filter((item: string) => item !== g));
                    } else {
                      onGenderChange([...gender, g]);
                    }
                  }}
                  className="px-4 py-2"
                >
                  {g}
                </Button>
              );
            })}
          </div>
          {gender.length === 0 && (
            <p className="text-[10px] text-amber-600 font-medium italic">At least one gender must be selected</p>
          )}
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

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <label className="text-sm font-semibold text-slate-700">
                Attributes
              </label>
              {categoryAttributes.length > 0 && (
                <p className="text-[10px] text-slate-400">
                  Recommended: {categoryAttributes.map((a: any) => a.label).join(", ")}
                </p>
              )}
            </div>
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
            {Object.entries(attributes).map(([key, value], index) => {
              const categoryAttr = categoryAttributes.find((a: any) => a.key === key);

              if (categoryAttr) {
                // Determine options array safely
                const optionsList = Array.isArray(categoryAttr.options) 
                  ? categoryAttr.options 
                  : (typeof categoryAttr.options === "string" ? categoryAttr.options.split(",").map((s: string) => s.trim()) : []);

                return (
                  <div key={index} className="flex gap-4 items-start bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                    <div className="w-1/3 pt-1">
                      <span className="text-sm font-semibold text-slate-700 block mb-0.5">{categoryAttr.label}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">{categoryAttr.key}</span>
                    </div>
                    <div className="flex-1">
                      {categoryAttr.type === "select" && optionsList.length > 0 ? (
                        <select
                          value={value as string}
                          onChange={(e) => updateAttributeValue(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900 bg-white"
                        >
                          <option value="">Select {categoryAttr.label}</option>
                          {optionsList.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={categoryAttr.type === "number" ? "number" : "text"}
                          placeholder={`Enter ${categoryAttr.label}...`}
                          value={value as string}
                          onChange={(e) => updateAttributeValue(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900 bg-white"
                        />
                      )}
                    </div>
                    <div className="w-8 flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttribute(key)}
                        className="text-slate-400 hover:text-red-500"
                        title="Remove Category Attribute"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </Button>
                    </div>
                  </div>
                );
              }

              // Render standard custom attribute row
              return (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <input
                      type="text"
                      placeholder="Key"
                      value={key}
                      onChange={(e) => updateAttributeKey(key, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900 font-bold"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <input
                      type="text"
                      placeholder="Value"
                      value={value as string}
                      onChange={(e) => updateAttributeValue(key, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAttribute(key)}
                    className="text-slate-400 hover:text-red-500 mt-0.5"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </Button>
                </div>
              );
            })}

            {Object.keys(attributes).length === 0 && (
              <p className="text-xs text-slate-400 italic">
                No attributes added yet. Select a category to see recommended attributes or add custom ones.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
