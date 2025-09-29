import { DollarSign, CreditCard, Gift, Book, Film, Smartphone, Wifi } from "lucide-react"

export const incomeCategories = [
  { name: "Salário", icon: <DollarSign size={20} /> },
  { name: "Freelance", icon: <CreditCard size={20} /> },
  { name: "Investimentos", icon: <Gift size={20} /> },
  { name: "Presente", icon: <Gift size={20} /> },
  { name: "Outros", icon: <DollarSign size={20} /> },
]

export const expenseCategories = [
  { name: "Alimentação", icon: <Gift size={20} /> },
  { name: "Transporte", icon: <CreditCard size={20} /> },
  { name: "Moradia", icon: <Book size={20} /> },
  { name: "Lazer", icon: <Film size={20} /> },
  { name: "Saúde", icon: <Gift size={20} /> },
  { name: "Educação", icon: <Book size={20} /> },
  { name: "Outros", icon: <DollarSign size={20} /> },
]

export const subscriptionTypes = [
  { name: "Filmes Streaming", icon: <Film size={20} /> },
  { name: "Cursos", icon: <Book size={20} /> },
  { name: "Telefone", icon: <Smartphone size={20} /> },
  { name: "Internet", icon: <Wifi size={20} /> },
  { name: "Outros", icon: <DollarSign size={20} /> },
]
