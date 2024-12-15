import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const VerifyContent = () => {
  const [contentHash, setContentHash] = useState("");

  const { data: contentData } = useScaffoldReadContract({
    contractName: "CopyrightRegistry",
    functionName: "verifyContent",
    args: [contentHash],
  });

  return (
    <div className={"m-6"}>
      <h2>Verify Content</h2>
      <input
        type="text"
        placeholder="Enter Content Hash"
        value={contentHash}
        onChange={e => setContentHash(e.target.value)}
      />
      {contentData && (
        <div>
          <p>Author: {contentData[0]}</p>
          <p>Timestamp: {new Date(Number(contentData[1]) * 1000).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyContent;
