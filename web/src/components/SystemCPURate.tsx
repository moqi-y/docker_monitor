import { Pie } from '@ant-design/plots';

const SystemCPURate = (props: any) => {
  const systemInfo = props.systemData?.systemInfo || { cpu_usage: 0 }; 
  let tempData: Array<object> = [
    {
      type: '可使用CPU',
      value: 100 - Number(systemInfo?.cpu_usage),
    },
    {
      type: '已使用CPU',
      value: systemInfo?.cpu_usage,
    }
  ]
  const config = {
    title: "CPU使用率",
    data: tempData,
    loading: props.systemData?.systemInfo ? false : true,
    angleField: 'value',
    colorField: 'type',
    height: 280,
    radius: 1,
    label: {
      text: 'type',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };
  return <Pie {...config} />;
};

export default SystemCPURate;