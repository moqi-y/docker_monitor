import http from "@/utils/http";

export const getSystemInfo = () => {
    return http({
        url: "/api/system/info",
        method: "get",
    });
}