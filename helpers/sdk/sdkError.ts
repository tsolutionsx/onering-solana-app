import Notification from "../../components/Notification";

type ErrorProps = {
  e: any
  notificate?: boolean
}
export default function showError({ e, notificate = false }: ErrorProps) {
  let err = e.error || e;
  let message = err.message
  
  if (err.logs) {
    const log = err.logs.find((logError: string) => logError.includes("Error Number:"))  
    // const errorNumber = log.substring(log.indexOf("Error Number:") + 13, log.indexOf("Error Message:") -2)
    const errorMessage = log.substring(log.indexOf("Error Message:") + 14, log.length)
    // message = `Error: ${errorNumber} - ${errorMessage}`
    message = errorMessage;
  }

  if (notificate) {
    Notification({
      type: "error",
      title: "Transaction failure",
      message,
      link: "",
    });
  }

  console.log(e);
}