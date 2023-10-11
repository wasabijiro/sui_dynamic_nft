"use client";

import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { useState, useEffect } from "react";
import { moveCallMintNft } from "../libs/movecall";
import { TransactionBlock } from "@mysten/sui.js";

export default function Home() {
  const { signAndExecuteTransactionBlock } = useWallet();
  const wallet = useWallet();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const exctuteMintNFT = async () => {
    const txb = new TransactionBlock();

    moveCallMintNft({
      txb,
      name: "chopper",
      description: "mugiwara",
      url: "https://toy.bandai.co.jp/assets/tamagotchi/images/chopper/img_chara01.png",
    });
    const result = await signAndExecuteTransactionBlock({
      transactionBlock: txb,
    });
    console.log({ result });
    const tx_url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`;
    console.log(tx_url);
  };

  useEffect(() => {
    if (!wallet.connected) return;
    console.log("connected wallet name: ", wallet.name);
    console.log("account address: ", wallet.account?.address);
    console.log("account publicKey: ", wallet.account?.publicKey);
  }, [wallet.connected]);

  return (
    <div className="flex flex-col justify-center p-4">
      <header className="mb-20 flex justify-end items-start">
        <ConnectButton />
      </header>
      <div className="flex items-center justify-center">
        <form className="space-y-4">
          <input
            className="w-full px-4 py-2 text-black border border-gray-300 bg-white rounded-md focus:outline-none"
            placeholder="Please enter name..."
            value={name}
            onChange={(e) => handleInputChange(e, setName)}
          />
          <input
            className="w-full px-4 py-2 text-black border border-gray-300 bg-white rounded-md focus:outline-none"
            placeholder="Please enter description..."
            value={description}
            onChange={(e) => handleInputChange(e, setDescription)}
          />
          <input
            className="w-full px-4 py-2 text-black border border-gray-300 bg-white rounded-md focus:outline-none"
            placeholder="Please enter URL..."
            value={url}
            onChange={(e) => handleInputChange(e, setUrl)}
          />
          <button
            className="mx-auto text-white bg-blue-500 rounded-md px-4 py-2"
            onClick={async (event: any) => {
              event.preventDefault();
              await exctuteMintNFT();
              setName("");
              setDescription("");
              setUrl("");
            }}
          >
            Mint
          </button>
        </form>
      </div>
    </div>
  );
}
