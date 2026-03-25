import React, { useState, useEffect } from 'react';
import { Layout, Button, Table, Form, Input, Select, DatePicker, Modal, message, Descriptions, Space, Empty } from 'antd';
import { AppstoreOutlined, FileTextOutlined, SettingOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Option } = Select;

const App: React.FC = () => {
    const [page, setPage] = useState('thong-tin-van-bang');
    const [customFields, setCustomFields] = useState<any[]>([]);
    const [decisions, setDecisions] = useState<any[]>([]);
    const [diplomas, setDiplomas] = useState<any[]>([]);
    const [modal, setModal] = useState({ visible: false, type: '', edit: null as any });
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [detail, setDetail] = useState<any>(null);

    const [form] = Form.useForm();
    const [searchForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        setCustomFields(JSON.parse(localStorage.getItem('customFields') || '[]'));
        setDecisions(JSON.parse(localStorage.getItem('decisions') || '[]'));
        setDiplomas(JSON.parse(localStorage.getItem('diplomas') || '[]'));
    }, []);

    const save = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

    const openModal = (type: string, edit: any = null) => {
        setModal({ visible: true, type, edit });
        form.resetFields();
        if (edit) {
            form.setFieldsValue({
                ...edit,
                ngaySinh: edit.ngaySinh ? dayjs(edit.ngaySinh) : null,
                ngayBanHanh: edit.ngayBanHanh ? dayjs(edit.ngayBanHanh) : null,
                ...edit.customData
            });
        }
    };

    const handleSave = (values: any) => {
        try {
            if (modal.type === 'quyet-dinh') {
                const newItem = { ...values, id: modal.edit?.id || 'd' + Date.now(), ngayBanHanh: dayjs(values.ngayBanHanh).format('YYYY-MM-DD') };
                const updated = modal.edit ? decisions.map(d => d.id === modal.edit.id ? newItem : d) : [...decisions, newItem];
                setDecisions(updated);
                save('decisions', updated);
            } else if (modal.type === 'custom') {
                const newItem = { 
                    id: modal.edit?.id || 'f' + Date.now(), 
                    ...values,
                    options: values.options ? values.options.split(',').map((o: string) => o.trim()) : [] 
                };
                const updated = modal.edit ? customFields.map(f => f.id === modal.edit.id ? newItem : f) : [...customFields, newItem];
                setCustomFields(updated);
                save('customFields', updated);
            } else if (modal.type === 'diploma') {
                const customData: any = {};
                customFields.forEach(f => {
                    const val = values[f.name];
                    customData[f.name] = (f.type === 'date' && val) ? dayjs(val).format('YYYY-MM-DD') : val;
                });
                const newItem = {
                    id: modal.edit?.id || 'vb' + Date.now(),
                    ...values,
                    ngaySinh: dayjs(values.ngaySinh).format('YYYY-MM-DD'),
                    customData
                };
                const updated = modal.edit ? diplomas.map(d => d.id === modal.edit.id ? newItem : d) : [...diplomas, newItem];
                setDiplomas(updated);
                save('diplomas', updated);
            }
            setModal({ visible: false, type: '', edit: null });
            messageApi.success('Thành công');
        } catch (e) {
            messageApi.error('Có lỗi xảy ra khi lưu!');
        }
    };

    const handleSearch = () => {
        const v = searchForm.getFieldsValue();
        const results = diplomas.filter(d => 
            (!v.soHieuVB || d.soHieuVB?.includes(v.soHieuVB)) &&
            (!v.maSV || d.maSV?.includes(v.maSV)) &&
            (!v.hoTen || d.hoTen?.toLowerCase().includes(v.hoTen?.toLowerCase()))
        );
        
        if (results.length === 0) {
            messageApi.warning('Không tìm thấy thông tin phù hợp!');
        }
        setSearchResults(results);
    };

    return (
        <div style={{ padding: 20, background: '#f5f5f5', minHeight: '100vh' }}>
            {contextHolder}
            <Space wrap style={{ marginBottom: 20 }}>
                <Button type={page === "so-van-bang" ? "primary" : "default"} icon={<AppstoreOutlined />} onClick={() => setPage("so-van-bang")}>Sổ văn bằng</Button>
                <Button type={page === "quyet-dinh" ? "primary" : "default"} icon={<FileTextOutlined />} onClick={() => setPage("quyet-dinh")}>Quyết định TN</Button>
                <Button type={page === "cau-hinh" ? "primary" : "default"} icon={<SettingOutlined />} onClick={() => setPage("cau-hinh")}>Cấu hình biểu mẫu</Button>
                <Button type={page === "thong-tin-van-bang" ? "primary" : "default"} icon={<DatabaseOutlined />} onClick={() => setPage("thong-tin-van-bang")}>Thông tin văn bằng</Button>
                <Button type={page === "tra-cuu" ? "primary" : "default"} icon={<SearchOutlined />} onClick={() => setPage("tra-cuu")}>Tra cứu</Button>
            </Space>

            <Content style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
                {page === 'tra-cuu' && (
                    <Form form={searchForm} layout="inline" style={{ marginBottom: 20 }}>
                        <Form.Item name="soHieuVB"><Input placeholder="Số hiệu" /></Form.Item>
                        <Form.Item name="hoTen"><Input placeholder="Họ tên" /></Form.Item>
                        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>Tìm kiếm</Button>
                    </Form>
                )}

                {(page !== 'so-van-bang' && page !== 'tra-cuu') && (
                    <Button type="primary" onClick={() => openModal(page === 'quyet-dinh' ? 'quyet-dinh' : page === 'cau-hinh' ? 'custom' : 'diploma')} style={{ marginBottom: 16 }}>
                        Thêm mới
                    </Button>
                )}

                <Table
                    dataSource={page === 'tra-cuu' ? searchResults : page === 'quyet-dinh' ? decisions : page === 'cau-hinh' ? customFields : diplomas}
                    locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
                    columns={[
                        { title: 'Số hiệu', dataIndex: 'soHieuVB', key: 'soHieuVB' },
                        { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
                        { 
                            title: 'Thao tác', 
                            render: (_, r) => (
                                <Button onClick={() => {
                                    if(r) setDetail(r);
                                    else messageApi.error('Dữ liệu không tồn tại!');
                                }}>
                                    Chi tiết
                                </Button>
                            ) 
                        }
                    ]}
                    rowKey="id"
                />
            </Content>

            <Modal
                title="Chi tiết"
                visible={!!detail}
                onCancel={() => setDetail(null)}
                footer={[<Button key="close" onClick={() => setDetail(null)}>Đóng</Button>]}
                width={600}
            >
                {detail ? (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Số hiệu">{detail.soHieuVB || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Họ tên">{detail.hoTen || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Mã SV">{detail.maSV || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">{detail.ngaySinh || 'N/A'}</Descriptions.Item>
                        {detail.customData && Object.entries(detail.customData).map(([k, v]) => (
                            <Descriptions.Item label={k} key={k}>{String(v || 'Trống')}</Descriptions.Item>
                        ))}
                    </Descriptions>
                ) : <Empty />}
            </Modal>
            <Modal
                title="Thêm mới"
                visible={modal.visible}
                onCancel={() => setModal({ visible: false, type: '', edit: null })}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    {modal.type === 'custom' && (
                        <>
                            <Form.Item name="name" label="Tên trường" rules={[{ required: true }]}><Input /></Form.Item>
                            <Form.Item name="type" label="Kiểu dữ liệu" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="select">Lựa chọn (Select)</Option>
                                    <Option value="string">Nhập chữ</Option>
                                    <Option value="date">Ngày tháng</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="options" label="Danh sách lựa chọn (cách nhau dấu phẩy)"><Input placeholder="Học viện A, Học viện B" /></Form.Item>
                        </>
                    )}
                    {modal.type === 'diploma' && (
                        <>
                            <Form.Item name="soHieuVB" label="Số hiệu" rules={[{ required: true }]}><Input /></Form.Item>
                            <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
                            <Form.Item name="maSV" label="Mã SV" rules={[{ required: true }]}><Input /></Form.Item>
                            <Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
                            {customFields.map(f => (
                                <Form.Item key={f.id} name={f.name} label={f.name} rules={[{ required: true }]}>
                                    {f.type === 'select' ? (
                                        <Select>
                                            {f.options?.map((opt: any) => <Option key={opt} value={opt}>{opt}</Option>)}
                                        </Select>
                                    ) : <Input />}
                                </Form.Item>
                            ))}
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default App;