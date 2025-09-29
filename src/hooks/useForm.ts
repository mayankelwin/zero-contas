import { useState } from "react"

export function useForm<T extends object>(initialValues: T) {
  const [formData, setFormData] = useState<T>(initialValues)

  const handleChange = (field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => setFormData(initialValues)

  return { formData, handleChange, resetForm, setFormData }
}
