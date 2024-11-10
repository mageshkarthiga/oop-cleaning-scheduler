"use client";
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { readRemoteFile } from "react-papaparse";
import ApexCharts from 'react-apexcharts';

export default function HomePage() {
  const [yearlyData, setYearlyData] = useState([]);
  const [yearlyWorkerHours, setYearlyWorkerHours] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyWorkerHours, setMonthlyWorkerHours] = useState([]);
  const [weeklyWorkerHours, setWeeklyWorkerHours] = useState([]);

  useEffect(() => {
    loadCSVData();
  }, []);

  const loadCSVData = () => {
    readRemoteFile("http://localhost:8080/api/v0.1/admins/download-statistics/2024", {
      complete: (result) => {
        parseCSVData(result.data);
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
          width: '100%',
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

  return (
    <div>
      <h1>Yearly Data Dashboard</h1>
      <div>
        <div className='flex flex-row space-x-5'>
          {yearlyData.map((data, index) => (
            <div key={index}>
              <h3>{data.Year} - Clients</h3>
              <ApexCharts
                options={{
                  ...chartOptions,
                  labels: ['New Clients', 'Existing Clients', 'Terminated Clients'],
                }}
                series={chartSeriesClients(data)}
                type="pie"
              />
            </div>
          ))}
          {yearlyData.map((data, index) => (
            <div key={index}>
              <h3>{data.Year} - Sessions</h3>
              <ApexCharts
                options={{
                  ...chartOptions,
                  labels: ['Finished Sessions', 'Cancelled Sessions'],
                }}
                series={chartSeriesSessions(data)}
                type="pie"
              />
            </div>
          ))}
        </div>

        <div className='flex flex-row space-x-5'>
          {yearlyData.map((data, index) => (
            <div key={index}>
              <h3>{data.Year} - Workers</h3>
              <ApexCharts
                options={{
                  ...chartOptions,
                  labels: ['New Workers', 'Existing Workers', 'Terminated Workers'],
                }}
                series={chartSeriesWorkers(data)}
                type="pie"
              />
            </div>
          ))}
          {yearlyData.map((data, index) => (
            <div key={index}>
              <h3>{data.Year} - Contracts</h3>
              <ApexCharts
                options={{
                  ...chartOptions,
                  labels: ['New Contracts', 'Ongoing Contracts', 'Completed Contracts'],
                }}
                series={chartSeriesContracts(data)}
                type="pie"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


