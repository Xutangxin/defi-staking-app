// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyUSDC is ERC20 {
    uint256 public constant INTEREST_RATE = 100_000;
    uint256 public lastBlock;
    bool private _inMint; // ① 递归锁

    constructor() ERC20("MyUSDC", "USDC") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
        lastBlock = block.number;
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (!_inMint) {
            // ② 不在利息铸造里才计算
            if (from != address(0)) _mintInterest(from);
            if (to != address(0)) _mintInterest(to);
        }
        super._update(from, to, amount);
    }

    function _mintInterest(address user) internal {
        uint256 blocks = block.number - lastBlock;
        if (blocks == 0) return;
        uint256 interest = (balanceOf(user) * INTEREST_RATE * blocks) / 1e18;
        if (interest > 0) {
            _inMint = true; // ③ 加锁
            _mint(user, interest);
            _inMint = false; // ④ 解锁
        }
        lastBlock = block.number;
    }

    function claimInterest() external {
        _update(msg.sender, msg.sender, 0); // amount=0 也会触发 _update
    }
}
