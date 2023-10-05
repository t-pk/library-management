import { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Form } from 'antd';
import { Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import faker from 'faker';

const formItemLayout = {
  labelCol: { xs: { span: 49 }, sm: { span: 49 } },
  wrapperCol: { xs: { span: 49 }, sm: { span: 49 } },
};

const widthStyle = { minWidth: '49%' };

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

const NoteReportPage = (props) => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  const canvasRef = useRef();
  const [data, setData] = useState({ labels: [], datasets: [] });
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  useEffect(() => {
    const iData = {
      labels,
      datasets: [
        {
          label: 'Mượn',
          data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
    setData(iData);
  }, []);

  const div2PDF = (e) => {
    const but = e.target;
    but.style.display = 'none';
    let input = window.document.getElementsByClassName('div2PDF')[0];
    html2canvas(input).then((canvas) => {
      const img = canvas.toDataURL('image/jpeg');
      const downloadLink = document.createElement('a');
      downloadLink.href = img;
      downloadLink.download = 'exported-image.png';
      downloadLink.click();
    });
  };

  return (
    <div ref={canvasRef} className="div2PDF">
      <Form {...formItemLayout} layout="vertical" name="dynamic_rule" style={{ display: 'flex', flexWrap: 'wrap' }} scrollToFirstError>
        <Form.Item style={widthStyle}>
          <Line options={options} data={data} />
        </Form.Item>
        <Form.Item style={widthStyle}>
          <Line options={options} data={data} />
        </Form.Item>
        <Form.Item style={widthStyle}>
          <Line options={options} data={data} />
        </Form.Item>
        <Form.Item style={widthStyle}>
          <Line options={options} data={data} />
        </Form.Item>
        <div>
          <button onClick={(e) => div2PDF(e)}>Export 2 PDF</button>
        </div>
      </Form>
    </div>
  );
};

export default NoteReportPage;
