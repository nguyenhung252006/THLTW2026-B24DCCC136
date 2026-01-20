import { useState } from "react";
import sanpham from "@/models/sanpham/sanpham";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Form,
  InputNumber,
  message,
} from "antd";

const { Search } = Input;

function BaiTap01() {
  const [data, setData] = useState(
    sanpham.map(item => ({
      id: item.id,
      key: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
  );

  const [dataSource, setDataSource] = useState(data);
  const [form] = Form.useForm();

  const handleDelete = (id) => {
    const newData = data.filter(item => item.id !== id);
    setData(newData);
    setDataSource(newData);
  };

  const handleSearch = (value) => {
    const keyword = value.toLowerCase();
    setDataSource(
      data.filter(item =>
        item.name.toLowerCase().includes(keyword)
      )
    );
  };

  const handleAdd = (values) => {
    const newItem = {
      id: Date.now(),
      key: Date.now(),
      name: values.name,
      price: values.price,
      quantity: values.quantity,
    };

    const newData = [...data, newItem];
    setData(newData);
    setDataSource(newData);
    form.resetFields();
    message.success("Thêm sản phẩm thành công");
  };

  const columns = [
    { title: "STT", dataIndex: "key", key: "key" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Giá", dataIndex: "price", key: "price" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xoá?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger>Xoá</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <h1>Bài Tập 01</h1>

      <Search
        placeholder="Tìm theo tên sản phẩm"
        allowClear
        onChange={e => handleSearch(e.target.value)}
      />

      <Form form={form} layout="inline" onFinish={handleAdd}>
        <Form.Item
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Tên sản phẩm" />
        </Form.Item>

        <Form.Item
          name="price"
          rules={[{ required: true, type: "number", min: 1 }]}
        >
          <InputNumber placeholder="Giá" />
        </Form.Item>

        <Form.Item
          name="quantity"
          rules={[{ required: true, type: "number", min: 1 }]}
        >
          <InputNumber placeholder="Số lượng" precision={0} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm sản phẩm
          </Button>
        </Form.Item>
      </Form>

      <Table
        rowKey="key"
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
}

export default BaiTap01;
