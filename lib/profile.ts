import { User } from "@prisma/client";

export const selectUsername = (user: User) => {
  if (user?.username) return user.username;
  if (user?.gh_username) return user.gh_username;
  if (user?.ens_name) return user.ens_name;
  if (user?.eth_address) return shortenString(user.eth_address, 6, 6);
};

export const shortenString = (
  str: string,
  startLength: number,
  endLength: number,
) => {
  if (str.length <= startLength + endLength) {
    return str;
  }
  const start = str.substring(0, startLength);
  const end = str.substring(str.length - endLength);
  return `${start}...${end}`;
};

export function convertNameToTwoLetters(name: string) {
  const splitName = name.split(" ");
  let initials = "";

  if (splitName.length > 1) {
    initials = splitName[0][0] + splitName[1][0];
  } else {
    initials = splitName[0].substring(0, 2);
  }

  return initials.toUpperCase();
}

export const getTwoLetterPlaceholder = (user: User) => {
  if (user.name) {
    return shortenString(convertNameToTwoLetters(user.name), 2, 0);
  }
  if (user?.eth_address) {
    return shortenString(convertNameToTwoLetters(user.eth_address), 2, 0);
  }
  const username = selectUsername(user);
  if (username) {
    return shortenString(username, 2, 0);
  }
  return "";
};
