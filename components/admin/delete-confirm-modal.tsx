'use client'

import { motion } from 'framer-motion'

interface DeleteConfirmModalProps {
  productName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  productName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 bg-background border border-border p-6"
      >
        <h3 className="font-serif text-xl text-foreground mb-2">
          Delete Product
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete &quot;{productName}&quot;? This action cannot be undone.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm tracking-widest uppercase border border-border text-foreground hover:bg-muted transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-sm tracking-widest uppercase bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </>
  )
}
