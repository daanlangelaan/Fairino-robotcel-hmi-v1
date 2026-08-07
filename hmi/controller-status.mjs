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
