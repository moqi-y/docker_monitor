import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import { Skeleton } from 'antd';
const ContainerRate = (props: any) => {

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '逻辑处理器',
      children: props.systemData?.systemInfo?.system_info?.cpu_logical_cores,
    },
    {
      key: '2',
      label: '物理处理器',
      children: props.systemData?.systemInfo?.system_info?.cpu_physical_cores,
    },
    {
      key: '3',
      label: 'CPU使用率',
      children: props.systemData?.systemInfo?.cpu_usage + '%',
    },
    {
      key: '4',
      label: '内存总量',
      children: props.systemData.systemInfo?.memory_info.total.toFixed(2) + 'GB',
    },
    {
      key: '5',
      label: '内存占用率',
      children: props.systemData.systemInfo?.memory_info.percent + '%',
    },
  ];
  if (props.systemData?.systemInfo) {
    return <Descriptions title="系统信息" items={items} style={{ padding: '20px' }} />;
  }
  return <Skeleton style={{ padding: '20px' }} />;
};

export default ContainerRate;