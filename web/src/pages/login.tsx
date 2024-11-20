import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.css'
import { login } from '../api/login'
import { history } from 'umi';
const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        let res: any = await login({ name: values.username, password: values.password })
        if (res.code === 200) {
            message.success('登录成功！');
            history.push('/');
            setLoading(false);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userinfo', JSON.stringify(res.data.user));
        }
        else {
            message.error('用户名或密码错误！');
            setLoading(false);
        }
    };

    return (
        <div className='login-container'>
            <Card className="w-full max-w-md" style={{ width: '500px', margin: '0 auto' }}>
                <div className="text-center mb-8">
                    <Title level={2}>运维管理平台</Title>
                    <Text type="secondary">请登录您的账号,默认admin/admin123</Text>
                </div>

                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="用户名"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="密码"
                        />
                    </Form.Item>

                    {/* <Form.Item>
            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住密码</Checkbox>
              </Form.Item>
              <a className="text-blue-500 hover:text-blue-600">
                忘记密码？
              </a>
            </div>
          </Form.Item> */}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full"
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;