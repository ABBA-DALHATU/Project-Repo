import Sidebar from "@/components/global/Sidebar";
import React, { ReactNode } from "react";

type Props = {
  params: { userId: string };
  children: ReactNode;
};

const layout = ({ params: { userId }, children }: Props) => {
  return (
    <div className="flex h-screen w-screen">
      {/* sidebar */}
      <Sidebar activeUserId={userId} />

      {/* right part */}
      <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default layout;
