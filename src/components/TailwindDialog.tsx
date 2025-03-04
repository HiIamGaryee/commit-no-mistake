import React from "react";

interface TailwindDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const TailwindDialog: React.FC<TailwindDialogProps> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="w-[560px] h-[600px] relative bg-white rounded-lg shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-black hover:text-gray-600"
          aria-label="Close"
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default TailwindDialog;
