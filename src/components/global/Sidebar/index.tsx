"use client";
import React, { useEffect, useState } from "react";
import SidebarItems from "./_components/SidebarItems";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Button } from "../../ui/button";
import { FileText, LogOut, Menu } from "lucide-react";
import { MENU_ITEMS } from "@/lib/constants";
import InfoBar from "../InfoBar";
import Link from "next/link";
import { Role } from "@prisma/client";
import { getUser } from "@/actions";
import { FullPageLoader } from "../FullPageLoader";
import { useClerk } from "@clerk/nextjs"; // Import useClerk hook

type Props = {
  activeUserId: string;
};

const Sidebar = ({ activeUserId }: Props) => {
  const pathName = usePathname();
  const [role, setRole] = useState<Role | null>(null);
  const [loadingRole, setLoadingRole] = useState<boolean>(false);
  const { signOut } = useClerk(); // Use the useClerk hook to get the signOut method

  useEffect(() => {
    const callMe = async () => {
      setLoadingRole(true);
      try {
        const user = await getUser(activeUserId);
        const role = user?.role || null;

        setRole(role);
        setLoadingRole(false);
      } catch (error) {
        console.log(error);
      }
    };

    callMe();
  }, [activeUserId]);

  const menuItems = MENU_ITEMS(activeUserId, role ?? Role.STUDENT);

  const handleLogout = async () => {
    try {
      await signOut(); // Call the signOut method
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const SidebarSection = (
    <div className="flex flex-col w-64 bg-card border-r p-4 pt-10 h-full">
      {/* logo */}
      <div className="flex w-full items-center gap-2 mb-8">
        <FileText className="h-6 w-6" />
        <h1 className="text-xl font-bold">Project - Repo</h1>
      </div>

      {/* menu */}
      <nav className="space-y-2 flex-1">
        <SidebarItems menuItems={menuItems} pathName={pathName} />
      </nav>

      {/* Logout Button */}
      <Button
        variant="ghost"
        className="w-full justify-start mt-auto"
        onClick={handleLogout} // Add onClick handler for logout
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );

  if (loadingRole) return <FullPageLoader />;

  return (
    <div className="full">
      {/* INFORBAR */}
      <InfoBar />
      {/* SHEET MOBILE  */}
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="mt-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 bg-card h-full">
        {SidebarSection}
      </div>
    </div>
  );
};

export default Sidebar;
