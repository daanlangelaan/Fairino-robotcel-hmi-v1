const args = process.argv.slice(2);

function readArg(name, fallback) {
  const prefixed = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefixed));
  if (inline) {
    return inline.slice(prefixed.length);
  }

  const index = args.indexOf(`--${name}`);
  if (index !== -1 && args[index + 1] && !args[index + 1].startsWith("--")) {
    return args[index + 1];
  }

  return fallback;
}

function setEnv(name, value) {
  if (value !== undefined && value !== null && value !== "") {
    process.env[name] = String(value);
  }
}

const mode = readArg("mode", process.env.HMI_BRIDGE_MODE || "mock");
const fairinoHost = readArg("host", readArg("fairino-host", process.env.FAIRINO_HOST));
const fairinoPort = readArg("fairino-port", process.env.FAIRINO_PORT);
const unitId = readArg("unit-id", process.env.FAIRINO_UNIT_ID);
const port = readArg("port", process.env.PORT);
const bindHost = readArg("bind-host", process.env.HMI_BIND_HOST);
const fairinoHttpBase = readArg("fairino-http-base", process.env.FAIRINO_HTTP_BASE);

setEnv("HMI_BRIDGE_MODE", mode);
setEnv("FAIRINO_HOST", fairinoHost);
setEnv("FAIRINO_PORT", fairinoPort);
setEnv("FAIRINO_UNIT_ID", unitId);
setEnv("PORT", port);
setEnv("HMI_BIND_HOST", bindHost);
setEnv("FAIRINO_HTTP_BASE", fairinoHttpBase);

console.log("Fairino HMI starter");
console.log(`Mode:        ${process.env.HMI_BRIDGE_MODE || "mock"}`);
console.log(`HMI bind:    ${process.env.HMI_BIND_HOST || "127.0.0.1"}`);
console.log(`HMI port:    ${process.env.PORT || "8787"}`);
console.log(`Fairino:     ${process.env.FAIRINO_HOST || "192.168.92.128"}:${process.env.FAIRINO_PORT || "502"}`);

await import("../hmi/server.mjs");
