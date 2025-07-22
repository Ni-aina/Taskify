import RootClient from "@/components/RootClient";
import { syncUser } from "../action/user.action";

const RootLayout = async () => {
  await syncUser();

  return <RootClient />
}
 
export default RootLayout;