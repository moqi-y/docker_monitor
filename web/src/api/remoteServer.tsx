import http from "@/utils/http";

/**
 * 获取远程服务器列表
 */
export const getRemoteServerList = () => {
    return http({
        url: "/api/server/list",
        method: "get"
    })
}


/**
 * 远程ssh
 * @returns 获取远程服务器的ssh
 */
export const sendSSH = (data) => {
    return http({
        url: "/api/ssh",
        method: "post",
        data
    });
}

/**
 * 断开远程ssh
 **/
export const closeSSH = (data) => {
    return http({
        url: "/api/ssh/close",
        method: "post",
        data
    })
}