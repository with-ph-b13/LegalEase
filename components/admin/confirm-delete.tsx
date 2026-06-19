"use client";

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export function ConfirmDeleteModal({ 
  onConfirm, 
  onCancel, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this?" 
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-base-100 p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-base-200">
        <h3 className="text-xl font-bold mb-2 text-error">{title}</h3>
        <p className="text-base-content/70 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button onClick={onConfirm} className="btn btn-error text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}
