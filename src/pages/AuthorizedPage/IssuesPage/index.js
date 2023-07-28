import { useContext } from 'react'
import { Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'

import styles from './styles.module.scss'
import TableIssue from './TableIssue'
import ColumnIssue from './ColumnIssue'
const { TabPane } = Tabs

const SamplingPoint = () => {
    return (
        <Tabs
            type="card"
            className={styles['table-sampling-point']}
        >
            <TabPane
                tab="List"
                key={1}
            >
                <TableIssue />
            </TabPane>
            <TabPane
                tab="Board"
                key={2}
            >
                <ColumnIssue />
            </TabPane>
        </Tabs>
    )
}

export default SamplingPoint
