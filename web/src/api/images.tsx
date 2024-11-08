import http from "@/utils/http";

export const getImagesList = () => {
    return http({
        url: "/api/image/list",
        method: "get",
    });
}