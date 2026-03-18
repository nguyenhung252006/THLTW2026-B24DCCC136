import React, { useState, useEffect } from 'react';
import {
    Table, Button, Modal, Form, DatePicker,
    Select, Badge, Space, message, Tag, Typography, Input, Row, Col
} from 'antd';
import { CalendarOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const STATUS_MAP: any = {
    'pending': { label: 'Chờ duyệt', color: 'warning' },
    'confirmed': { label: 'Đã xác nhận', color: 'processing' },
    'completed': { label: 'Hoàn thành', color: 'success' },
    'cancelled': { label: 'Đã hủy', color: 'error' },
};

const DatLich: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        const savedStaff = localStorage.getItem('danhSachNhanVien');
        if (savedStaff) {
            setEmployees(JSON.parse(savedStaff));
        }
    }, []);

    const [appointments, setAppointments] = useState<any[]>(() => {
        const savedApp = localStorage.getItem('danhSachDatLich');
        return savedApp ? JSON.parse(savedApp) : [];
    });

    useEffect(() => {
        localStorage.setItem('danhSachDatLich', JSON.stringify(appointments));
    }, [appointments]);


    const checkDuplicate = (newDate: string, newTime: string, employee: string) => {
        return appointments.some(
            (app) => app.date === newDate && app.time === newTime && app.employee === employee && app.status !== 'cancelled'
        );
    };

    const handleCreateAppointment = () => {
        form.validateFields().then((values) => {
            const dateStr = values.date.format('YYYY-MM-DD');
            const timeStr = values.time;

            if (checkDuplicate(dateStr, timeStr, values.employee)) {
                message.error(`Nhân viên ${values.employee} đã có lịch vào lúc ${timeStr} ngày ${dateStr}!`);
                return;
            }

            const newApp = {
                id: Date.now().toString(),
                customer: values.customer,
                employee: values.employee,
                date: dateStr,
                time: timeStr,
                status: 'pending',
            };

            setAppointments([...appointments, newApp]);
            setIsModalVisible(false);
            form.resetFields();
            message.success('Đặt lịch thành công!');
        });
    };

    const updateStatus = (id: string, newStatus: string) => {
        setAppointments(appointments.map(app => app.id === id ? { ...app, status: newStatus } : app));
        message.success('Đã cập nhật trạng thái');
    };

    const columns = [
        { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
        { title: 'Nhân viên', dataIndex: 'employee', key: 'employee', render: (text: string) => <Tag color="geekblue">{text}</Tag> },
        { title: 'Ngày', dataIndex: 'date', key: 'date' },
        { title: 'Giờ', dataIndex: 'time', key: 'time' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Badge status={STATUS_MAP[status].color} text={STATUS_MAP[status].label} />
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record: any) => (
                <Space>
                    {record.status === 'pending' && (
                        <Button size="small" type="primary" onClick={() => updateStatus(record.id, 'confirmed')}>Xác nhận</Button>
                    )}
                    {record.status === 'confirmed' && (
                        <Button size="small" style={{ borderColor: 'green', color: 'green' }} onClick={() => updateStatus(record.id, 'completed')}>Hoàn thành</Button>
                    )}
                    {record.status !== 'cancelled' && record.status !== 'completed' && (
                        <Button size="small" danger onClick={() => updateStatus(record.id, 'cancelled')}>Hủy</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Button type="link" href="/quan-ly-tiem-cat-toc" icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>Về trang chủ</Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3}><CalendarOutlined /> Quản lý Đặt lịch</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Đặt lịch mới</Button>
            </div>

            <Table columns={columns} dataSource={appointments} rowKey="id" />

            <Modal
                title="Tạo lịch hẹn mới"
                visible={isModalVisible}
                onOk={handleCreateAppointment}
                onCancel={() => setIsModalVisible(false)}
                okText="Xác nhận đặt"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="customer" label="Tên khách hàng" rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}>
                        <Input placeholder="Nhập tên khách hàng..." />
                    </Form.Item>

                    <Form.Item name="employee" label="Chọn nhân viên" rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}>
                        <Select placeholder="Chọn nhân viên phục vụ">
                            {employees.length > 0 ? (
                                employees.map((e: any) => (
                                    <Option key={e.key} value={e.name}>{e.name} ({e.workDay})</Option>
                                ))
                            ) : (
                                <Option disabled>Không có nhân viên nào. Hãy thêm ở trang Nhân viên.</Option>
                            )}
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="date" label="Chọn ngày" rules={[{ required: true }]}>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="time" label="Khung giờ" rules={[{ required: true }]}>
                                <Select placeholder="Chọn giờ" style={{ width: '100%' }}>
                                    {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                                        <Option key={t} value={t}>{t}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default DatLich;