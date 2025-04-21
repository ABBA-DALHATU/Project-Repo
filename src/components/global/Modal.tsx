"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({
  isOpen = false,
  onClose,
  children,
  title,
}: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="flex items-center justify-between">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
