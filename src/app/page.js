"use client";
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { readRemoteFile } from "react-papaparse";
import ApexCharts from 'react-apexcharts';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function HomePage() {
  const [yearlyData, setYearlyData] = useState([]);
  const [yearlyWorkerHours, setYearlyWorkerHours] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyWorkerHours, setMonthlyWorkerHours] = useState([]);
  const [weeklyWorkerHours, setWeeklyWorkerHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCSVData();
  }, []);

  const loadCSVData = () => {
    setLoading(true);
    readRemoteFile("http://localhost:8080/api/v0.1/admins/download-statistics/2024", {
      complete: (result) => {
        parseCSVData(result.data);
        setLoading(false);
      },
      download: true,
      header: false // Disable headers to handle multiple sections manually
    });
  };

  const parseCSVData = (data) => {
    let currentSection = '';
    let sectionData = [];

    data.forEach((row, index) => {
      const rowValue = row[0]?.trim(); // Trim whitespace from row values

      // Identify section headers and save data when switching sections
      if (rowValue === "Yearly Data" || rowValue === "Yearly Worker Hours" || rowValue === "Monthly Data" || rowValue === "Monthly Worker Hours" || rowValue === "Weekly Worker Hours") {
        // Save previous section data
        saveSectionData(currentSection, sectionData);
        // Set new section and reset data collection
        currentSection = rowValue;
        sectionData = [];
      } else {
        sectionData.push(row);
      }
    });

    // Save the final section data
    saveSectionData(currentSection, sectionData);
  };

  const saveSectionData = (section, data) => {
    if (section === "Yearly Data") {
      setYearlyData(parseYearlyData(data));
    } else if (section === "Yearly Worker Hours") {
      setYearlyWorkerHours(parseYearlyWorkerHours(data));
    } else if (section === "Monthly Data") {
      setMonthlyData(parseMonthlyData(data));
    } else if (section === "Monthly Worker Hours") {
      setMonthlyWorkerHours(parseMonthlyWorkerHours(data));
    } else if (section === "Weekly Worker Hours") {
      setWeeklyWorkerHours(parseWeeklyWorkerHours(data));
    }
  };

  const parseYearlyData = (data) => {
    const header = data[0];
    const yearlyDataRows = data.slice(1); // Ignore header row
    return yearlyDataRows
      .filter(row => row[0]?.trim() !== "")
      .map((row) => ({
        Year: row[0],
        TotalNewClients: row[1],
        TotalExistingClients: row[2],
        TotalTerminatedClients: row[3],
        TotalFinishedSessions: row[4],
        TotalCancelledSessions: row[5],
        TotalNewContracts: row[6],
        TotalExistingOngoingContracts: row[7],
        TotalCompletedContracts: row[8],
        TotalNewWorkers: row[9],
        TotalExistingWorkers: row[10],
        TotalTerminatedWorkers: row[11],
      }));
  };

  const parseYearlyWorkerHours = (data) => {
    return data.slice(1)
      .filter(row => row[0]?.trim() !== "")
      .map((row) => ({
        Year: row[0],
        WorkerId: row[1],
        TotalHours: row[2],
        OverTimeHours: row[3],
      }));
  };

  const parseMonthlyData = (data) => {
    return data.slice(1)
      .filter(row => row[0]?.trim() !== "")
      .map((row) => ({
        Year: row[0],
        Month: row[1],
        TotalNewClients: row[2],
        TotalExistingClients: row[3],
        TotalTerminatedClients: row[4],
        TotalFinishedSessions: row[5],
        TotalCancelledSessions: row[6],
        TotalNewContracts: row[7],
        TotalExistingOngoingContracts: row[8],
        TotalCompletedContracts: row[9],
        TotalNewWorkers: row[10],
        TotalExistingWorkers: row[11],
        TotalTerminatedWorkers: row[12],
      }));
  };

  const parseMonthlyWorkerHours = (data) => {
    return data.slice(1)
      .filter(row => row[0]?.trim() !== "")
      .map((row) => ({
        Year: row[0],
        Month: row[1],
        WorkerId: row[2],
        TotalHours: row[3],
        OverTimeHours: row[4],
      }));
  };

  const parseWeeklyWorkerHours = (data) => {
    return data.slice(1)
      .filter(row => row[0]?.trim() !== "")
      .map((row) => ({
        Year: row[0],
        WeekStart: row[1],
        WeekEnd: row[2],
        WorkerId: row[3],
        TotalHours: row[4],
        OverTimeHours: row[5],
      }));
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
    parseInt(data.TotalNewClients),
    parseInt(data.TotalExistingClients),
    parseInt(data.TotalTerminatedClients),
  ];

  // Generate chart data for sessions
  const chartSeriesSessions = (data) => [
    parseInt(data.TotalFinishedSessions),
    parseInt(data.TotalCancelledSessions),
  ];

  // Generate chart data for workers
  const chartSeriesWorkers = (data) => [
    parseInt(data.TotalNewWorkers),
    parseInt(data.TotalExistingWorkers),
    parseInt(data.TotalTerminatedWorkers),
  ];

  // Generate chart data for contracts
  const chartSeriesContracts = (data) => [
    parseInt(data.TotalNewContracts),
    parseInt(data.TotalExistingOngoingContracts),
    parseInt(data.TotalCompletedContracts),
  ];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const months = monthlyData.map(data => monthNames[data.Month - 1]);

  // Separate data mappings for each report
  const sessionCounts = monthlyData.map(data => ({
    Finished: data.TotalFinishedSessions,
    Cancelled: data.TotalCancelledSessions
  }));

  const contractCounts = monthlyData.map(data => ({
    New: data.TotalNewContracts,
    Ongoing: data.TotalExistingOngoingContracts,
    Completed: data.TotalCompletedContracts
  }));

  const workerCounts = monthlyData.map(data => ({
    New: data.TotalNewWorkers,
    Existing: data.TotalExistingWorkers,
    Terminated: data.TotalTerminatedWorkers
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
      data: monthlyData.map(data => data.TotalNewClients),
    },
    {
      name: "Existing Clients",
      data: monthlyData.map(data => data.TotalExistingClients),
    },
    {
      name: "Terminated Clients",
      data: monthlyData.map(data => data.TotalTerminatedClients),
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
      { name: 'Finished Sessions', data: sessionCounts.map(count => count.Finished) },
      { name: 'Cancelled Sessions', data: sessionCounts.map(count => count.Cancelled) },
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
      { name: 'New Contracts', data: contractCounts.map(count => count.New) },
      { name: 'Ongoing Contracts', data: contractCounts.map(count => count.Ongoing) },
      { name: 'Completed Contracts', data: contractCounts.map(count => count.Completed) },
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
      { name: 'New Workers', data: workerCounts.map(count => count.New) },
      { name: 'Existing Workers', data: workerCounts.map(count => count.Existing) },
      { name: 'Terminated Workers', data: workerCounts.map(count => count.Terminated) },
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
                  {yearlyData.map((data, index) => (
                    <div key={index}>
                      <h3 className="font-bold tracking-tight text-gray-900">{data.Year} - Clients</h3>
                      <ApexCharts
                        options={{
                          ...chartOptions,
                          labels: ['New Clients', 'Existing Clients', 'Terminated Clients'],
                          colors: ['#33b2df', '#546E7A', '#d4526e'],
                        }}
                        series={chartSeriesClients(data)}
                        type="pie"
                      />
                    </div>
                  ))}
                </Card>
                <Card className='w-1/2'>
                  {yearlyData.map((data, index) => (
                    <div key={index}>
                      <h3 className="font-bold tracking-tight text-gray-900">{data.Year} - Sessions</h3>
                      <ApexCharts
                        options={{
                          ...chartOptions,
                          labels: ['Finished Sessions', 'Cancelled Sessions'],
                          colors: ['#5653FE', '#2983FF'],
                        }}
                        series={chartSeriesSessions(data)}
                        type="pie"
                      />
                    </div>
                  ))}
                </Card>
              </div>
              <div className='flex flex-row space-x-5'>
                <Card className='w-1/2'>
                  {yearlyData.map((data, index) => (
                    <div key={index}>
                      <h3 className="font-bold tracking-tight text-gray-900">{data.Year} - Workers</h3>
                      <ApexCharts
                        options={{
                          ...chartOptions,
                          labels: ['New Workers', 'Existing Workers', 'Terminated Workers'],
                          colors: ['#FF9800', '#8BC34A', '#F44336'],
                        }}
                        series={chartSeriesWorkers(data)}
                        type="pie"
                      />
                    </div>
                  ))}
                </Card>
                <Card className='w-1/2'>
                  {yearlyData.map((data, index) => (
                    <div key={index}>
                      <h3 className="font-bold tracking-tight text-gray-900">{data.Year} - Contracts</h3>
                      <ApexCharts
                        options={{
                          ...chartOptions,
                          labels: ['New Contracts', 'Ongoing Contracts', 'Completed Contracts'],
                          colors: ['#2196F3', '#9C27B0', '#673AB7'],
                        }}
                        series={chartSeriesContracts(data)}
                        type="pie"
                      />
                    </div>
                  ))}
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
