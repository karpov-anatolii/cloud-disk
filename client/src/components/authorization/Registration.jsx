import React from "react";
import "./authorization.scss";
import Input from "../../utils/input/Input";
import { useState } from "react";
import { registration } from "../../action/user";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="authorization">
      <div className="header">Registration</div>
      <Input
        value={email}
        setValue={setEmail}
        type="text"
        placeholder="Enter email"
      />
      <Input
        value={password}
        setValue={setPassword}
        type="password"
        placeholder="Enter password"
      />

      <button className="btn" onClick={() => registration(email, password)}>
        Enter
      </button>
    </div>
  );
};

export default Registration;
