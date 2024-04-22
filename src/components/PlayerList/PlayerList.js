import React from "react";
import { displayNameForAdmin, displayNameForPlayer } from "../../utils";

const PlayerList = ({ data = [], roomManagerId }) => {
  const currentUserType = localStorage.getItem("usertype");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <ol className="players-list">
      {currentUserType === 'Admin' || currentUser?.id === roomManagerId
        ? data.map((element, index) => (
            <li key={index}>
              <span to="#"> {index + 1}. </span>
              <span>{displayNameForAdmin(element)}</span>
            </li>
          ))
        : data.map((element, index) => (
          <li key={index}>
            <span to="#"> {index + 1}. </span>
            <span>{displayNameForPlayer(element, currentUser)}</span>
          </li>
        ))}
    </ol>
  );
};

export default PlayerList;
