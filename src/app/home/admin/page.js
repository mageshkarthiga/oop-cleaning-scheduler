import React from 'react';
// import SparklineChart from '../components/SparklineChart';
// import AreaChart from '../components/AreaChart';
// import BarChart from '../components/BarChart';
import DonutChart from '../../components/DonutChart';

const Dashboard = () => {
    const sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

    return (
        <div>
            <h1>Dashboard</h1>
            {/* <div style={{ display: 'flex', gap: '20px' }}>
                <SparklineChart id="spark1" titleText="$424,652" subtitleText="Sales" seriesData={sparklineData} color="#DCE6EC" />
                <SparklineChart id="spark2" titleText="$235,312" subtitleText="Expenses" seriesData={sparklineData} color="#DCE6EC" />
                <SparklineChart id="spark3" titleText="$135,965" subtitleText="Profits" seriesData={sparklineData} color="#008FFB" />
            </div>
            <AreaChart />
            <BarChart /> */}
            <DonutChart />
        </div>
    );
};

export default Dashboard;
