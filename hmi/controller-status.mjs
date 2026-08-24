// Transcribed and translated from the FAIRINO Collaborative Robot User Manual
// 3.9.8, Appendix 20.1: "Motion controller errors and handling methods".
// Keep this catalog in sync when the production controller firmware changes.
const controllerFaultCatalog = new Map();

function addFaults(mainCode, descriptions, resettable = true) {
  Object.entries(descriptions).forEach(([subCode, description]) => {
    controllerFaultCatalog.set(`${mainCode}/${subCode}`, {
      mainCode,
      subCode: Number(subCode),
      description,
      resettable: typeof resettable === "function"
        ? resettable(Number(subCode))
        : resettable,
    });
  });
}

addFaults(1, {
  1: "Gewrichtsdoelpunt ongeldig",
  2: "Lineair doelpunt ongeldig of actief gereedschap komt niet overeen",
  3: "Boog-tussenpunt ongeldig of actief gereedschap komt niet overeen",
  4: "Boog-doelpunt ongeldig of actief gereedschap komt niet overeen",
  5: "Boog-commandopunten liggen te dicht bij elkaar",
  6: "Tussenpunt 1 van de volledige cirkel- of helixbeweging is ongeldig",
  7: "Tussenpunt 2 van de volledige cirkel- of helixbeweging is ongeldig",
  8: "Tussenpunt 3 van de volledige cirkel- of helixbeweging is ongeldig",
  9: "Commandopunten van de volledige cirkel- of helixbeweging liggen te dicht bij elkaar",
  10: "TPD-commandopunt ongeldig",
  11: "Het gereedschap van het TPD-commando komt niet overeen met het actieve gereedschap",
  12: "Afwijking tussen het huidige TPD-commando en het startpunt van het volgende commando is te groot",
  13: "Omschakelen tussen intern en extern gereedschap mislukt",
  14: "Startpunt van de nieuwe helixbeweging is ongeldig",
  15: "Commandopunt van de nieuwe splinebeweging is ongeldig",
  17: "PTP-gewrichtscommando overschrijdt een limiet",
  18: "TPD-gewrichtscommando overschrijdt een limiet",
  19: "LIN- of ARC-gewrichtscommando overschrijdt een limiet",
  20: "Snelheidslimiet van een Cartesisch commando overschreden",
  21: "Koppellimiet van een gewrichtscommando overschreden",
  22: "JOG-gewrichtscommando overschrijdt een limiet",
  23: "Snelheidslimiet van gewrichtscommando op as 1 overschreden",
  24: "Snelheidslimiet van gewrichtscommando op as 2 overschreden",
  25: "Snelheidslimiet van gewrichtscommando op as 3 overschreden",
  26: "Snelheidslimiet van gewrichtscommando op as 4 overschreden",
  27: "Snelheidslimiet van gewrichtscommando op as 5 overschreden",
  28: "Snelheidslimiet van gewrichtscommando op as 6 overschreden",
  29: "Snelheidslimiet van de gewrichtsfeedback overschreden",
  30: "Afwijking tussen gewrichtscommando en feedback is te groot; herstart vereist",
  31: "DMP-doelpunt ongeldig of actief gereedschap komt niet overeen",
  33: "Gewrichtsconfiguratie van het volgende commando verandert of bevat een singuliere houding",
  34: "Gewrichtsconfiguratie van het huidige commando verandert of bevat een singuliere houding",
  35: "Gewrichtssnelheidslimiet van een LIN-commando overschreden",
  36: "Adaptieve snelheid van een LIN-commando overschrijdt de drempel",
  37: "Punt in het bewegingstraject is niet bereikbaar",
  38: "Punt in het bewegingstraject is door een singuliere houding niet bereikbaar",
  49: "Tussen ARCSTART en ARCEND is een ander commando dan LIN of ARC gebruikt",
  50: "Tussen WEAVESTART en WEAVEEND is een ander commando dan LIN of ARC gebruikt",
  51: "Weefparameter ongeldig",
  52: "Commandopunten van de weefbeweging liggen te dicht bij elkaar",
  53: "Punt in het weeftraject is door een singuliere houding niet bereikbaar",
  54: "Punt in het weeftraject overschrijdt een gewrichtslimiet",
  55: "Weeftraject kan niet worden gepland doordat gereedschapsrichting Z samenvalt met voorwaartse richting X",
  56: "Boog-tussenpunt in het weeftraject is ongeldig",
  65: "Afwijking van het lasersensorcommando is te groot",
  66: "Lasersensorcommando onderbroken; naadvolging is voortijdig beëindigd",
  81: "Snelheidslimiet van een externe-ascommando overschreden",
  82: "Afwijking tussen commando en feedback van de externe as is te groot; refereren of herstarten vereist",
  83: "Communicatiefout met uitgebreide periferie, externe as of I/O",
  84: "Pakketverlies in communicatie met uitgebreide periferie, externe as of I/O",
  97: "Bij transportbandvolging is de houdingsverandering tussen start- en referentiepunt te groot",
  113: "Constante-krachtregeling overschrijdt de maximale correctieafstand in X-richting",
  114: "Constante-krachtregeling overschrijdt de maximale correctieafstand in Y-richting",
  115: "Constante-krachtregeling overschrijdt de maximale correctieafstand in Z-richting",
  116: "Constante-krachtregeling overschrijdt de maximale correctiehoek in RX-richting",
  117: "Constante-krachtregeling overschrijdt de maximale correctiehoek in RY-richting",
  118: "Constante-krachtregeling overschrijdt de maximale correctiehoek in RZ-richting",
  119: "Data van de externe sensor is ongeldig",
  120: "Verkennende helixbeweging mislukt",
  121: "Roterende insertiebeweging mislukt",
  122: "Lineaire insertiebeweging mislukt",
  123: "Oppervlaktepositionering mislukt",
  129: "Maximumaantal meetpunten voor koppelregistratie overschreden",
  130: "Omschakelen van snelheid mislukt",
  147: "Focusvolging mislukt",
  148: "Snelheidslimiet van de robothouding overschreden",
  149: "Feedback van het gewrichtsstatuswoord is ongeldig",
}, (subCode) => ![20, 29, 30, 82].includes(subCode));

