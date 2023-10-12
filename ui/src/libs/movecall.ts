import { TransactionBlock } from "@mysten/sui.js";
import { NFT_PACKAGE_ID } from "../config/constants";

export const moveCallMintNft = async (props: {
  txb: TransactionBlock;
  name: string;
  description: string;
  url: string;
}) => {
  const moduleName = "dev_nft";
  const methodName = "mint_to_sender";

  props.txb.moveCall({
    target: `${NFT_PACKAGE_ID}::${moduleName}::${methodName}`,
    arguments: [
      props.txb.pure(props.name),
      props.txb.pure(props.description),
      props.txb.pure(props.url),
    ],
  });
};

export const moveCallUpdateR = async (props: {
  txb: TransactionBlock;
  id: string;
  new_r: number;
}) => {
  const moduleName = "dev_nft";
  const methodName = "update_color_r";

  props.txb.moveCall({
    target: `${NFT_PACKAGE_ID}::${moduleName}::${methodName}`,
    arguments: [props.txb.object(props.id), props.txb.pure(props.new_r)],
  });
};

export const moveCallUpdateG = async (props: {
  txb: TransactionBlock;
  id: string;
  new_g: number;
}) => {
  const moduleName = "dev_nft";
  const methodName = "update_color_g";

  props.txb.moveCall({
    target: `${NFT_PACKAGE_ID}::${moduleName}::${methodName}`,
    arguments: [props.txb.object(props.id), props.txb.pure(props.new_g)],
  });
};

export const moveCallUpdateB = async (props: {
  txb: TransactionBlock;
  id: string;
  new_b: number;
}) => {
  const moduleName = "dev_nft";
  const methodName = "update_color_b";

  props.txb.moveCall({
    target: `${NFT_PACKAGE_ID}::${moduleName}::${methodName}`,
    arguments: [props.txb.object(props.id), props.txb.pure(props.new_b)],
  });
};

export const moveCallTransferNft = async (id: string, toAddress: string) => {
  const tx = new TransactionBlock();
  const moduleName = "dev_nft";
  const methodName = "transfer";

  console.log("tx:", id);
  console.log("toAddress:", toAddress);

  tx.moveCall({
    target: `${NFT_PACKAGE_ID}::${moduleName}::${methodName}`,
    arguments: [tx.object(id), tx.object(toAddress)],
  });
};
