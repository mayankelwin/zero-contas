
export function Select({ label, value, onChange, options, placeholder }: any) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#2E2F3B] border border-gray-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition flex items-center gap-2"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.name} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  )
}