for (let axis = 1; axis <= 6; axis += 1) {
  addFaults(2, { [axis]: `Aandrijffout op as ${axis}` }, false);
  addFaults(3, { [axis]: `Softlimit van as ${axis} overschreden` });
  addFaults(4, { [axis]: `Botsing op as ${axis} gedetecteerd` });
  addFaults(11, { [axis]: `Communicatiefout met de aandrijving van as ${axis}` }, false);
}
addFaults(4, { 7: "Botsing van de eindeffector gedetecteerd" });

addFaults(5, {
  1: "Aantal actieve slaves is onjuist",
}, false);

addFaults(6, {
  1: "Slave is offline",
  2: "Slavestatus komt niet overeen met de ingestelde waarde",
  3: "Slave is niet geconfigureerd",
  4: "Slaveconfiguratie is ongeldig",
  5: "Initialisatie van de slave is mislukt",
  6: "Initialisatie van de mailboxcommunicatie met de slave is mislukt",
}, false);

addFaults(7, {
  1: "I/O-kanaal ongeldig",
  2: "I/O-waarde ongeldig",
  3: "Wachttijd voor digitale ingang WaitDI verstreken",
  4: "Wachttijd voor analoge ingang WaitAI verstreken",
  5: "Wachttijd voor digitale gereedschapsingang WaitAxleDI verstreken",
  6: "Wachttijd voor analoge gereedschapsingang WaitAxleAI verstreken",
  7: "Geconfigureerde functie van het I/O-kanaal is ongeldig",
  8: "Wachttijd voor boogstart verstreken",
  9: "Wachttijd voor boogeinde verstreken",
  10: "Wachttijd voor zoekpositionering verstreken",
  11: "Wachttijd voor I/O-detectie van de transportband verstreken",
  12: "Wachttijd voor digitale externe ingang WaitAuxDI verstreken",
  13: "Wachttijd voor analoge externe ingang WaitAuxAI verstreken",
  14: "Wachttijd voor lasdraad-zoekpositionering verstreken",
});

addFaults(8, {
  1: "Time-out tijdens de grijperbeweging",
});

addFaults(9, {
  1: "Versie van het zbt-configuratiebestand is ongeldig; initialisatiefout",
  2: "Laden van het zbt-configuratiebestand is mislukt; initialisatiefout",
  3: "Versie van het gebruikersconfiguratiebestand is ongeldig; initialisatiefout",
  4: "Laden van het gebruikersconfiguratiebestand is mislukt; initialisatiefout",
  5: "Versie van het externe-asconfiguratiebestand is ongeldig; initialisatiefout",
  6: "Laden van het externe-asconfiguratiebestand is mislukt; initialisatiefout",
  7: "Robotmodel komt niet overeen en moet opnieuw worden geconfigureerd",
  8: "Versie van het DH-parameterbestand is ongeldig; initialisatiefout",
  9: "Laden van het DH-parameterbestand is mislukt; initialisatiefout",
  10: "Robotmodel is niet ingesteld",
  11: "Versie van het belastingsconfiguratiebestand is ongeldig; initialisatiefout",
  12: "Laden van het belastingsconfiguratiebestand is mislukt; initialisatiefout",
  13: "Versie van het snelheidsconfiguratiebestand is ongeldig; initialisatiefout",
  14: "Laden van het snelheidsconfiguratiebestand is mislukt; initialisatiefout",
}, false);

addFaults(10, {
  1: "Singuliere robothouding gedetecteerd",
}, null);

for (let axis = 1; axis <= 4; axis += 1) {
  addFaults(12, { [axis]: `Softlimit van externe as ${axis} overschreden` });
}

