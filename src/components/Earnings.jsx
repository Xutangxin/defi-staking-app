import {
  useAccount,
  useBalance,
  useBlockNumber,
  useReadContract,
  useWriteContract,
} from "wagmi";

import { usdcContract } from "../constants";
import { Button, notification, Spin } from "antd";
import { ERC20_ABI } from "../abi";
import { formatUnits } from "viem";
import { useEffect } from "react";

export default function Earnings() {
  const [api, contextHolder] = notification.useNotification();

  const { address, isConnected } = useAccount();
  const { data: block } = useBlockNumber({ watch: true });
  const { data: lastBlock } = useReadContract({
    address: usdcContract,
    abi: ERC20_ABI,
    functionName: "lastBlock",
    watch: true,
  });
  const {
    data: bal,
    isLoading,
    refetch: refetchBalance,
  } = useBalance({
    address,
    token: usdcContract,
    watch: true, // 出块即刷新
    enabled: !!address,
  });
  const dec = bal?.decimals || 18;
  const balVal = bal?.value || 0n;
  const sym = bal?.symbol;

  const { writeContract, isPending, error, isSuccess } = useWriteContract();

  // 链下理论利息（不 mint）
  const rate = 100_000n; // INTEREST_RATE
  const blocks = (block ?? 0n) - (lastBlock ?? 0n);
  const interestRaw = (balVal * rate * blocks) / 10n ** 18n;
  const interest = formatUnits(interestRaw, dec);

  const claim = () => {
    writeContract({
      address: usdcContract,
      abi: ERC20_ABI,
      functionName: "claimInterest",
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

  useEffect(() => {
    refetchBalance();
  }, [block]);

  return (
    <div className="mt-[20px] w-fit">
      {contextHolder}
      <Button
        type="primary"
        onClick={claim}
        loading={isPending}
        disabled={!isConnected}
        className="mb-[8px]"
      >
        🔔 领取利息
      </Button>
      <div>
        当前余额：
        <Spin spinning={isLoading}>
          {formatUnits(balVal, dec)} {sym}
        </Spin>
      </div>
      <p>
        预计可领利息：{interest} {sym}
      </p>
    </div>
  );
}
