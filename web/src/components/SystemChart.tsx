import { Column } from '@ant-design/plots';

const SystemChart = (props: any) => {
  const dockerContainer = props.containerData?.dockerContainer || { containers: [] };
  const config = {
    title: "容器内存使用率",
    data: dockerContainer?.containers,
    xField: 'container_name',
    yField: 'memory_rate',
    label: {
      textBaseline: 'bottom',
    },
    style: {
      // 圆角样式
      radiusTopLeft: 10,
      radiusTopRight: 10,
    },
  };
  return <Column {...config} />;
};

export default SystemChart;
