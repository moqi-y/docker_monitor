import { message } from 'antd';
import { history } from 'umi';

function http(obj: object) {
    return new Promise((resolve, reject) => {
        // 检查请求方法是否为 GET 或 HEAD，如果是，则不包含 body
        const options = {
            method: obj.method || 'GET',
            headers: obj.headers || {
                'Content-Type': 'application/json',
                "token": localStorage.getItem("token") || '',
            },
        };
        // 如果请求方法不是 GET 或 HEAD，则添加 body
        if (obj.method && !['GET', 'HEAD'].includes(obj.method.toUpperCase())) {
            options.body = JSON.stringify(obj.body) || JSON.stringify(obj.data) || '';
        }

        fetch(obj.url, options)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    if (res.status === 401) {
                        history.push('/login');
                        message.error('用户名或密码错误！');
                    }
                    else {
                        message.error(res.statusText);
                    }
                }
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export default http;