addFaults(13, {
  1: "Gereedschapsnummer valt buiten het toegestane bereik",
  2: "Drempel voor positionering-gereed is ongeldig",
  3: "Botsingsniveau is ongeldig",
  4: "Belastingsgewicht is ongeldig",
  5: "X-waarde van het massamiddelpunt is ongeldig",
  6: "Y-waarde van het massamiddelpunt is ongeldig",
  7: "Z-waarde van het massamiddelpunt is ongeldig",
  8: "Filtertijd van de digitale ingang is ongeldig",
  9: "Filtertijd van de digitale gereedschapsingang is ongeldig",
  10: "Filtertijd van de analoge ingang is ongeldig",
  11: "Filtertijd van de analoge gereedschapsingang is ongeldig",
  12: "Hoog-/laagniveaubereik van de digitale ingang is ongeldig",
  13: "Hoog-/laagniveaubereik van de digitale uitgang is ongeldig",
  14: "Werkstuknummer valt buiten het toegestane bereik",
  15: "Nummer van de externe as valt buiten het toegestane bereik",
  16: "Encoderkanaal van de transportband is ongeldig",
  17: "Werkstuk-asnummer van de transportband is ongeldig",
});

const resetGuidanceByMainCode = new Map([
  [1, "Laat technisch personeel het robotpunt en programma controleren. Gebruik Reset pas nadat de oorzaak is verholpen."],
  [3, "Laat technisch personeel de betreffende as veilig binnen de softlimit brengen en druk daarna eenmaal op Reset."],
  [4, "Verwijder de botsingsoorzaak, controleer dat de volledige robotbaan en cel vrij zijn en druk daarna eenmaal op Reset."],
  [7, "Controleer het genoemde I/O-signaal, de sensor en de bekabeling. Verhelp de oorzaak en druk daarna eenmaal op Reset."],
  [8, "Controleer de grijper op blokkering, materiaal en verbindingen. Verhelp de oorzaak en druk daarna eenmaal op Reset."],
  [12, "Laat technisch personeel de externe as veilig binnen de softlimit brengen en druk daarna eenmaal op Reset."],
  [13, "Laat technisch personeel de genoemde parameter controleren en corrigeren en druk daarna eenmaal op Reset."],
]);

const defaultResetGuidance = "Verhelp de oorzaak, controleer dat de robotbaan en cel vrij zijn en druk daarna eenmaal op Reset.";
const notResettableGuidance = "Volgens Fairino is deze storing niet resetbaar via de HMI. Stop de cel en schakel technisch personeel in; blijf niet op Reset drukken.";
const unknownGuidance = "Stop de cel en laat technisch personeel de robotpositie en het programma controleren voordat de cel opnieuw wordt gestart.";

export function controllerFaultInfo(controllerError) {
  const mainCode = Number(controllerError?.mainCode || 0);
  const subCode = Number(controllerError?.subCode || 0);
  if (mainCode === 0 && subCode === 0) return null;
  return controllerFaultCatalog.get(`${mainCode}/${subCode}`) || null;
}

export function controllerFaultMessage(controllerError) {
  const mainCode = Number(controllerError?.mainCode || 0);
  const subCode = Number(controllerError?.subCode || 0);
  if (mainCode === 0 && subCode === 0) return null;

  const fault = controllerFaultInfo({ mainCode, subCode });
  if (!fault) {
    return "Onbekende controllerstoring. Stop de werkzaamheden, controleer of de robotbaan vrij is en schakel technisch personeel in. De foutcode blijft zichtbaar op de HMI voor diagnose.";
  }

  let guidance = unknownGuidance;
  if (fault.resettable === false) guidance = notResettableGuidance;
  if (fault.resettable === true) {
    guidance = resetGuidanceByMainCode.get(mainCode) || defaultResetGuidance;
  }
  return `${fault.description}. ${guidance}`;
}

export function overlayControllerFault(
  { discreteInputs, inputRegisters },
  controllerError,
  {
    hmiEstopActive = false,
    controllerProgramState = null,
    controllerProgramMatches = null,
    luaHeartbeatFresh = null,
  } = {},
) {
  const mainCode = Number(controllerError?.mainCode || 0);
  const subCode = Number(controllerError?.subCode || 0);
  const controllerFaultActive = mainCode !== 0 || subCode !== 0;
  const modbusFaultActive = Boolean(
    discreteInputs.find((item) => item.name === "CELL_FAULT_ACTIVE")?.value,
  );
  const faultActive = controllerFaultActive || modbusFaultActive || hmiEstopActive;
  const modbusFaultCode = Number(
    inputRegisters.find((item) => item.name === "CELL_FAULT_CODE")?.value || 0,
  );
  const faultCode = controllerFaultActive
    ? (mainCode || subCode)
    : (hmiEstopActive ? 991 : modbusFaultCode);

  return {
    controllerFaultActive,
    faultActive,
    faultCode,
    discreteInputs: discreteInputs.map((item) => {
      if (item.name === "CELL_FAULT_ACTIVE") return { ...item, value: faultActive };
      if (item.name === "CELL_RUNNING" && (
        faultActive
        || controllerProgramState === 1
        || controllerProgramMatches === false
        || luaHeartbeatFresh === false
      )) {
        return { ...item, value: false };
      }
      return item;
    }),
    inputRegisters: inputRegisters.map((item) => (
      item.name === "CELL_FAULT_CODE" ? { ...item, value: faultCode } : item
    )),
  };
}
