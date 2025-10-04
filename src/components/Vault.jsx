import { Button, notification } from "antd";
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { usdcContract } from "../constants";
import { formatUnits } from "viem";

export default function Vault() {
  const [api, contextHolder] = notification.useNotification();

  const { address } = useAccount();
  const [amount, setAmt] = useState("");

  // 读代币余额
  const { data = { value: 0n, decimals: 18 }, error } = useBalance({
    address,
    token: usdcContract,
    enabled: !!address,
  });
  const bal = `${formatUnits(data.value, data.decimals)} ${data.symbol}`;

  useEffect(() => {
    if (error) {
      api.error({
        message: "Error",
        description: error.message,
      });
    }
  }, [error]);

  const needApprove = false;

  const supply = () => {
    //
  };

  return (
    <div>
      {contextHolder}
      <p>输入要抵押的 USDC 数量</p>
      <input
        value={amount}
        onChange={(e) => setAmt(e.target.value)}
        placeholder="100"
      />
      <Button onClick={supply} disabled={!amount}>
        {needApprove ? "Approve" : "Supply"}
      </Button>
      <p>钱包余额：{bal} </p>
    </div>
  );
}
