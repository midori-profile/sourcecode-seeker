import React from "react";

const ChildComponent1 = () => {
    const cardStyle: React.CSSProperties = {
        backgroundColor: "#c0e7ff",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "20px",
        margin: "10px 0",
        textAlign: "center",
      };
      return <div style={cardStyle}>This is child component 1</div>;
};

export default ChildComponent1;
