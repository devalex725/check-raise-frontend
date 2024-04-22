import moment from "moment";

export const displayNameForPlayer = (player, currentUser) => {
  let name = "";

  switch (player.displayoption) {
    case "public_nic": // name and surname
      name = `${player.firstname} ${player.lastname}`;
      break;
    case "private": // nickname
      name = player.nickname;
      break;
    case "anonymous": // Anonymous
      name = "Anonymous Player";
      break;
    default:
      name = "Anonymous Player";
      break;
  }

  if (player.id === currentUser?.id) {
    name += " (You)";
  }
  return name;
};

export const displayNameForAdmin = (player) => {
  let name = `${player.firstname} ${player.lastname} (${player.nickname})`;

  if (player.displayoption === "anonymous") {
    name += " (A)";
  }

  return name;
};

export const sortDate = (rowA, rowB, field) => {
  if (!rowA[field] || rowA[field] == "-") {
    return -1;
  }
  if (!rowB[field] || rowB[field] == "-") {
    return 1;
  }

  let a = moment(rowA[field]);
  let b = moment(rowB[field]);
  if (a > b) return 1;
  if (b > a) return -1;
  return 0;
};

export const getClearPhoneNumber = (phoneNumber = '') => {
  phoneNumber = phoneNumber.replace(/\D/g, "");
  phoneNumber = phoneNumber.startsWith("0")
    ? phoneNumber.slice(1)
    : phoneNumber;

  return phoneNumber;
}

export const formatPhoneNumber = (
  phoneCode = "",
  phoneNumber = "",
  onlyPhoneNumber = false
) => {
  phoneCode = phoneCode || '';
  phoneNumber = phoneNumber || '';

  let number = (phoneCode.startsWith("+") ? phoneCode : "+" + phoneCode) + " ";

  phoneNumber = getClearPhoneNumber(phoneNumber);

  if (phoneNumber.length < 10) {
    number += "(0)";
  }

  let formattedNumber = phoneNumber.replace(
    /(\d{2})(\d{3})(\d{2})(\d{2})/g,
    "$1 $2 $3 $4"
  );

  if (onlyPhoneNumber) {
    return (phoneNumber.length < 10 ? "0" : "") + formattedNumber;
  }

  number += formattedNumber;

  return number;
};
