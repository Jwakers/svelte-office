const Price = ({
  amount,
  currencyCode = 'GBP',
  ...props
}: {
  amount: string;
  currencyCode: string;
} & React.ComponentProps<'p'>) => (
  <span suppressHydrationWarning={true} {...props}>
    {new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol'
    }).format(parseFloat(amount))}
  </span>
);

export default Price;
