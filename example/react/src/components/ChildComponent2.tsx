import React from "react";

const ChildComponent2 = () => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: "#FFC0CB",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "20px",
    margin: "10px 0",
    textAlign: "center",
  };
  return <div style={cardStyle}>This is child component 2</div>;
};

export default ChildComponent2;
