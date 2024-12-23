import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import admin from "./admin";
import player from "./player";
import ready from "./ready";

function getHandle(req: ApiRequest): (req: ApiRequest) => Promise<ApiResponse> {
  if (req.checkPath(["/ready", "/api/ready"])) return ready.handle;
  if (req.checkPath("/api/admin")) return admin.handle;

  if (req.checkPath("/api/player/{accountId}")) return player.pathParamHandle;
  if (req.checkPath("/api/player")) return player.handle;

  return Route.defaultHandle;
}

async function handle(req: ApiRequest): Promise<ApiResponse> {
  let response: ApiResponse;
  try {
    response = await getHandle(req)(req);
  } catch (error) {
    req.error = error as Error;
    response = await Route.errorHandle(req);
  }
  return response;
}

export default handle;
