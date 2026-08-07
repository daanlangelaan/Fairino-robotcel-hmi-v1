const controllerFaultMessages = new Map([
  [
    "4/1",
    "Asbotsing gedetecteerd: de robot heeft onverwachte weerstand op een as gemeten. Verwijder het obstakel en controleer of de arm vrij kan bewegen.",
  ],
]);

export function controllerFaultMessage(controllerError) {
  const mainCode = Number(controllerError?.mainCode || 0);
  const subCode = Number(controllerError?.subCode || 0);
  if (mainCode === 0 && subCode === 0) return null;
  return controllerFaultMessages.get(`${mainCode}/${subCode}`)
    || "Controllerstoring gedetecteerd. Controleer de robot en raadpleeg de Fairino WebApp voor meer informatie.";
}

export function overlayControllerFault({ discreteInputs, inputRegisters }, controllerError) {
  const mainCode = Number(controllerError?.mainCode || 0);
  const subCode = Number(controllerError?.subCode || 0);
  const controllerFaultActive = mainCode !== 0 || subCode !== 0;
  const modbusFaultActive = Boolean(
    discreteInputs.find((item) => item.name === "CELL_FAULT_ACTIVE")?.value,
  );
  const faultActive = controllerFaultActive || modbusFaultActive;
  const modbusFaultCode = Number(
    inputRegisters.find((item) => item.name === "CELL_FAULT_CODE")?.value || 0,
  );
  const faultCode = controllerFaultActive ? (mainCode || subCode) : modbusFaultCode;

  return {
    controllerFaultActive,
    faultActive,
    faultCode,
    discreteInputs: discreteInputs.map((item) => {
      if (item.name === "CELL_FAULT_ACTIVE") return { ...item, value: faultActive };
      if (item.name === "CELL_RUNNING" && faultActive) return { ...item, value: false };
      return item;
    }),
    inputRegisters: inputRegisters.map((item) => (
      item.name === "CELL_FAULT_CODE" ? { ...item, value: faultCode } : item
    )),
  };
}
