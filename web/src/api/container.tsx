import http from "@/utils/http";

export const getContainerList = () => {
    return http({
        url: "/api/container/list",
        method: "get",
    });
}

// 改变容器状态
export const changeContainerStatus = (data) => {
    if (data.status == "stop") {
        return http({
            url: "/api/container/stop/" + data.containerName,
            method: "post",
            data
        });
    } else {
        return http({
            url: "/api/container/start/" + data.containerName,
            method: "post",
            data
        });
    }
}

//获取容器日志
export const getContainerLog = (data) => {
    return http({
        url: "/api/container/logs/" + data.containerName,
        method: "get",
    });
}

//向指定容器终端输入命令
export const sendCommand = (data) => {
    return http({
        url: "/api/container/terminal",
        method: "post",
        data
    })
}