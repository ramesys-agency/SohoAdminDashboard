interface BasicInfoFormProps {
  name: string;
  onNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  gender: string[];
  onGenderChange: (v: string[]) => void;
  attributes: string;
  onAttributesChange: (v: string) => void;
}

const GENDER_OPTIONS = ["MALE", "FEMALE", "UNISEX", "KIDS"];

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
                <button key={icon} className="p-1 hover:bg-slate-200 rounded">
                  <span className="material-symbols-outlined text-xl text-slate-600">
                    {icon}
                  </span>
                </button>
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
              <button
                key={g}
                onClick={() => toggleGender(g)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  gender.includes(g)
                    ? "bg-[#1325ec] border-[#1325ec] text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-2">
          <label className="text-sm font-semibold text-slate-700">
            Attributes (JSON)
          </label>
          <textarea
            rows={4}
            value={attributes}
            onChange={(e) => onAttributesChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-[#1325ec] outline-none text-slate-900"
            placeholder='e.g. { "material": "cotton", "fit": "regular" }'
          />
        </div>
      </div>
    </section>
  );
}
