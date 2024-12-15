import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const TransferOwnership = () => {
  const [contentHash, setContentHash] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const { writeContractAsync, isMining } = useScaffoldWriteContract("CopyrightRegistry");

  const handleTransfer = async () => {
    if (!contentHash || !newOwner) {
      alert("Контент и адрес нового владельца должны быть заполнены");
      return;
    }

    try {
      await writeContractAsync({
        functionName: "transferOwnership",
        args: [contentHash, newOwner],
      });
      alert("Права на владение успешно переданы!");
    } catch (error) {
      console.error("Error transferring ownership:", error);
      alert("Ошибка передачи!");
    }
  };

  return (
    <div>
      <h2>Transfer Ownership</h2>
      <input
        type="text"
        placeholder="Enter Content Hash"
        value={contentHash}
        onChange={e => setContentHash(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter New Owner Address"
        value={newOwner}
        onChange={e => setNewOwner(e.target.value)}
      />
      <button onClick={handleTransfer} disabled={isMining}>
        {isMining ? "Transferring..." : "Transfer"}
      </button>
    </div>
  );
};

export default TransferOwnership;
