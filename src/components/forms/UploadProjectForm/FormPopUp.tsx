"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/global/Modal";

export default function UploadModal({
  children,
  title,
  btnText,
}: {
  children: ReactNode;
  title: string;
  btnText: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <Button onClick={() => setIsOpen(true)}>{btnText}</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        {children}
      </Modal>
    </div>
  );
}
