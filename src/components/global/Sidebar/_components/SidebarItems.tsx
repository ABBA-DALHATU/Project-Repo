import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  menuItems: { title: string; href: string; icon: ReactNode }[];
  pathName: string;
};

type SidebarItemProps = {
  icon: React.ReactNode;
  title: string;
  href: string;
  selected: boolean;
  notifications?: number;
};

export function SidebarItem({ icon, title, href, selected }: SidebarItemProps) {
  return (
    <Button variant="ghost" className="w-full justify-start" asChild>
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between group rounded-lg hover:bg-[#1D1D1D]",
          selected ? "bg-[#1D1D1D]" : ""
        )}
      >
        <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer">
          {icon}
          <span
            className={cn(
              "font-medium group-hover:text-[#9D9D9D] transition-all truncate w-32",
              selected ? "text-[#9D9D9D]" : "text-[#545454]"
            )}
          >
            {title}
          </span>
        </div>
        {}
      </Link>
    </Button>
  );
}

const SidebarItems = ({ menuItems, pathName }: Props) => {
  return (
    <>
      {menuItems.map((menuItem) => (
        <SidebarItem
          key={menuItem.href}
          icon={menuItem.icon}
          href={menuItem.href}
          title={menuItem.title}
          selected={pathName === menuItem.href}
        />
      ))}
    </>
  );
};

export default SidebarItems;
