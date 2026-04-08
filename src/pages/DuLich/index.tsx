import React, { useState } from 'react';
import {
    Card, Row, Col, Select, Rate, Tag, Space, List, Button,
    Typography, InputNumber, Alert, Statistic, Progress,
    Table, Modal, Form, Input, Upload, Layout, Menu
} from 'antd';
import {
    DeleteOutlined, PlusOutlined, EditOutlined,
    UploadOutlined, HomeOutlined, ScheduleOutlined,
    PieChartOutlined, SettingOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;

interface Destination {
    id: number;
    name: string;
    type: 'Beach' | 'Mountain' | 'City';
    price: number;
    rating: number;
    image: string;
}

interface PlanItem {
    id: string;
    name: string;
    cost: number;
}

const mockDestinations: Destination[] = [
    { id: 1, name: 'Vịnh Hạ Long', type: 'Beach', price: 200, rating: 5, image: 'https://picsum.photos/400/250?random=1' },
    { id: 2, name: 'Sapa', type: 'Mountain', price: 150, rating: 4.5, image: 'https://picsum.photos/400/250?random=2' },
    { id: 3, name: 'Hà Nội', type: 'City', price: 100, rating: 4, image: 'https://picsum.photos/400/250?random=3' },
];

const TravelApp: React.FC = () => {
    const [currentTab, setCurrentTab] = useState('1');
    const [filterType, setFilterType] = useState('All');
    const [planItems, setPlanItems] = useState<PlanItem[]>([
        { id: '1', name: 'Vé máy bay', cost: 300 },
        { id: '2', name: 'Khách sạn', cost: 500 }
    ]);
    const [totalBudget, setTotalBudget] = useState(1000);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

    const filteredDestinations = filterType === 'All'
        ? mockDestinations
        : mockDestinations.filter(d => d.type === filterType);

    const currentSpend = planItems.reduce((sum, i) => sum + i.cost, 0);

    const renderHome = () => (
        <div style={{ padding: '20px' }}>
            <Select defaultValue="All" style={{ width: 200, marginBottom: 20 }} onChange={setFilterType}>
                <Select.Option value="All">Tất cả loại hình</Select.Option>
                <Select.Option value="Beach">Biển</Select.Option>
                <Select.Option value="Mountain">Núi</Select.Option>
                <Select.Option value="City">Thành phố</Select.Option>
            </Select>
            <Row gutter={[16, 16]}>
                {filteredDestinations.map(item => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <Card hoverable cover={<img alt={item.name} src={item.image} />}>
                            <Card.Meta title={item.name} description={<Tag color="blue">{item.type}</Tag>} />
                            <div style={{ marginTop: 10 }}>
                                <Rate disabled defaultValue={item.rating} />
                                <div style={{ fontWeight: 'bold', marginTop: 5 }}>${item.price}</div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );

    const renderPlanner = () => (
        <Card title="Lập lịch trình du lịch" style={{ margin: '20px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Space direction="vertical">
                    <Typography.Text strong>Ngân sách giới hạn:</Typography.Text>
                    <InputNumber min={0} value={totalBudget} onChange={(v) => setTotalBudget(v || 0)} />
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setPlanItems([...planItems, { id: Date.now().toString(), name: "Địa điểm tham quan", cost: 100 }])}>
                    Thêm từ danh sách
                </Button>
                <List
                    bordered
                    dataSource={planItems}
                    renderItem={item => (
                        <List.Item actions={[<Button danger icon={<DeleteOutlined />} onClick={() => setPlanItems(planItems.filter(p => p.id !== item.id))} />]}>
                            <Typography.Text>{item.name}</Typography.Text>
                            <Typography.Text strong>${item.cost}</Typography.Text>
                        </List.Item>
                    )}
                />
            </Space>
        </Card>
    );

    const renderBudget = () => (
        <div style={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Tình trạng ngân sách">
                        <Statistic title="Tổng chi phí hiện tại" value={currentSpend} suffix={`/ ${totalBudget}$`} />
                        <div style={{ marginTop: 20 }}>
                            <Typography.Text>Mức độ sử dụng:</Typography.Text>
                            <Progress
                                percent={Math.round((currentSpend / totalBudget) * 100)}
                                status={currentSpend > totalBudget ? "exception" : "active"}
                                strokeColor={currentSpend > totalBudget ? '#ff4d4f' : '#1890ff'}
                            />
                        </div>
                        {currentSpend > totalBudget && (
                            <Alert
                                message="Vượt ngân sách!"
                                description={`Bạn đã chi quá mức ${currentSpend - totalBudget}$ so với dự kiến.`}
                                type="error"
                                showIcon
                                style={{ marginTop: 20 }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Phân bổ chi tiết">
                        <List
                            itemLayout="horizontal"
                            dataSource={planItems}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={`Chiếm ${((item.cost / currentSpend) * 100).toFixed(1)}%`} />
                                    <div>${item.cost}</div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );

    const renderAdmin = () => (
        <div style={{ padding: '20px' }}>
            <Card title="Quản trị hệ thống" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAdminModalOpen(true)}>Thêm mới</Button>}>
                <Table
                    dataSource={mockDestinations.map(d => ({ ...d, key: d.id }))}
                    scroll={{ x: 700 }}
                    columns={[
                        { title: 'Tên địa điểm', dataIndex: 'name', key: 'name' },
                        { title: 'Loại hình', dataIndex: 'type', key: 'type', render: (t) => <Tag color="cyan">{t}</Tag> },
                        { title: 'Giá ($)', dataIndex: 'price', key: 'price' },
                        { title: 'Đánh giá', dataIndex: 'rating', key: 'rating', render: (r) => <Rate disabled defaultValue={r} style={{ fontSize: 12 }} /> },
                        { title: 'Thao tác', key: 'action', render: () => <Space><Button size="small" icon={<EditOutlined />} /><Button size="small" danger icon={<DeleteOutlined />} /></Space> }
                    ]}
                />
            </Card>

            <Modal title="Thêm/Sửa điểm đến" visible={isAdminModalOpen} onCancel={() => setIsAdminModalOpen(false)} onOk={() => setIsAdminModalOpen(false)}>
                <Form layout="vertical">
                    <Form.Item label="Tên"><Input /></Form.Item>
                    <Form.Item label="Loại hình"><Select options={[{ value: 'Beach', label: 'Biển' }, { value: 'Mountain', label: 'Núi' }, { value: 'City', label: 'Thành phố' }]} /></Form.Item>
                    <Form.Item label="Giá tham khảo"><InputNumber style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Ảnh đại diện"><Upload><Button icon={<UploadOutlined />}>Upload Image</Button></Upload></Form.Item>
                </Form>
            </Modal>
        </div>
    );

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Header style={{ background: '#fff', padding: 0, position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 8px #f0f1f2' }}>
                <Menu
                    mode="horizontal"
                    selectedKeys={[currentTab]}
                    onClick={(e) => setCurrentTab(e.key)}
                    style={{ justifyContent: 'center', borderBottom: 'none' }}
                >
                    <Menu.Item key="1" icon={<HomeOutlined />}>Khám phá</Menu.Item>
                    <Menu.Item key="2" icon={<ScheduleOutlined />}>Lịch trình</Menu.Item>
                    <Menu.Item key="3" icon={<PieChartOutlined />}>Ngân sách</Menu.Item>
                    <Menu.Item key="4" icon={<SettingOutlined />}>Quản trị</Menu.Item>
                </Menu>
            </Header>
            <Content>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    {currentTab === '1' && renderHome()}
                    {currentTab === '2' && renderPlanner()}
                    {currentTab === '3' && renderBudget()}
                    {currentTab === '4' && renderAdmin()}
                </div>
            </Content>
        </Layout>
    );
};

export default TravelApp;