import { useEffect, useRef, type ReactNode } from 'react'
import { CloseIcon } from './icons'

/** Modal that is a bottom sheet on phones and a centered dialog on wider screens. */
export function Sheet({ title, onClose, children }: { title: string; onClose(): void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current!
    dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="sheet__panel">
        <header className="sheet__header">
          <h2>{title}</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <CloseIcon width={20} height={20} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}
