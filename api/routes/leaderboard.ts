import Route from "./route";
import type ApiRequest from "../domain/apirequest";
import ApiResponse from "../domain/apiresponse";
import Leaderboard from "../domain/leaderboard";

class LeaderboardRoute extends Route {
  async pathParamHandle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod("get")) return ApiResponse.badRequest(req);

    const leaderboardId = req.getPathParam("leaderboardId");
    if (!leaderboardId) return ApiResponse.badRequest(req);

    const leaderboard = await req.services.leaderboard.get(leaderboardId);
    if (!leaderboard) return ApiResponse.noContent(req);

    return ApiResponse.ok(req, leaderboard.toJson());
  }

  async handle(req: ApiRequest): Promise<ApiResponse> {
    if (!req.checkMethod(["put"])) return ApiResponse.methodNotAllowed(req);
    if (!req.checkPermission("admin")) return ApiResponse.forbidden(req);

    const leaderboard = await req.parse(Leaderboard);
    if (!leaderboard) return ApiResponse.badRequest(req);

    try {
      const lb = await req.services.leaderboard.upsert(leaderboard);
      return ApiResponse.created(req, lb.toJson());
    } catch (error) {
      req.logger.error("Failed to upsert leaderboard", error as Error, {
        player: leaderboard.toJson(),
      });
      return ApiResponse.badRequest(req);
    }
  }
}

export default new LeaderboardRoute();
