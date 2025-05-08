import { useSnackbar } from "notistack";

export default function useToast() {
  const { enqueueSnackbar } = useSnackbar();

  const showToast = (response: { success: boolean; message: string }) => {
    enqueueSnackbar(response.message, {
      variant: response.success ? "success" : "error",
      autoHideDuration: 3000,
    });
  };

  return { showToast };
}
