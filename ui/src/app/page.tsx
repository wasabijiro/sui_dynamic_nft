"use client";

import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { useState, useEffect } from "react";
import {
  moveCallMintNft,
  moveCallUpdateR,
  moveCallUpdateG,
  moveCallUpdateB,
} from "../libs/movecall";
import { NFT_PACKAGE_ID } from "../config/constants";
import {
  ObjectId,
  getObjectFields,
  getObjectId,
  TransactionBlock,
} from "@mysten/sui.js";
import { providerSuiTestnet } from "../config/sui";
import { changeColor } from "@/libs/color";

export default function Home() {
  const { signAndExecuteTransactionBlock } = useWallet();
  const wallet = useWallet();
  const targetObjectType = `${NFT_PACKAGE_ID}::dev_nft::TestNetNFT`;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [objectId, setObjectId] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const [color, setColor] = useState({
    red: 169,
    green: 245,
    blue: 111,
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

  const getUrl = async (objectId: string): Promise<ObjectId> => {
    console.log({ objectId });
    if (!objectId) {
      throw new Error("Object ID is not available");
    }
    const suiObject = await providerSuiTestnet().getObject({
      // id: objectId,
      // id: "0x0e358d005fb484d1943d5f096c1780a53d20b78034a0bcf1202f689a77eb5d48",
      id: "0xed6612983866f8b5ffe392935dd8e20e3b200d481f6387e9c99989bb0484ea5a",
      options: {
        showContent: true,
        showType: true,
      },
    });
    console.log({ suiObject });
    const { url }: any = getObjectFields(suiObject) || {};
    return url;
  };

  const exctuteMintNFT = async () => {
    const txb = new TransactionBlock();
    setMessage("");

    try {
      moveCallMintNft({
        txb,
        name: "wasabi",
        description: "wasabi's icon",
        // url: "https://toy.bandai.co.jp/assets/tamagotchi/images/chopper/img_chara01.png",
        url: "https://pbs.twimg.com/profile_images/1538981748478214144/EUjTgb0v_400x400.jpg",
      });
      const mint_result: any = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });
      console.log({ mint_result });
      let objectId = null;
      if (mint_result.objectChanges) {
        const objectChange = mint_result.objectChanges.find(
          (change: any) => change.objectType === targetObjectType
        );
        objectId = objectChange?.objectId;
      }
      if (objectId) {
        console.log({ objectId });
        setObjectId(objectId);
        // localStorage.setItem("ID", objectId);
      } else {
        console.log("No object with the target objectType found");
      }
      const tx_url = `https://suiexplorer.com/txblock/${mint_result.digest}?network=testnet`;
      console.log(tx_url);
      setMessage("Mint succeeded");
      const image_url = await getUrl(objectId);
      console.log({ image_url });
      setImageUrl(image_url);
    } catch (err) {
      console.log("err:", err);
      setMessage(`Mint failed ${err}`);
    }
  };

  const executeUpdateR = async (new_r: number) => {
    const txb = new TransactionBlock();
    setMessage("");

    try {
      moveCallUpdateR({
        txb,
        id: objectId,
        new_r: new_r,
      });
      const r_result: any = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });
      console.log({ r_result });
      setMessage("Transaction succeeded");
      // let id = null;
      // if (r_result.objectChanges) {
      //   const objectChange = r_result.objectChanges.find(
      //     (change: any) => change.objectType === targetObjectType
      //   );
      //   id = objectChange?.objectId;
      // }

      // if (id) {
      //   console.log({ id });
      //   setObjectId(id);
      //   // localStorage.setItem("ID", objectId);
      // } else {
      //   console.log("No object with the target objectType found");
      // }
      // const tx_url = `https://suiexplorer.com/txblock/${r_result.digest}?network=testnet`;
      // console.log(tx_url);
      // const image_url = await getUrl(objectId);
      // console.log({ image_url });
      // setImageUrl(image_url);
    } catch (err) {
      console.log("err:", err);
      setMessage(`Transaction failed ${err}`);
    }
  };

  const executeUpdateG = async (new_g: number) => {
    const txb = new TransactionBlock();
    setMessage("");

    try {
      moveCallUpdateG({
        txb,
        id: objectId,
        new_g: new_g,
      });
      const g_result: any = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });
      console.log({ g_result });
      // const image_url = await getUrl(objectId);
      // setImageUrl(image_url);
      setMessage("Transaction succeeded");
    } catch (err) {
      console.log("err:", err);
      setMessage(`Transaction failed ${err}`);
    }
  };

  const executeUpdateB = async (new_b: number) => {
    const txb = new TransactionBlock();

    try {
      moveCallUpdateB({
        txb,
        id: objectId,
        new_b: new_b,
      });
      const b_result: any = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });
      console.log({ b_result });
      // const image_url = await getUrl(objectId);
      // setImageUrl(image_url);
      setMessage("Transaction succeeded");
    } catch (err) {
      console.log("err:", err);
      setMessage(`Transaction failed ${err}`);
    }
  };

  const updateColor = async () => {
    try {
      const modifiedImageUrl = await changeColor(
        imageUrl,
        color.red,
        color.green,
        color.blue
      );
      console.log("Modified Image URL:", modifiedImageUrl);
      setImageUrl(modifiedImageUrl);
    } catch (error) {
      console.error("Error:", error);
    }
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
          {/* <input
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
          /> */}
          {!imageUrl && (
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
          )}
          {imageUrl && (
            <div className="flex items-center mt-4 gap-10">
              <img src={imageUrl} alt="Dynamic" className="mr-4" />
              <div className="flex flex-col gap-5">
                <div
                  style={{
                    backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
                  }}
                  className="rounded-full w-20 h-20 mt-10 ml-40 mb-10 absolute top-[80px]"
                ></div>
                <div className="flex items-center mb-2">
                  <label style={{ width: "60px" }}>Red:</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.red}
                    onChange={(e) => handleColorChange(e, "red")}
                    onMouseUp={async (e) => {
                      await executeUpdateR(
                        parseInt((e.target as HTMLInputElement).value)
                      );
                      updateColor();
                    }}
                    style={{ width: "300px" }}
                  />
                  <span className="ml-2">{color.red}</span>
                </div>
                <div className="flex items-center mb-2">
                  <label style={{ width: "60px" }}>Green:</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.green}
                    onChange={(e) => handleColorChange(e, "green")}
                    onMouseUp={async (e) => {
                      await executeUpdateG(
                        parseInt((e.target as HTMLInputElement).value)
                      );
                      updateColor();
                    }}
                    style={{ width: "300px" }}
                  />
                  <span className="ml-2">{color.green}</span>
                </div>
                <div className="flex items-center mb-2">
                  <label style={{ width: "60px" }}>Blue:</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.blue}
                    onChange={(e) => handleColorChange(e, "blue")}
                    onMouseUp={async (e) => {
                      await executeUpdateB(
                        parseInt((e.target as HTMLInputElement).value)
                      );
                      updateColor();
                    }}
                    style={{ width: "300px" }}
                  />
                  <span className="ml-2">{color.blue}</span>
                </div>
              </div>
            </div>
          )}
        </form>
        <p className="bg-green-100 text-black p-3 rounded-md fixed bottom-4 left-4 max-w-xs break-words">
          {message}
        </p>
      </div>
    </div>
  );
}
