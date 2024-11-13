import http from "@/utils/http";

export const resetPath = () => {
    return http({
        url: "/api/reset_directory",
        method: "get",
    });
}

