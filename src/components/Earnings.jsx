import { useAccount, useBalance, useWriteContract } from "wagmi";

import { usdcContract } from "../constants";
import { Button, notification, Spin } from "antd";
import { ERC20_ABI } from "../abi";
import { parseUnits } from "viem";
import { useEffect } from "react";

export default function Earnings() {
  const [api, contextHolder] = notification.useNotification();

  const { address, isConnected } = useAccount();
  const { writeContract, isPending: txLoading, error } = useWriteContract();
  const { data, isLoading } = useBalance({
    address,
    token: usdcContract,
    enabled: isConnected,
    watch: true, // 每区块自动更新
  });

  const poke = () => {
    writeContract({
      address: usdcContract,
      abi: ERC20_ABI,
      functionName: "transfer",
      // 自己转自己 0.000001 USDC
      args: [
        "0x5bF9634a97fAdfCEDCE8fF81A293dFf0FA060ADa",
        parseUnits("0.000001", 18),
      ],
    });
  };

  useEffect(() => {
    if (error) {
      api.error({
        message: "Error",
        description: error.message,
      });
    }
  }, [error]);

  return (
    <div className="mt-[16px] w-fit">
      {contextHolder}
      <Button onClick={poke} loading={txLoading} className="mb-[4px]">
        🔔 触发利息（转自己）
      </Button>
      <Spin spinning={isLoading}>
        <p>
          可赎回总额：{data?.formatted} {data?.symbol}
          <br />
          <small>每秒自动涨，随时 withdraw 拿回本金+利息</small>
        </p>
      </Spin>
    </div>
  );
}
