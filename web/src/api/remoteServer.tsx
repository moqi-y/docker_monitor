import http from "@/utils/http";

/**
 * 获取远程服务器列表
 */
export const getRemoteServerList = (query: string) => {
    return http({
        url: "/api/server/list/" + query,
        method: "get"
    })
}

/**
 * 添加远程服务器
 */
export const addRemoteServer = (data: any) => {
    return http({
        url: "/api/server/add",
        method: "post",
        data
    })
}

/**
 * 删除远程服务器
 **/
export const deleteRemoteServer = (query: string) => {
    return http({
        url: "/api/server/delete/" + query,
        method: "delete"
    })
}


/**
 * 远程ssh
 * @returns 获取远程服务器的ssh
 */
export const sendSSH = (data:any) => {
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