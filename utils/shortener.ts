type Props = {
  value?: string,
  size: number
};

export default function shortener({ value, size }: Props) { 
  const shortened = value?.substring(0, 8) +
  "..." +
  value?.substring(value.length - size, value.length);
  return shortened
}