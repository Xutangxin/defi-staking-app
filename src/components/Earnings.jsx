import { useAccount, useBalance } from "wagmi";
import { AUSDC } from "../constants";
import { Spin } from "antd";

export default function Earnings() {
  const { address } = useAccount();
  const { data, isLoading } = useBalance({
    address,
    token: AUSDC,
    enabled: !!address,
    watch: true, // 每区块自动更新
  });

  return (
    <div className="mt-[16px] w-fit">
      <Spin spinning={isLoading}>
        <p>
          可赎回总额：{data?.formatted} {data?.symbol}
          <br />
          <small>每秒自动涨，随时 withdraw 拿回本金+利息</small>
        </p>
      </Spin>
    </div>
    // <div className="mt[16px]">
    //   {isLoading ? (
    //     <p>Loading…</p>
    //   ) : (
    //     <p>
    //       可赎回总额：{data?.formatted} {data?.symbol}
    //       <br />
    //       <small>每秒自动涨，随时 withdraw 拿回本金+利息</small>
    //     </p>
    //   )}
    // </div>
  );
}
