import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const PlayerCountInput = ({
  label,
  disabledMinus,
  disabledPlus,
  value,
  onChange,
}) => {
  const [count, setCount] = useState(value);

  useEffect(() => {
    setCount(value);
  }, [value]);

  const handleInputChange = (e) => {
    const newVal = Number(e.target.value);
    setCount(newVal);
  };

  const handleInputBlur = () => {
    if(count === value) return;

    onChange(count)
  }

  /**
   * click handler of plus & minus button max number of players
   * @param {number} num - 1: plus, -1: minus
   */
  const handleClickButton = (num) => {
    const newVal = Number(count) + num;
    setCount(newVal);
    onChange(newVal);
  };

  return (
    <Row>
      <Col md={8} className="mb-3">
        <span className="w-90">{label}</span>
      </Col>
      <Col md={4} className="player-info">
        <div className="input-group-prepend">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => handleClickButton(-1)}
            disabled={disabledMinus}
          >
            -
          </button>
        </div>
        <div>
          <input
            type="text"
            className="form-control"
            value={count}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>
        <div className="input-group-prepend">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => handleClickButton(1)}
            disabled={disabledPlus}
          >
            +
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default PlayerCountInput;
