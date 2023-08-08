import { Tabs } from 'antd'
import styles from './styles.module.scss'
import TableIssue from './TableIssue'
import ColumnIssue from './ColumnIssue'

const SamplingPoint = () => {
    const items = [
        {
          key: '1',
          label: `List`,
          children: <TableIssue />,
        },
        {
          key: '2',
          label: `Board`,
          children: <ColumnIssue />,
        },
      ];

    return (
        <Tabs
            type="card"
            defaultActiveKey="1" items={items}
            className={styles['table-sampling-point']}
        />
    )
}

export default SamplingPoint
