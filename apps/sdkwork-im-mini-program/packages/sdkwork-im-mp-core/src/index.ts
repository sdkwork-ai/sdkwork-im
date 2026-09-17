/**
 * SDKWork IM mini program core public integration boundary.
 *
 * Exposes the dependency composition entry and the host adapter contracts
 * only. SDK construction stays behind the `./sdk` subpath; platform adapter
 * implementations stay in `@sdkwork/im-mp-host`.
 */
export * from "./composition/dependency-manifest";
export * from "./composition/sdk-inventory";
export * from "./host/hostAdapterContracts";
