import React, { useState, useEffect } from 'react';
import { ArrowRightOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
    Table, Button, Modal, Form, Input,
    InputNumber, TimePicker, Select, Space, Popconfirm, Tag, Row, Col
} from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const NhanVien: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [form] = Form.useForm();

    // --- LOGIC LOCALSTORAGE ---
    // Khởi tạo state từ localStorage nếu có, nếu không thì dùng mảng rỗng
    const [dataSource, setDataSource] = useState(() => {
        const savedData = localStorage.getItem('danhSachNhanVien');
        return savedData ? JSON.parse(savedData) : [];
    });

    // Mỗi khi dataSource thay đổi, tự động lưu vào localStorage
    useEffect(() => {
        localStorage.setItem('danhSachNhanVien', JSON.stringify(dataSource));
    }, [dataSource]);
    // --------------------------

    const showAddModal = () => {
        setEditingKey(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (record: any) => {
        setEditingKey(record.key);
        const times = record.timeRange.split(' - ');
        const formattedData = {
            ...record,
            timeRange: [dayjs(times[0], 'HH:mm'), dayjs(times[1], 'HH:mm')]
        };
        form.setFieldsValue(formattedData);
        setIsModalVisible(true);
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            const timeString = values.timeRange
                ? `${values.timeRange[0].format('HH:mm')} - ${values.timeRange[1].format('HH:mm')}`
                : 'Chưa định lịch';

            if (editingKey) {
                const newData = dataSource.map((item: any) => {
                    if (item.key === editingKey) {
                        return { ...item, ...values, timeRange: timeString };
                    }
                    return item;
                });
                setDataSource(newData);
            } else {
                const newEmployee = {
                    key: Date.now().toString(),
                    ...values,
                    timeRange: timeString,
                };
                setDataSource([...dataSource, newEmployee]);
            }

            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleDelete = (key: string) => {
        setDataSource(dataSource.filter((item: any) => item.key !== key));
    };

    const columns = [
        { title: 'Tên nhân viên', dataIndex: 'name', key: 'name' },
        {
            title: 'Giới hạn/ngày',
            dataIndex: 'limit',
            render: (limit: number) => <Tag color="blue">{limit} khách</Tag>
        },
        {
            title: 'Lịch làm việc',
            render: (_: any, record: any) => `${record.timeRange} (${record.workDay})`
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'services',
            render: (services: string[]) => (
                <>
                    {services?.map(s => <Tag color="green" key={s}>{s}</Tag>)}
                </>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        type="text"
                        onClick={() => showEditModal(record)}
                        style={{ color: '#1890ff' }}
                    />
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.key)}>
                        <Button icon={<DeleteOutlined />} type="text" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Button type="link" href="/quan-ly-tiem-cat-toc" icon={<ArrowRightOutlined />}>Về trang chủ</Button>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Danh sách Nhân viên</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>Thêm mới</Button>
            </div>
            <Table columns={columns} dataSource={dataSource} />

            <Modal
                title={editingKey ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
                visible={isModalVisible} // Đổi visible thành open (chuẩn AntD 5.x)
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={700}
                okText="Lưu dữ liệu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                                <Input placeholder="Nhập tên..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="limit" label="Giới hạn khách/ngày" initialValue={5}>
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="workDay" label="Ngày làm việc" rules={[{ required: true }]}>
                                <Select placeholder="Chọn thứ">
                                    {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map(day => (
                                        <Option key={day} value={day}>{day}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="timeRange" label="Giờ làm việc">
                                <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="services" label="Dịch vụ phụ trách">
                        <Select mode="multiple" placeholder="Chọn dịch vụ">
                            <Option value="Cắt tóc">Cắt tóc (100k)</Option>
                            <Option value="Gội đầu">Gội đầu (50k)</Option>
                            <Option value="Làm móng">Làm móng (80k)</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NhanVien;