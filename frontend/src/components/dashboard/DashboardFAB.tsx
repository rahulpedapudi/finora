import { useState, useRef, useEffect } from "react"
import { useAddTransaction } from "@/features/transactions/hooks/useAddTransactions"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, Loader2 } from "lucide-react"

export default function DashboardFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [rawInput, setRawInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const lastScrollY = useRef(0)

  const addTransaction = useAddTransaction()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rawInput.trim()) return

    addTransaction.mutate(
      { raw_input: rawInput },
      {
        onSuccess: () => {
          setRawInput("")
          setIsOpen(false)
        },
      }
    )
  }

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && !target.closest("#dashboard-fab-container")) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Handle scroll to show/hide FAB
  useEffect(() => {
    const mainElement = document.querySelector("main")
    if (!mainElement) return

    const handleScroll = () => {
      const currentScrollY = mainElement.scrollTop
      
      // Check if at the very bottom
      const isAtBottom = mainElement.scrollHeight - currentScrollY <= mainElement.clientHeight + 20
      
      if (isAtBottom) {
        setIsVisible(false)
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false)
        if (isOpen) setIsOpen(false)
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    mainElement.addEventListener("scroll", handleScroll, { passive: true })
    return () => mainElement.removeEventListener("scroll", handleScroll)
  }, [isOpen])

  return (
    <div
      id="dashboard-fab-container"
      className={`fixed right-4 bottom-24 z-50 flex items-center md:right-6 md:bottom-6 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`flex items-center overflow-hidden rounded-full border border-border bg-card shadow-md transition-all duration-300 ease-in-out ${
          isOpen
            ? "mr-2 w-[calc(100vw-6.5rem)] px-1 opacity-100 sm:w-80"
            : "w-0 border-transparent opacity-0 shadow-none"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex w-full items-center">
          <input
            ref={inputRef}
            type="text"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder='e.g. "250 swiggy" or "salary"'
            className="flex-1 bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 sm:px-4"
            disabled={addTransaction.isPending}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="mr-1 h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            disabled={!rawInput.trim() || addTransaction.isPending}
          >
            {addTransaction.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl transition-transform duration-300 ${
          isOpen
            ? "rotate-45 bg-muted text-foreground hover:bg-muted"
            : "bg-primary text-primary-foreground hover:scale-105 hover:bg-primary/90"
        }`}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
