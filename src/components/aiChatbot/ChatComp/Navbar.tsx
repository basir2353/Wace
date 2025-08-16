import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetOverlay,
} from "@/components/ui/sheet";
import { Button as ShadCNBtn } from "@/components/ui/button";
import SideBar from "../Sidebar";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="h-14 py-2 xl:hidden">
      <div className="w-[95%] left-1/2 -translate-x-1/2 fixed  bg-background top-0 z-[20] py-2 px-4 md:px-8">
        <Sheet>
          <SheetTrigger asChild >
            <ShadCNBtn variant="outline" className="p-3 max-md:ml-auto max-md:!flex max-md:mr-6">
              <Menu size={26} color="white" />
            </ShadCNBtn>
          </SheetTrigger>
          <SheetContent side={"left"} className="!max-w-[300px] px-2 pt-4">
            <SheetOverlay asChild />

            <SideBar />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
