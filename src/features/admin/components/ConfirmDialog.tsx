import Modal from './Modal';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger',
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center py-2">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
            variant === 'danger' ? 'bg-red-50' : 'bg-amber-50'
          }`}
        >
          <FiAlertTriangle
            className={`text-2xl ${variant === 'danger' ? 'text-red-500' : 'text-amber-500'}`}
          />
        </div>
        <p className="text-slate-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600 shadow-sm shadow-red-200'
                : 'bg-amber-500 hover:bg-amber-600 shadow-sm shadow-amber-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
