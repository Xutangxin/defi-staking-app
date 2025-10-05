import { useAccount, useBalance, useWriteContract } from "wagmi";

import { usdcContract } from "../constants";
import { Button, notification, Spin } from "antd";
import { ERC20_ABI } from "../abi";
import { parseUnits } from "viem";
import { useEffect } from "react";

import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export default function Earnings() {
  const [api, contextHolder] = notification.useNotification();

  const { address, isConnected } = useAccount();
  const {
    writeContract,
    isPending: txLoading,
    error,
    isSuccess: txSuccess,
  } = useWriteContract();
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
      // 自己转自己
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
  useEffect(() => {
    if (txSuccess) {
      api.success({
        message: "操作成功",
      });
    }
  }, [txSuccess]);

  return (
    <div className="mt-[18px] w-fit">
      {contextHolder}
      <Button onClick={poke} loading={txLoading} className="mb-[4px]">
        🔔 触发利息（转自己）
      </Button>
      <Spin spinning={isLoading}>
        <div className="flex">
          可赎回总额：{data?.formatted} {data?.symbol}
          <Tooltip
            className="ml-[8px]"
            title="每秒自动涨，随时 withdraw 拿回本金+利息"
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      </Spin>
    </div>
  );
}
