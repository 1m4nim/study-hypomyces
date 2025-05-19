// App.tsx
import React, { useEffect, useState } from "react";
import PhyloTree from "./PhyloTree";

const App: React.FC = () => {
  const [nwk, setNwk] = useState<string>("");

  useEffect(() => {
    fetch("/hypomyces_tree.nwk")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load NWK file");
        return res.text();
      })
      .then((text) => setNwk(text))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Hypomyces 系統樹</h1>
      {nwk ? (
        <PhyloTree nwkText={nwk} width={900} height={700} />
      ) : (
        <p>系統樹ファイル読み込み中…</p>
      )}
    </div>
  );
};

export default App;
