import { Button, Result } from 'antd';
function Source() {
    return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={<Button type="primary" onClick={() => window.location.href = '/'}>Back Home</Button>}
        />
    )
}

export default Source;