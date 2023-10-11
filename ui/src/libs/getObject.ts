import { ObjectId, getObjectFields, getObjectId } from "@mysten/sui.js";
import { providerSuiTestnet } from "../config/sui";

export const getUrl = async (): Promise<ObjectId> => {
  const objectId = localStorage.getItem("ID")?.trim();
  console.log({ objectId });
  if (!objectId) {
    throw new Error("Object ID is not available");
  }
  const suiObject = await providerSuiTestnet().getObject({
    // id: objectId,
    id: "0x0e358d005fb484d1943d5f096c1780a53d20b78034a0bcf1202f689a77eb5d48",
    options: {
      showContent: true,
      showType: true,
    },
  });
  console.log({ suiObject });
  const { url }: any = getObjectFields(suiObject) || {};
  return url;
};
