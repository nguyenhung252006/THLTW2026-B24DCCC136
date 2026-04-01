import React, { useState, useEffect, useMemo } from 'react';
import {
    Table, Button, Modal, Form, Input, Select, Tag, Tabs, Card,
    Row, Col, Space, Switch, Tooltip, Typography, Statistic, Divider, message
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined,
    CloseCircleOutlined, TeamOutlined, BarChartOutlined, HistoryOutlined, SwapOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

interface Club {
    id: string;
    name: string;
    foundedDate: string;
    description: string;
    leader: string;
    isActive: boolean;
}

interface Application {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    address: string;
    strength: string;
    clubId: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    note?: string;
    history: string[];
}

const ClubManagementSystem: React.FC = () => {
    const [clubs, setClubs] = useState<Club[]>(() => JSON.parse(localStorage.getItem('clubs') || '[]'));
    const [apps, setApps] = useState<Application[]>(() => JSON.parse(localStorage.getItem('apps') || '[]'));

    const [isClubModalOpen, setIsClubModalOpen] = useState(false);
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [editingData, setEditingData] = useState<any>(null);

    const [selectedAppKeys, setSelectedAppKeys] = useState<React.Key[]>([]);
    const [selectedMemberKeys, setSelectedMemberKeys] = useState<React.Key[]>([]);

    const [form] = Form.useForm();
    const [appForm] = Form.useForm();
    const [transferForm] = Form.useForm();

    useEffect(() => {
        localStorage.setItem('clubs', JSON.stringify(clubs));
        localStorage.setItem('apps', JSON.stringify(apps));
    }, [clubs, apps]);

    const getClubName = (id: string) => clubs.find(c => c.id === id)?.name || 'N/A';

    const handleSaveClub = (values: any) => {
        const id = editingData?.id || `club_${Date.now()}`;
        const newClub: Club = { ...values, id };
        if (editingData) {
            setClubs(clubs.map(c => c.id === id ? newClub : c));
        } else {
            setClubs([...clubs, newClub]);
        }
        setIsClubModalOpen(false);
        setEditingData(null);
        form.resetFields();
    };

    const handleSaveApp = (values: any) => {
        const id = editingData?.id || `app_${Date.now()}`;
        const newApp: Application = {
            ...values,
            id,
            status: editingData?.status || 'Pending',
            history: editingData?.history || []
        };
        if (editingData) {
            setApps(apps.map(a => a.id === id ? newApp : a));
        } else {
            setApps([...apps, newApp]);
        }
        setIsAppModalOpen(false);
        setEditingData(null);
        appForm.resetFields();
        message.success('Thao tác thành công');
    };

    const processApplications = (status: 'Approved' | 'Rejected') => {
        let rejectReason = "";
        const performAction = () => {
            const now = new Date().toLocaleString('vi-VN');
            const updatedApps = apps.map(app => {
                if (selectedAppKeys.includes(app.id)) {
                    const log = `${status} vào lúc ${now}${rejectReason ? ': ' + rejectReason : ''}`;
                    return { ...app, status, note: rejectReason, history: [...(app.history || []), log] };
                }
                return app;
            });
            setApps(updatedApps);
            setSelectedAppKeys([]);
        };

        if (status === 'Rejected') {
            Modal.confirm({
                title: 'Lý do từ chối',
                content: <Input placeholder="Nhập lý do..." onChange={e => rejectReason = e.target.value} />,
                onOk: () => {
                    if (!rejectReason) return Promise.reject();
                    performAction();
                }
            });
        } else {
            Modal.confirm({ title: 'Xác nhận duyệt', onOk: performAction });
        }
    };

    const handleTransferClub = (values: { targetClubId: string }) => {
        setApps(apps.map(app => selectedMemberKeys.includes(app.id) ? { ...app, clubId: values.targetClubId } : app));
        setIsTransferModalOpen(false);
        setSelectedMemberKeys([]);
        transferForm.resetFields();
    };

    const clubColumns = [
        { title: 'Tên CLB', dataIndex: 'name', sorter: (a: Club, b: Club) => a.name.localeCompare(b.name) },
        { title: 'Chủ nhiệm', dataIndex: 'leader' },
        { title: 'Hoạt động', dataIndex: 'isActive', render: (val: boolean) => <Tag color={val ? 'blue' : 'default'}>{val ? 'Có' : 'Không'}</Tag> },
        {
            title: 'Thao tác', render: (_: any, record: Club) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingData(record); setIsClubModalOpen(true); form.setFieldsValue(record); }} />
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => setClubs(clubs.filter(c => c.id !== record.id))} />
                </Space>
            )
        }
    ];

    const appColumns = [
        { title: 'Họ tên', dataIndex: 'fullName' },
        { title: 'CLB', dataIndex: 'clubId', render: (id: string) => getClubName(id) },
        {
            title: 'Trạng thái', dataIndex: 'status', render: (s: string) => (
                <Tag color={s === 'Approved' ? 'green' : s === 'Rejected' ? 'red' : 'gold'}>{s}</Tag>
            )
        },
        {
            title: 'Lịch sử', render: (_: any, r: Application) => (
                <Tooltip title={r.history?.map((h, i) => <div key={i}>{h}</div>)}>
                    <Button type="link" icon={<HistoryOutlined />}>Xem</Button>
                </Tooltip>
            )
        },
        {
            title: 'Thao tác', render: (_: any, record: Application) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingData(record); setIsAppModalOpen(true); appForm.setFieldsValue(record); }} />
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => setApps(apps.filter(a => a.id !== record.id))} />
                </Space>
            )
        }
    ];

    const stats = useMemo(() => ({
        totalClubs: clubs.length,
        pending: apps.filter(a => a.status === 'Pending').length,
        approved: apps.filter(a => a.status === 'Approved').length,
        rejected: apps.filter(a => a.status === 'Rejected').length,
    }), [clubs, apps]);

    return (
        <div style={{ padding: '24px' }}>
            <Card bordered={false}>
                <Title level={2}>Quản lý Câu lạc bộ</Title>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Danh sách CLB" key="1">
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingData(null); setIsClubModalOpen(true); form.resetFields(); }} style={{ marginBottom: 16 }}>Thêm CLB</Button>
                        <Table columns={clubColumns} dataSource={clubs} rowKey="id" />
                    </TabPane>

                    <TabPane tab="Đơn đăng ký" key="2">
                        <Space style={{ marginBottom: 16 }}>
                            <Button type="primary" onClick={() => { setEditingData(null); setIsAppModalOpen(true); appForm.resetFields(); }}>Thêm đơn</Button>
                            <Button icon={<CheckCircleOutlined />} disabled={!selectedAppKeys.length} onClick={() => processApplications('Approved')}>Duyệt</Button>
                            <Button danger icon={<CloseCircleOutlined />} disabled={!selectedAppKeys.length} onClick={() => processApplications('Rejected')}>Từ chối</Button>
                        </Space>
                        <Table rowSelection={{ selectedRowKeys: selectedAppKeys, onChange: setSelectedAppKeys }} columns={appColumns} dataSource={apps} rowKey="id" />
                    </TabPane>

                    <TabPane tab="Thành viên" key="3">
                        <Button icon={<SwapOutlined />} disabled={!selectedMemberKeys.length} onClick={() => setIsTransferModalOpen(true)} style={{ marginBottom: 16 }}>Chuyển CLB</Button>
                        <Table rowSelection={{ selectedRowKeys: selectedMemberKeys, onChange: setSelectedMemberKeys }} columns={appColumns.filter(c => c.title !== 'Thao tác')} dataSource={apps.filter(a => a.status === 'Approved')} rowKey="id" />
                    </TabPane>

                    <TabPane tab="Thống kê" key="4">
                        <Row gutter={16}>
                            <Col span={6}><Statistic title="Tổng CLB" value={stats.totalClubs} /></Col>
                            <Col span={6}><Statistic title="Chờ duyệt" value={stats.pending} /></Col>
                            <Col span={6}><Statistic title="Thành viên" value={stats.approved} /></Col>
                            <Col span={6}><Statistic title="Từ chối" value={stats.rejected} /></Col>
                        </Row>
                        <Divider />
                        <Table pagination={false} dataSource={clubs} rowKey="id" columns={[
                            { title: 'Tên CLB', dataIndex: 'name' },
                            { title: 'Chờ duyệt', render: (_, r) => apps.filter(a => a.clubId === r.id && a.status === 'Pending').length },
                            { title: 'Thành viên', render: (_, r) => apps.filter(a => a.clubId === r.id && a.status === 'Approved').length },
                            { title: 'Từ chối', render: (_, r) => apps.filter(a => a.clubId === r.id && a.status === 'Rejected').length }
                        ]} />
                    </TabPane>
                </Tabs>
            </Card>

            <Modal title="Thông tin CLB" visible={isClubModalOpen} onCancel={() => setIsClubModalOpen(false)} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={handleSaveClub}>
                    <Form.Item name="name" label="Tên CLB" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="leader" label="Chủ nhiệm" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="isActive" label="Hoạt động" valuePropName="checked"><Switch /></Form.Item>
                </Form>
            </Modal>

            <Modal title="Đơn đăng ký" visible={isAppModalOpen} onCancel={() => setIsAppModalOpen(false)} onOk={() => appForm.submit()}>
                <Form form={appForm} layout="vertical" onFinish={handleSaveApp}>
                    <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="clubId" label="Chọn CLB" rules={[{ required: true }]}>
                        <Select>{clubs.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item name="reason" label="Lý do"><Input.TextArea /></Form.Item>
                </Form>
            </Modal>

            <Modal title="Chuyển CLB" visible={isTransferModalOpen} onCancel={() => setIsTransferModalOpen(false)} onOk={() => transferForm.submit()}>
                <Form form={transferForm} layout="vertical" onFinish={handleTransferClub}>
                    <Form.Item name="targetClubId" label="Chọn CLB mới" rules={[{ required: true }]}>
                        <Select>{clubs.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}</Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ClubManagementSystem;