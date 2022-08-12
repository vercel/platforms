export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const truncate = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return null;
  }
  const prefix = "https://res.cloudinary.com/vercel-platforms/image/upload/";
  const suffix = url.split(prefix)[1];
  const response = await fetch(
    `${prefix}w_210,e_blur:5000,q_auto,f_auto/${suffix}`
  );
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:image/png;base64,${base64}`;
};
