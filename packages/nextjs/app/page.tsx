"use client";

import RegisterContent from "../components/RegisterContent";
import TransferOwnership from "../components/TransferOwnership";
import VerifyContent from "../components/VerifyContent";

const Home = () => {
  return (
    <div>
      <h1>My project - Copyright Registry</h1>
      <RegisterContent />
      <VerifyContent />
      <TransferOwnership />
    </div>
  );
};

export default Home;
