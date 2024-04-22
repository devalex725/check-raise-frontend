import React from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

const NotificationTable = ({ title, data }) => {
  const headers = ["ID", "Action", "Active", "Actions"];

  return (
    <>
      <h4 className="mt-4">{title}</h4>
      <div className="table-container">
        <Table responsive>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="width-auto text-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td style={{ width: "70%" }}>
                  {item.title?.["en"] ||
                    item.title?.["fr"] ||
                    item.title?.["de"]}
                </td>
                <td>{item.status ? "Yes" : "No"}</td>
                <td>
                  <Link
                    className="action-link green-link mb-1"
                    to={`/admin/notification/edit/${item.id}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default NotificationTable;
