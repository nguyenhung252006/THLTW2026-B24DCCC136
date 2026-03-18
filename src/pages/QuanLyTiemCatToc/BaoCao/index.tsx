import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Statistic, Table,
    Typography, Button, Tag, Progress, Empty
} from 'antd';
import {
    BarChartOutlined,
    LineChartOutlined,
    DollarCircleOutlined,
    UserOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const BaoCao: React.FC = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        const savedApp = localStorage.getItem('danhSachDatLich');
        const savedStaff = localStorage.getItem('danhSachNhanVien');
        if (savedApp) setAppointments(JSON.parse(savedApp));
        if (savedStaff) setEmployees(JSON.parse(savedStaff));
    }, []);

    const completedApps = appointments.filter(app => app.status === 'completed');

    const PRICE_PER_SERVICE = 100000;

    const totalRevenue = completedApps.length * PRICE_PER_SERVICE;

    const staffStats = employees.map(emp => {
        const empApps = completedApps.filter(app => app.employee === emp.name);
        const revenue = empApps.length * PRICE_PER_SERVICE;

        const percent = totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0;

        return {
            key: emp.key,
            name: emp.name,
            count: empApps.length,
            revenue: revenue,
            percent: percent
        };
    });

    const dateStats = Array.from(new Set(completedApps.map(app => app.date))).map(date => {
        const count = completedApps.filter(app => app.date === date).length;
        return { date, count, revenue: count * PRICE_PER_SERVICE };
    });

    const columnsStaff = [
        { title: 'Nhân viên', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        { title: 'Số lịch hoàn thành', dataIndex: 'count', key: 'count', align: 'center' as const },
        {
            title: 'Doanh thu đóng góp',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (val: number) => <Text type="success">{val.toLocaleString()} VNĐ</Text>
        },
        {
            title: '% Doanh thu',
            key: 'percent',
            render: (_: any, record: any) => <Progress percent={record.percent} size="small" status="active" />
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Button type="link" href="/quan-ly-tiem-cat-toc" icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>Về trang chủ</Button>

            <Title level={2}><BarChartOutlined /> Báo cáo & Thống kê Doanh thu</Title>


            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Tổng doanh thu (Tạm tính)"
                            value={totalRevenue}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DollarCircleOutlined />}
                            suffix="VNĐ"
                        />
                        <Text type="secondary">Dựa trên {completedApps.length} lịch hẹn hoàn thành</Text>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Tổng số khách đã phục vụ"
                            value={completedApps.length}
                            prefix={<UserOutlined />}
                        />
                        <Tag color="blue">Tỷ lệ hoàn thành: {appointments.length > 0 ? Math.round((completedApps.length / appointments.length) * 100) : 0}%</Tag>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="Lịch hẹn đang chờ xử lý"
                            value={appointments.filter(app => app.status === 'pending').length}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<LineChartOutlined />}
                        />
                        <Text type="secondary">Cần xác nhận ngay</Text>
                    </Card>
                </Col>
            </Row>

            <Row gutter={24}>

                <Col span={14}>
                    <Card title="Hiệu suất nhân viên" bordered={false}>
                        <Table
                            dataSource={staffStats}
                            columns={columnsStaff}
                            pagination={false}
                            locale={{ emptyText: <Empty description="Chưa có dữ liệu hoàn thành" /> }}
                        />
                    </Card>
                </Col>


                <Col span={10}>
                    <Card title="Sản lượng theo ngày" bordered={false}>
                        <Table
                            dataSource={dateStats}
                            pagination={{ pageSize: 5 }}
                            columns={[
                                { title: 'Ngày', dataIndex: 'date', key: 'date' },
                                { title: 'Số khách', dataIndex: 'count', key: 'count' },
                                {
                                    title: 'Doanh thu',
                                    dataIndex: 'revenue',
                                    render: (v) => `${v.toLocaleString()}đ`
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BaoCao;