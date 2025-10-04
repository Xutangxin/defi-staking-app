import { Button, notification, Tooltip } from "antd";
import { useAccount, useWriteContract } from "wagmi";
import { ERC20_ABI } from "../abi";
import { useEffect } from "react";

import { usdcContract } from "../constants";

export default function Faucet() {
  const [api, contextHolder] = notification.useNotification();
  const { address, isConnected } = useAccount();

  const { writeContract, isPending, error, isSuccess } = useWriteContract();

  const mint = () => {
    writeContract({
      address: usdcContract,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [address, 0],
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

  useEffect(() => {
    if (isSuccess) {
      api.success({
        message: "操作成功",
      });
    }
  }, [isSuccess]);

  return (
    <div className="my-[16px]">
      {contextHolder}
      <Tooltip title="点一次“Mint”领 10000 测试 USDC（合约内置 faucet）">
        <Button
          type="primary"
          onClick={mint}
          disabled={!isConnected}
          loading={isPending}
        >
          Mint USDC
        </Button>
      </Tooltip>
    </div>
  );
}
