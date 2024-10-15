import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"
import {
  useToast as useToastOriginal,
  toast,
} from "@/components/ui/toast"

export { toast, type ToastProps }
export const useToast = useToastOriginal