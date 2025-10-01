export function formatCurrency(value: string | number) {
  if (!value) return "R$ 0,00";

  const amount = Number(value) / 100;

  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
