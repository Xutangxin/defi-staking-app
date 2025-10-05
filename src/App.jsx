import { ConnectButton } from "@rainbow-me/rainbowkit";
import Faucet from "./components/Faucet";
import { Card } from "antd";
import Vault from "./components/Vault";
import Earnings from "./components/Earnings";

function App() {
  return (
    <>
      <div className="mt-[10vh] max-w-[700px] mx-auto">
        <Card>
          <h1 className="mb-[20px] text-[24px] font-bold">DeFi Staking App</h1>
          <ConnectButton />
          <Faucet />
          <Vault />
          {/* <Earnings /> */}
        </Card>
      </div>
    </>
  );
}

export default App;
