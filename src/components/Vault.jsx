import { Button, notification } from "antd";
import { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { POOL_ADDRESS, poolContract, usdcContract } from "../constants";
import { formatUnits, parseUnits } from "viem";
import { ERC20_ABI, POOL_ABI } from "../abi";
import { InputNumber } from "antd";

export default function Vault() {
  const [api, contextHolder] = notification.useNotification();

  const { address } = useAccount();
  const [amount, setAmount] = useState(1);

  // 读代币余额
  const { data = { value: 0n, decimals: 18 }, error } = useBalance({
    address,
    token: usdcContract,
    enabled: !!address,
  });
  const bal = `${formatUnits(data.value, data.decimals)} ${data.symbol}`;
  const dec = data.decimals;

  // 读已授权额度
  const { data: allowance } = useReadContract({
    address: usdcContract,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, poolContract],
  });

  useEffect(() => {
    if (error) {
      api.error({
        message: "Error",
        description: error.message,
      });
    }
  }, [error]);

  const {
    writeContract: writeERC20,
    isPending: tokenPending,
    // isSuccess: tokenSuccess,
  } = useWriteContract();
  const {
    writeContract: writePool,
    isPending: poolPending,
    isSuccess: poolSuccess,
  } = useWriteContract();

  const needApprove =
    !allowance || (amount && allowance < parseUnits(amount + "", dec));
  const loading = tokenPending || poolPending;

  // 判断用户是否已经给 Pool 授权了足够的 USDC，
  // 如果没有就先去授权（approve），
  // 如果已经够了就直接把币 supply 进池子。

  const supply = async () => {
    const supplyVal = parseUnits(`${amount}`, dec);

    if (needApprove) {
      await writeERC20({
        address: usdcContract,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [poolContract, supplyVal],
      });
    } else {
      await writePool({
        address: POOL_ADDRESS,
        abi: POOL_ABI,
        functionName: "supply",
        args: [usdcContract, supplyVal, address, 0],
      });
    }
  };

  useEffect(() => {
    if (poolSuccess) {
      api.success({
        message: "操作成功",
      });
    }
  }, [poolSuccess]);

  return (
    <div>
      {contextHolder}
      <div className="mb-[16px]">
        <InputNumber
          className="w-[220px] mr-[10px]"
          value={amount}
          defaultValue={1}
          min={1}
          max={10000}
          disabled={loading}
          onChange={(val) => {
            setAmount(val);
          }}
          placeholder="输入要抵押的 USDC 数量"
        />
        <Button onClick={supply} disabled={!amount} loading={loading}>
          {needApprove ? "Approve" : "Supply"}
        </Button>
      </div>
      <p>钱包余额：{bal} </p>
    </div>
  );
}
