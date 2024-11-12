import http from "@/utils/http";

/**
 *  登录接口
 * @param data {username,password}
 * @returns 
 */
export const login = (data:object) => {
    return http({
        url: "/api/login",
        method: "post",
        data
    });
}