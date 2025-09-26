export default function formatCurrency(value: string | number) {
  let numeric = typeof value === "string" ? value.replace(/\D/g, "") : value
  numeric = Number(numeric)
  return (numeric / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
