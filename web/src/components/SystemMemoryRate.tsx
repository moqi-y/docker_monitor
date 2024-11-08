import { Pie } from '@ant-design/plots';

const SystemMemoryRate = (props: any) => {
  const memory_info = props.systemData?.systemInfo?.memory_info || { available: 0, used: 0 } ; 
  console.log("memory_info",memory_info);
  
  let tempData: Array<object> = [
    {
      type: '可使用内存',
      value: 100-Number(memory_info?.percent),
    },
    {
      type: '已使用内存',
      value: memory_info?.percent,
    }
  ]
  const config = {
    title: "内存使用率",
    data: tempData,
    loading: props.systemData?.systemInfo?.memory_info.total ? false : true,
    angleField: 'value',
    colorField: 'type',
    height: 280,
    radius: 1,
    label: {
      text: 'type',
      style: {
        fontWeight: 'bold',  
      }
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

export default SystemMemoryRate;