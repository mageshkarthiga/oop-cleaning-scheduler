"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import ApexCharts from 'react-apexcharts';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function HomePage() {
  const [yearlyData, setYearlyData] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJSONData();
  }, []);

  const loadJSONData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/v0.1/admins/yearly-statistics/2024");
      const data = await response.data;
      parseJSONData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const parseJSONData = (data) => {
    setYearlyData(data.yearlyStats);
    setMonthlyData(data.monthlyStats);
  };

  const chartOptions = {
    chart: {
      type: 'pie',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '50%',
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  };

  // Generate chart data for clients
  const chartSeriesClients = (data) => [
    parseInt(data.clientYearlyReport.newClients),
    parseInt(data.clientYearlyReport.existingClients),
    parseInt(data.clientYearlyReport.terminatedClients),
  ];

  // Generate chart data for sessions
  const chartSeriesSessions = (data) => [
    parseInt(data.sessionYearlyReport.numFinishedSessions),
    parseInt(data.sessionYearlyReport.numCancelledSessions),
  ];

  // Generate chart data for workers
  const chartSeriesWorkers = (data) => [
    parseInt(data.workerYearlyReport.newWorkers),
    parseInt(data.workerYearlyReport.existingWorkers),
    parseInt(data.workerYearlyReport.terminatedWorkers),
  ];

  // Generate chart data for contracts
  const chartSeriesContracts = (data) => [
    parseInt(data.contractYearlyReport.newContracts),
    parseInt(data.contractYearlyReport.existingOngoingContracts),
    parseInt(data.contractYearlyReport.completedContracts),
  ];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const months = monthlyData.map(data => monthNames[data.month - 1]);

  // Separate data mappings for each report
  const sessionCounts = monthlyData.map(data => ({
    Finished: data.sessionMonthlyReport.numFinishedSessions,
    Cancelled: data.sessionMonthlyReport.numCancelledSessions
  }));

  const contractCounts = monthlyData.map(data => ({
    New: data.contractMonthlyReport.newContracts,
    Ongoing: data.contractMonthlyReport.existingOngoingContracts,
    Completed: data.contractMonthlyReport.completedContracts
  }));

  const workerCounts = monthlyData.map(data => ({
    New: data.workerMonthlyReport.newWorkers,
    Existing: data.workerMonthlyReport.existingWorkers,
    Terminated: data.workerMonthlyReport.terminatedWorkers
  }));

  const monthlyAreaChartOptions = {
    chart: {
      type: 'area',
      stacked: true,
    },
    xaxis: {
      categories: months,
      title: { text: 'Month' },
    },
    yaxis: {
      title: { text: 'Count' },
    },
    fill: {
      opacity: 0.8,
    },
    colors: ['#33b2df', '#546E7A', '#d4526e'],
    tooltip: {
      shared: true,
      intersect: false,
    },
    dataLabels: {
      enabled: false,
    },
    options: {
      chart: {
        width: '80%',
      },
    }
  };

  const monthlyAreaChartSeries = [
    {
      name: "New Clients",
      data: monthlyData.map(data => parseInt(data.clientMonthlyReport.newClients)),
    },
    {
      name: "Existing Clients",
      data: monthlyData.map(data => parseInt(data.clientMonthlyReport.existingClients)),
    },
    {
      name: "Terminated Clients",
      data: monthlyData.map(data => parseInt(data.clientMonthlyReport.terminatedClients)),
    }
  ];

  // Chart options for sessions, contracts, and workers
  const monthlySessionChartOptions = {
    chart: {
      type: 'area',
      stacked: true,
    },
    xaxis: {
      categories: months,
      title: { text: 'Month' },
    },
    yaxis: {
      title: { text: 'Session Count' },
    },
    colors: ['#5653FE', '#2983FF'],
    series: [
      { name: 'Finished Sessions', data: sessionCounts.map(count => parseInt(count.Finished)) },
      { name: 'Cancelled Sessions', data: sessionCounts.map(count => parseInt(count.Cancelled)) },
    ],
    dataLabels: {
      enabled: false,
    },
    options: {
      chart: {
        width: '80%',
      }
    }
  };

  const monthlyContractChartOptions = {
    chart: {
      type: 'area',
      stacked: true,
    },
    xaxis: {
      categories: months,
      title: { text: 'Month' },
    },
    yaxis: {
      title: { text: 'Contract Count' },
    },
    colors: ['#2196F3', '#9C27B0', '#673AB7'],
    series: [
      { name: 'New Contracts', data: contractCounts.map(count => parseInt(count.New)) },
      { name: 'Ongoing Contracts', data: contractCounts.map(count => parseInt(count.Ongoing)) },
      { name: 'Completed Contracts', data: contractCounts.map(count => parseInt(count.Completed)) },
    ],
    dataLabels: {
      enabled: false,
    },
    options: {
      chart: {
        width: '80%',
      }
    }
  };

  const monthlyWorkerChartOptions = {
    chart: {
      type: 'area',
      stacked: true,
    },
    xaxis: {
      categories: months,
      title: { text: 'Month' },
    },
    yaxis: {
      title: { text: 'Worker Count' },
    },
    colors: ['#FF9800', '#8BC34A', '#F44336'],
    series: [
      { name: 'New Workers', data: workerCounts.map(count => parseInt(count.New)) },
      { name: 'Existing Workers', data: workerCounts.map(count => parseInt(count.Existing)) },
      { name: 'Terminated Workers', data: workerCounts.map(count => parseInt(count.Terminated)) },
    ],
    dataLabels: {
      enabled: false,
    },
    options: {
      chart: {
        width: '80%',
      }
    }
  };

  // Debugging: Log the data being passed to the charts
  console.log("Monthly Data:", monthlyData);
  console.log("Monthly Area Chart Series:", monthlyAreaChartSeries);
  console.log("Monthly Session Chart Series:", monthlySessionChartOptions.series);
  console.log("Monthly Contract Chart Series:", monthlyContractChartOptions.series);
  console.log("Monthly Worker Chart Series:", monthlyWorkerChartOptions.series);

  return (
    <div className='mx-10'>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Admin Dashboard</h1>
      <Button label='Download Stats &nbsp;' icon="pi pi-file-excel" iconPos='right' severity='info' onClick={() =>  window.open('http://localhost:8080/api/v0.1/admins/download-statistics/2024')}/>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ProgressSpinner />
        </div>
      ) : (
        <TabView>
          <TabPanel header="Yearly" className="text-black hover:text-blue-500 active:text-blue-700 transition duration-200">
            <div className='container border-4 p-4 text-center'>
              <div className='flex flex-row space-x-5 mb-5'>
                <Card className='w-1/2'>
                  <div>
                    <h3 className="font-bold tracking-tight text-gray-900">{yearlyData.year} - Clients</h3>
                    <ApexCharts
                      options={{
                        ...chartOptions,
                        labels: ['New Clients', 'Existing Clients', 'Terminated Clients'],
                        colors: ['#33b2df', '#546E7A', '#d4526e'],
                      }}
                      series={chartSeriesClients(yearlyData)}
                      type="pie"
                    />
                  </div>
                </Card>
                <Card className='w-1/2'>
                  <div>
                    <h3 className="font-bold tracking-tight text-gray-900">{yearlyData.year} - Sessions</h3>
                    <ApexCharts
                      options={{
                        ...chartOptions,
                        labels: ['Finished Sessions', 'Cancelled Sessions'],
                        colors: ['#5653FE', '#2983FF'],
                      }}
                      series={chartSeriesSessions(yearlyData)}
                      type="pie"
                    />
                  </div>
                </Card>
              </div>
              <div className='flex flex-row space-x-5'>
                <Card className='w-1/2'>
                  <div>
                    <h3 className="font-bold tracking-tight text-gray-900">{yearlyData.year} - Workers</h3>
                    <ApexCharts
                      options={{
                        ...chartOptions,
                        labels: ['New Workers', 'Existing Workers', 'Terminated Workers'],
                        colors: ['#FF9800', '#8BC34A', '#F44336'],
                      }}
                      series={chartSeriesWorkers(yearlyData)}
                      type="pie"
                    />
                  </div>
                </Card>
                <Card className='w-1/2'>
                  <div>
                    <h3 className="font-bold tracking-tight text-gray-900">{yearlyData.year} - Contracts</h3>
                    <ApexCharts
                      options={{
                        ...chartOptions,
                        labels: ['New Contracts', 'Ongoing Contracts', 'Completed Contracts'],
                        colors: ['#2196F3', '#9C27B0', '#673AB7'],
                      }}
                      series={chartSeriesContracts(yearlyData)}
                      type="pie"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Monthly" className="text-black hover:text-blue-500 active:text-blue-700 transition duration-200">
            <div className='container border-4 p-4 text-center'>
              <div className='flex flex-row space-x-5 mb-5'>
                <Card className='w-full'>
                  <h3 className="font-bold tracking-tight text-gray-900">Client Trends</h3>
                  <ApexCharts
                    options={monthlyAreaChartOptions}
                    series={monthlyAreaChartSeries}
                    type="area"
                    height="350"
                  />
                </Card>
                <Card className='w-full'>
                  <h3 className="font-bold tracking-tight text-gray-900">Session Trends</h3>
                  <ApexCharts
                  options={monthlySessionChartOptions}
                  series={monthlySessionChartOptions.series}
                  type="area"
                  />
                </Card>
              </div>
              <div className='flex flex-row space-x-5'>
                <Card className='w-full'>
                  <h3 className="font-bold tracking-tight text-gray-900">Contract Trends</h3>
                  <ApexCharts
                  options={monthlyContractChartOptions}
                  series={monthlyContractChartOptions.series}
                  type="area"
                  />
                </Card>
                <Card className='w-full'>
                  <h3 className="font-bold tracking-tight text-gray-900">Worker Trends</h3>
                  <ApexCharts
                  options={monthlyWorkerChartOptions}
                  series={monthlyWorkerChartOptions.series}
                  type="area"
                  />
                </Card>
              </div>
            </div>
          </TabPanel>
        </TabView>
      )}
    </div>
  );
}
