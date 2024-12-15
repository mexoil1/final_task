import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const RegisterContent = () => {
  const [contentHash, setContentHash] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract("CopyrightRegistry");

  const handleRegister = async () => {
    if (!contentHash) {
      alert("Контент не может быть пустым");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "registerContent",
        args: [contentHash],
      });
      alert("Контент успешно зарегистрирован!");
    } catch (error) {
      console.error(error);
      alert("Ошибка регистрации!");
    }
  };

  return (
    <div>
      <h2>Register Content</h2>
      <input
        type="text"
        placeholder="Enter Content Hash"
        value={contentHash}
        onChange={e => setContentHash(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterContent;
