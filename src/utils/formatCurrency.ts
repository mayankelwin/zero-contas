export function formatCurrency(value: string | number) {
  if (!value) return "R$ 0,00"
  return (Number(value)).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}