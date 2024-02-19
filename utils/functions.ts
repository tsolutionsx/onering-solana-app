export const EscapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

export const ImageLoader = ({ src, width, height }: any) => {
  return `${src}?w=${width}?h=${height}`;
};
