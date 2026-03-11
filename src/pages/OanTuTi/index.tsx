import { Button, Table, Tag } from "antd";
import { useState } from "react";

function OanTuTi() {
  const arrayRandom = ["Kéo", "Búa", "Bao"];
  const [bot, setBot] = useState(arrayRandom[Math.floor(Math.random() * 3)]);
  const [user, setUser] = useState("");
  const [result, setResult] = useState(false);
  const [msg, setMsg] = useState(""); 
  const [history, setHistory] = useState([]);

  const handleReset = () => {
    setBot(arrayRandom[Math.floor(Math.random() * 3)]);
  };

  const handleCheck = (userChoice : string) => {
    if (result) return;
    setUser(userChoice);
    setResult(true);

    let ketQua = "";

    if (userChoice === bot) {
      ketQua = "Hòa";
    } else if (
      (userChoice === "Búa" && bot === "Kéo") ||
      (userChoice === "Kéo" && bot === "Bao") ||
      (userChoice === "Bao" && bot === "Búa")
    ) {
      ketQua = "Bạn đã thắng";
    } else {
      ketQua = "Bạn đã thua";
    }

    const newRecord  = {
      key: Date.now(), 
      user: userChoice,
      bot: bot,
      outcome: ketQua,
    };
    setHistory([newRecord, ...history]);

    setMsg(ketQua);
    setTimeout(() => {
      handleReset();
      setResult(false);
      setMsg("");
    }, 1000);
  };

  const columns = [
    { title: "Bạn", dataIndex: "user", key: "user" },
    { title: "Máy", dataIndex: "bot", key: "bot" },
    { 
      title: "Kết quả", 
      dataIndex: "outcome", 
      key: "outcome",
      render: (text) => {
        let color = text === "Thắng" ? "green" : text === "Thua" ? "red" : "gold";
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      }
    },
  ];

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Oẳn Tù Tì</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "25px", marginTop: "20px" }}>
        <h2>Máy chọn:</h2>
        {result ? <h2>{bot}</h2> : <h2>?</h2>}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        <Button onClick={() => handleCheck("Kéo")}>Kéo</Button>
        <Button onClick={() => handleCheck("Búa")}>Búa</Button>
        <Button onClick={() => handleCheck("Bao")}>Bao</Button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "25px", marginTop: "40px" }}>
        <h1>Kết quả: {msg}</h1>
      </div>
      <div>
        <Table pagination={{ pageSize: 3 }} columns={columns} dataSource={history}></Table>
      </div>
    </div>
  );
}

export default OanTuTi;