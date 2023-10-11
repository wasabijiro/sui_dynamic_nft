"use client";

import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { useState, useEffect } from "react";
import { moveCallMintNft } from "../libs/movecall";
import { TransactionBlock } from "@mysten/sui.js";
import { NFT_PACKAGE_ID } from "../config/constants";
import { getUrl } from "@/libs/getObject";

export default function Home() {
  const { signAndExecuteTransactionBlock } = useWallet();
  const wallet = useWallet();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const [color, setColor] = useState({
    red: 255,
    green: 255,
    blue: 255,
  });

  const handleColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    colorName: string
  ) => {
    setColor({
      ...color,
      [colorName]: e.target.value,
    });
  };

  const rgbColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;

  const exctuteMintNFT = async () => {
    const txb = new TransactionBlock();

    moveCallMintNft({
      txb,
      name: "chopper",
      description: "mugiwara",
      url: "https://toy.bandai.co.jp/assets/tamagotchi/images/chopper/img_chara01.png",
    });
    const result: any = await signAndExecuteTransactionBlock({
      transactionBlock: txb,
    });
    console.log({ result });
    const targetObjectType = `${NFT_PACKAGE_ID}::dev_nft::TestNetNFT`;
    let objectId = null;
    if (result.objectChanges) {
      const objectChange = result.objectChanges.find(
        (change: any) => change.objectType === targetObjectType
      );
      objectId = objectChange?.objectId;
    }

    if (objectId) {
      console.log({ objectId });
      localStorage.setItem("ID", objectId);
    } else {
      console.log("No object with the target objectType found");
    }
    const tx_url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`;
    console.log(tx_url);
    const image_url = await getUrl();
    console.log({ image_url });
    setImageUrl(image_url);
  };

  useEffect(() => {
    if (!wallet.connected) return;
    console.log("connected wallet name: ", wallet.name);
    console.log("account address: ", wallet.account?.address);
    console.log("account publicKey: ", wallet.account?.publicKey);
  }, [wallet.connected]);

  return (
    <div className="flex flex-col justify-center p-4">
      <header className="mb-10 flex justify-end items-start">
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
          {imageUrl && (
            <div className="flex items-center mt-4 gap-10">
              <img src={imageUrl} alt="Dynamic" className="mr-4" />
              <div className="flex flex-col gap-5">
                <div className="flex items-center mb-2">
                  <label style={{ width: "60px" }}>Red:</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.red}
                    onChange={(e) => handleColorChange(e, "red")}
                    style={{ width: "300px" }}
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label style={{ width: "60px" }}>Green:</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.green}
                    onChange={(e) => handleColorChange(e, "green")}
                    style={{ width: "300px" }}
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label style={{ width: "60px" }}>Blue:</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.blue}
                    onChange={(e) => handleColorChange(e, "blue")}
                    style={{ width: "300px" }}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
