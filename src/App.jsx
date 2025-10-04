import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  return (
    <>
      <div className="mt-[10vh] max-w-[700px] mx-auto">
        <h1 className="mb-[16px] text-[20px] font-bold">DeFi Staking App</h1>
        <ConnectButton />
      </div>
    </>
  );
}

export default App;
