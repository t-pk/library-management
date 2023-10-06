import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Form, Button } from 'antd';
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import cloneDeep from 'lodash.clonedeep';
import { Document } from '../../../constants';
import { formatDateTime } from 'renderer/utils/helper';

const formItemLayout = {
  labelCol: { xs: { span: 95 }, sm: { span: 95 } },
  wrapperCol: { xs: { span: 95 }, sm: { span: 95 } },
};

const widthStyle = { minWidth: '95%' };

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const DocumentReportPage = (props) => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);
  const [documents, setDocuments] = useState({ labels: [], datasets: [] });
  const [documentOpts, setDocumentOpts] = useState({ labels: [], datasets: [] });
  const labels = [];

  useEffect(() => {
    getDataReport();
  }, []);

  const getDataReport = async () => {
    const iData = {
      labels,
      datasets: [
        {
          label: 'Mượn',
          data: [],
          borderColor: 'rgb(54, 227, 32)',
          backgroundColor: 'rgba(54, 227, 32, 0.5)',
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          label: 'Mượn',
          data: [],
          borderColor: 'white',
          borderColor: 'rgb(32, 104, 227)',
          backgroundColor: 'rgba(32, 104, 227, 0.5)',
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          label: 'Trung Bình',
          type: 'line',
          backgroundColor: 'rgb(252, 60, 8)',
          borderColor: 'rgb(252, 60, 8)',
          fill: true,
          data: [],
          cubicInterpolationMode: 'monotone',
        },
      ],
    };
    const document = await props.invoke({ key: Document.report });
    const documentReports = cloneDeep(iData);
    
    documentReports.labels = document.data.labels;
    documentReports.datasets[0].data = document.data.borrowValues;
    documentReports.datasets[0].label = 'Tổng Tài Liệu Mượn';
    documentReports.datasets[1].data = document.data.returnValues;
    documentReports.datasets[1].label = 'Tổng Tài Liệu Trả';
    documentReports.datasets[2].data = document.data.avgValues;

    const idocumentOpts = cloneDeep(options);
    idocumentOpts.plugins.title.text = 'Thống Kê Tài Liệu';
    const maxvalue = (Math.max(...document.data.borrowValues) + Math.max(...document.data.returnValues))
    idocumentOpts.scale = {
      y: {
        suggestedMax: maxvalue,
        beginAtZero: true,
      },
    };
    setDocumentOpts(idocumentOpts);
    setDocuments(documentReports);
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
          <Bar options={documentOpts} data={documents} />
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

export default DocumentReportPage;
