import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Form, Button } from 'antd';
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import cloneDeep from 'lodash.clonedeep';
import { User } from '../../../constants';
import { formatDateTime } from 'renderer/utils/helper';

const formItemLayout = {
  labelCol: { xs: { span: 49 }, sm: { span: 49 } },
  wrapperCol: { xs: { span: 49 }, sm: { span: 49 } },
};

const widthStyle = { minWidth: '49%' };

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Bar Chart - Stacked',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const StaffReportPage = (props) => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const [dataOpts, setDataOpts] = useState({ labels: [], datasets: [] });
  const [data, setData] = useState({ labels: [], datasets: [] });
  const labels = [];

  useEffect(() => {
    getDataReport();
  }, []);

  const getDataReport = async () => {
    const iData = {
      labels,
      datasets: [
        {
          type: 'bar',
          label: '',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          type: 'bar',
          label: '',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        { type: 'bar', label: '', data: [], borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
        { type: 'bar', label: '', data: [], borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
      ],
    };
    const staffReport = await props.invoke({ key: User.report });

    const borrowReports = cloneDeep(iData);
    borrowReports.labels = staffReport.data.labels;
    borrowReports.datasets[0].data = staffReport.data.borrowValues;
    borrowReports.datasets[0].label = 'Số Phiếu Mượn';
    borrowReports.datasets[0].borderColor = '#4CD4FF';
    borrowReports.datasets[0].backgroundColor = '#A8EAFF';
    const idataOpts = cloneDeep(options);
    const maxvalue = (Math.max(...staffReport.data.borrowValues) + Math.max(...staffReport.data.returnValues)) * 1.5
    idataOpts.scale = {
      y: {
        suggestedMax: maxvalue,
        beginAtZero: true,
      },
    };
    setDataOpts(idataOpts);

    const returnReport = cloneDeep(borrowReports);
    returnReport.labels = staffReport.data.labels;
    returnReport.datasets[1].data = staffReport.data.returnValues;
    returnReport.datasets[1].label = 'Số Phiếu Trả';
    returnReport.datasets[1].borderColor = '#35EA95';
    returnReport.datasets[1].backgroundColor = '#77FEBE';

    const remindReport = cloneDeep(returnReport);
    remindReport.labels = staffReport.data.labels;
    remindReport.datasets[2].data = staffReport.data.remindValues;
    remindReport.datasets[2].label = 'Số Phiếu Nhắc Nhở';
    remindReport.datasets[2].borderColor = '#FCD433';
    remindReport.datasets[2].backgroundColor = '#FFE88D';

    const penaltyReport = cloneDeep(remindReport);
    penaltyReport.labels = staffReport.data.labels;
    penaltyReport.datasets[3].data = staffReport.data.penaltyValues;
    penaltyReport.datasets[3].label = 'Số Phiếu Phạt';

    setData(penaltyReport);
  };

  const exportReportToImage = (e) => {
    let input = window.document.getElementsByClassName('export-image')[0];
    html2canvas(input).then((canvas) => {
      const img = canvas.toDataURL('image/jpeg');
      const downloadLink = document.createElement('a');
      downloadLink.href = img;
      downloadLink.download = `report-phieu-${formatDateTime(new Date())}.png`;
      downloadLink.click();
    });
  };

  return (
    <div>
      <Form className="export-image" {...formItemLayout} layout="vertical" name="dynamic_rule" style={{ display: 'flex', flexWrap: 'wrap' }} scrollToFirstError>
        <Form.Item style={widthStyle}>
          <Bar options={dataOpts} data={data} />
        </Form.Item>
      </Form>
      <div>
        <Button type="primary" onClick={exportReportToImage}>
          Export To PDF
        </Button>
      </div>
    </div>
  );
};

export default StaffReportPage;
