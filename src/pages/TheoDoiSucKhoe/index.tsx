import React, { useState, useEffect } from 'react';
import {
    Layout, Card, Row, Col, Statistic, Table, Button, Modal, Form,
    Input, InputNumber, Select, DatePicker, Tag, Popconfirm, Drawer,
    Progress, Segmented, Space, Typography, Timeline, Divider
} from 'antd';
import {
    DashboardOutlined, HistoryOutlined, LineChartOutlined,
    TrophyOutlined, BookOutlined, PlusOutlined, DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const KHOA_LUU_TRU = {
    BUOI_TAP: 'fitness_app_buoi_tap',
    CHI_SO: 'fitness_app_chi_so',
    MUC_TIEU: 'fitness_app_muc_tieu',
    BAI_TAP: 'fitness_app_bai_tap'
};

const UngDungTheDuc: React.FC = () => {
    const [tabHienTai, setTabHienTai] = useState('1');
    const [danhSachBuoiTap, setDanhSachBuoiTap] = useState<any[]>([]);
    const [danhSachChiSo, setDanhSachChiSo] = useState<any[]>([]);
    const [danhSachMucTieu, setDanhSachMucTieu] = useState<any[]>([]);
    const [danhSachBaiTap, setDanhSachBaiTap] = useState<any[]>([]);

    const [hienThiModalBuoiTap, setHienThiModalBuoiTap] = useState(false);
    const [buoiTapDangSua, setBuoiTapDangSua] = useState<any>(null);
    const [bieuMauBuoiTap] = Form.useForm();

    const [hienThiModalChiSo, setHienThiModalChiSo] = useState(false);
    const [chiSoDangSua, setChiSoDangSua] = useState<any>(null);
    const [bieuMauChiSo] = Form.useForm();

    const [hienThiDrawerMucTieu, setHienThiDrawerMucTieu] = useState(false);
    const [bieuMauMucTieu] = Form.useForm();
    const [boLocMucTieu, setBoLocMucTieu] = useState('Đang thực hiện');

    const [hienThiModalBaiTap, setHienThiModalBaiTap] = useState(false);
    const [baiTapDangSua, setBaiTapDangSua] = useState<any>(null);
    const [bieuMauBaiTap] = Form.useForm();
    const [timKiemBaiTap, setTimKiemBaiTap] = useState('');

    useEffect(() => {
        const duLieuBuoiTap = JSON.parse(localStorage.getItem(KHOA_LUU_TRU.BUOI_TAP) || '[]');
        const duLieuChiSo = JSON.parse(localStorage.getItem(KHOA_LUU_TRU.CHI_SO) || '[]');
        const duLieuMucTieu = JSON.parse(localStorage.getItem(KHOA_LUU_TRU.MUC_TIEU) || '[]');
        const duLieuBaiTap = JSON.parse(localStorage.getItem(KHOA_LUU_TRU.BAI_TAP) || '[]');

        setDanhSachBuoiTap(duLieuBuoiTap);
        setDanhSachChiSo(duLieuChiSo);
        setDanhSachMucTieu(duLieuMucTieu);
        setDanhSachBaiTap(duLieuBaiTap);
    }, []);

    useEffect(() => {
        localStorage.setItem(KHOA_LUU_TRU.BUOI_TAP, JSON.stringify(danhSachBuoiTap));
    }, [danhSachBuoiTap]);

    useEffect(() => {
        localStorage.setItem(KHOA_LUU_TRU.CHI_SO, JSON.stringify(danhSachChiSo));
    }, [danhSachChiSo]);

    useEffect(() => {
        localStorage.setItem(KHOA_LUU_TRU.MUC_TIEU, JSON.stringify(danhSachMucTieu));
    }, [danhSachMucTieu]);

    useEffect(() => {
        localStorage.setItem(KHOA_LUU_TRU.BAI_TAP, JSON.stringify(danhSachBaiTap));
    }, [danhSachBaiTap]);

    const tinhToanBMI = (canNang: number, chieuCao: number) => {
        const chieuCaoMet = chieuCao / 100;
        return canNang / (chieuCaoMet * chieuCaoMet);
    };

    const layTagBMI = (bmi: number) => {
        if (bmi < 18.5) return <Tag color="blue">Thiếu cân</Tag>;
        if (bmi < 25) return <Tag color="green">Bình thường</Tag>;
        if (bmi < 30) return <Tag color="warning">Thừa cân</Tag>;
        return <Tag color="error">Béo phì</Tag>;
    };

    const luuBuoiTap = (giaTri: any) => {
        const duLieuMoi = {
            ...giaTri,
            id: buoiTapDangSua?.id || Date.now(),
            ngay: giaTri.ngay.format('YYYY-MM-DD')
        };
        if (buoiTapDangSua) {
            setDanhSachBuoiTap(danhSachBuoiTap.map(bt => bt.id === buoiTapDangSua.id ? duLieuMoi : bt));
        } else {
            setDanhSachBuoiTap([duLieuMoi, ...danhSachBuoiTap]);
        }
        setHienThiModalBuoiTap(false);
        bieuMauBuoiTap.resetFields();
        setBuoiTapDangSua(null);
    };

    const luuChiSo = (giaTri: any) => {
        const chiSoBMI = tinhToanBMI(giaTri.canNang, giaTri.chieuCao);
        const duLieuMoi = {
            ...giaTri,
            id: chiSoDangSua?.id || Date.now(),
            bmi: chiSoBMI.toFixed(1),
            ngay: giaTri.ngay.format('YYYY-MM-DD')
        };
        if (chiSoDangSua) {
            setDanhSachChiSo(danhSachChiSo.map(cs => cs.id === chiSoDangSua.id ? duLieuMoi : cs));
        } else {
            setDanhSachChiSo([duLieuMoi, ...danhSachChiSo]);
        }
        setHienThiModalChiSo(false);
        bieuMauChiSo.resetFields();
        setChiSoDangSua(null);
    };

    const luuMucTieu = (giaTri: any) => {
        const duLieuMoi = {
            ...giaTri,
            id: Date.now(),
            giaTriHienTai: giaTri.giaTriHienTai || 0,
            hanChot: giaTri.hanChot.format('YYYY-MM-DD'),
            trangThai: 'Đang thực hiện'
        };
        setDanhSachMucTieu([...danhSachMucTieu, duLieuMoi]);
        setHienThiDrawerMucTieu(false);
        bieuMauMucTieu.resetFields();
    };

    const capNhatTienDoMucTieu = (id: number, giaTri: number) => {
        setDanhSachMucTieu(danhSachMucTieu.map(mt => {
            if (mt.id === id) {
                const trangThai = giaTri >= mt.giaTriMucTieu ? 'Đã đạt' : 'Đang thực hiện';
                return { ...mt, giaTriHienTai: giaTri, trangThai };
            }
            return mt;
        }));
    };

    const luuBaiTap = (giaTri: any) => {
        const duLieuMoi = { ...giaTri, id: baiTapDangSua?.id || Date.now() };
        if (baiTapDangSua) {
            setDanhSachBaiTap(danhSachBaiTap.map(bt => bt.id === baiTapDangSua.id ? duLieuMoi : bt));
        } else {
            setDanhSachBaiTap([...danhSachBaiTap, duLieuMoi]);
        }
        setHienThiModalBaiTap(false);
        bieuMauBaiTap.resetFields();
        setBaiTapDangSua(null);
    };

    const BieuDoGia = ({ tieuDe, duLieu, trucX, trucY }: any) => (
        <Card title={tieuDe} size="small" bordered={false}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '10px', padding: '10px 0' }}>
                {duLieu.map((item: any, i: number) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            width: '100%',
                            backgroundColor: '#1890ff',
                            height: `${(item[trucY] / (Math.max(...duLieu.map((d: any) => d[trucY])) || 1)) * 100}%`,
                            borderRadius: '2px 2px 0 0'
                        }} />
                        <span style={{ fontSize: '10px', marginTop: '5px' }}>{item[trucX]}</span>
                    </div>
                ))}
            </div>
        </Card>
    );

    const hienThiDashboard = () => {
        const thangHienTai = moment().format('MM-YYYY');
        const buoiTapTrongThang = danhSachBuoiTap.filter(bt => moment(bt.ngay).format('MM-YYYY') === thangHienTai);
        const tongCalo = buoiTapTrongThang.reduce((tong, hienTai) => tong + (hienTai.calo || 0), 0);
        const buoiTapSapXep = [...danhSachBuoiTap].sort((a, b) => moment(b.ngay).unix() - moment(a.ngay).unix());

        const duLieuTuan = [
            { tuan: 'T1', soBuoi: buoiTapTrongThang.filter(bt => moment(bt.ngay).date() <= 7).length },
            { tuan: 'T2', soBuoi: buoiTapTrongThang.filter(bt => moment(bt.ngay).date() > 7 && moment(bt.ngay).date() <= 14).length },
            { tuan: 'T3', soBuoi: buoiTapTrongThang.filter(bt => moment(bt.ngay).date() > 14 && moment(bt.ngay).date() <= 21).length },
            { tuan: 'T4', soBuoi: buoiTapTrongThang.filter(bt => moment(bt.ngay).date() > 21).length },
        ];

        return (
            <div style={{ marginTop: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={6}><Card bordered={false}><Statistic title="Số buổi tập/tháng" value={buoiTapTrongThang.length} /></Card></Col>
                    <Col span={6}><Card bordered={false}><Statistic title="Tổng Calo" value={tongCalo} /></Card></Col>
                    <Col span={6}><Card bordered={false}><Statistic title="Số ngày liên tiếp" value={3} /></Card></Col>
                    <Col span={6}><Card bordered={false}><Statistic title="Hoàn thành" value={80} suffix="%" /></Card></Col>
                    <Col span={12}><BieuDoGia tieuDe="Số buổi tập theo tuần" duLieu={duLieuTuan} trucX="tuan" trucY="soBuoi" /></Col>
                    <Col span={12}>
                        <Card title="Gần đây" bordered={false} style={{ height: '223px', overflow: 'hidden' }}>
                            <Timeline mode="left">
                                {buoiTapSapXep.slice(0, 3).map(bt => (
                                    <Timeline.Item key={bt.id} label={bt.ngay}>{bt.loaiBaiTap}</Timeline.Item>
                                ))}
                            </Timeline>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Header style={{ background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #d9d9d9' }}>
                <div style={{ color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>FITNESS PRO</div>
                <Space size="small">
                    <Button type={tabHienTai === '1' ? 'primary' : 'text'} icon={<DashboardOutlined />} onClick={() => setTabHienTai('1')}>Dashboard</Button>
                    <Button type={tabHienTai === '2' ? 'primary' : 'text'} icon={<HistoryOutlined />} onClick={() => setTabHienTai('2')}>Nhật ký</Button>
                    <Button type={tabHienTai === '3' ? 'primary' : 'text'} icon={<LineChartOutlined />} onClick={() => setTabHienTai('3')}>Chỉ số</Button>
                    <Button type={tabHienTai === '4' ? 'primary' : 'text'} icon={<TrophyOutlined />} onClick={() => setTabHienTai('4')}>Mục tiêu</Button>
                    <Button type={tabHienTai === '5' ? 'primary' : 'text'} icon={<BookOutlined />} onClick={() => setTabHienTai('5')}>Thư viện</Button>
                </Space>
            </Header>

            <Content style={{ padding: '0 20px' }}>
                {tabHienTai === '1' && hienThiDashboard()}

                {tabHienTai === '2' && (
                    <Card bordered={false} style={{ marginTop: '20px' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setBuoiTapDangSua(null); bieuMauBuoiTap.resetFields(); setHienThiModalBuoiTap(true); }} style={{ marginBottom: 16 }}>Thêm buổi tập</Button>
                        <Table dataSource={danhSachBuoiTap} rowKey="id" columns={[
                            { title: 'Ngày', dataIndex: 'ngay' },
                            { title: 'Loại bài tập', dataIndex: 'loaiBaiTap' },
                            { title: 'Thời lượng (phút)', dataIndex: 'thoiLuong' },
                            { title: 'Trạng thái', dataIndex: 'trangThai', render: (t) => <Tag color={t === 'Hoàn thành' ? 'green' : 'red'}>{t}</Tag> },
                            {
                                title: 'Sửa/Xóa', render: (_, r) => (
                                    <Space>
                                        <Button size="small" type="text" icon={<EditOutlined />} onClick={() => { setBuoiTapDangSua(r); bieuMauBuoiTap.setFieldsValue({ ...r, ngay: moment(r.ngay) }); setHienThiModalBuoiTap(true); }} />
                                        <Popconfirm title="Xóa?" onConfirm={() => setDanhSachBuoiTap(danhSachBuoiTap.filter(x => x.id !== r.id))}><Button size="small" type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
                                    </Space>
                                )
                            }
                        ]} />
                        <Modal title={buoiTapDangSua ? "Sửa" : "Thêm"} visible={hienThiModalBuoiTap} onCancel={() => setHienThiModalBuoiTap(false)} onOk={() => bieuMauBuoiTap.submit()}>
                            <Form form={bieuMauBuoiTap} layout="vertical" onFinish={luuBuoiTap}>
                                <Form.Item name="ngay" label="Ngày" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
                                <Form.Item name="loaiBaiTap" label="Bài tập"><Input /></Form.Item>
                                <Form.Item name="thoiLuong" label="Phút"><InputNumber style={{ width: '100%' }} /></Form.Item>
                                <Form.Item name="calo" label="Calo"><InputNumber style={{ width: '100%' }} /></Form.Item>
                                <Form.Item name="trangThai" label="Trạng thái" initialValue="Hoàn thành"><Select><Option value="Hoàn thành">Hoàn thành</Option><Option value="Bỏ lỡ">Bỏ lỡ</Option></Select></Form.Item>
                            </Form>
                        </Modal>
                    </Card>
                )}

                {tabHienTai === '3' && (
                    <Card bordered={false} style={{ marginTop: '20px' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setHienThiModalChiSo(true)} style={{ marginBottom: 16 }}>Nhập chỉ số mới</Button>
                        <Table dataSource={danhSachChiSo} rowKey="id" columns={[
                            { title: 'Ngày', dataIndex: 'ngay' },
                            { title: 'Cân nặng (kg)', dataIndex: 'canNang' },
                            { title: 'BMI', dataIndex: 'bmi', render: (v) => <>{v} {layTagBMI(parseFloat(v))}</> },
                            { title: 'Xóa', render: (_, r) => <Popconfirm title="Xóa?" onConfirm={() => setDanhSachChiSo(danhSachChiSo.filter(x => x.id !== r.id))}><Button danger type="text" size="small" icon={<DeleteOutlined />} /></Popconfirm> }
                        ]} />
                        <Modal title="Chỉ số cơ thể" visible={hienThiModalChiSo} onCancel={() => setHienThiModalChiSo(false)} onOk={() => bieuMauChiSo.submit()}>
                            <Form form={bieuMauChiSo} layout="vertical" onFinish={luuChiSo}>
                                <Form.Item name="ngay" label="Ngày" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
                                <Form.Item name="canNang" label="Cân nặng (kg)"><InputNumber style={{ width: '100%' }} /></Form.Item>
                                <Form.Item name="chieuCao" label="Chiều cao (cm)"><InputNumber style={{ width: '100%' }} /></Form.Item>
                            </Form>
                        </Modal>
                    </Card>
                )}

                {tabHienTai === '4' && (
                    <div style={{ marginTop: '20px' }}>
                        <Row justify="space-between" style={{ marginBottom: 16 }}>
                            <Segmented options={['Đang thực hiện', 'Đã đạt', 'Đã hủy']} value={boLocMucTieu} onChange={(v) => setBoLocMucTieu(v as string)} />
                            <Button type="primary" onClick={() => setHienThiDrawerMucTieu(true)}>Tạo mục tiêu</Button>
                        </Row>
                        <Row gutter={[16, 16]}>
                            {danhSachMucTieu.filter(m => m.trangThai === boLocMucTieu).map(m => (
                                <Col span={8} key={m.id}>
                                    <Card bordered={false} title={m.tenMucTieu} extra={<Popconfirm title="Xóa?" onConfirm={() => setDanhSachMucTieu(danhSachMucTieu.filter(x => x.id !== m.id))}><DeleteOutlined style={{ color: 'red' }} /></Popconfirm>}>
                                        <Progress percent={Math.round((m.giaTriHienTai / m.giaTriMucTieu) * 100)} size="small" />
                                        <div style={{ marginTop: 12 }}>
                                            <InputNumber size="small" defaultValue={m.giaTriHienTai} onBlur={(e) => capNhatTienDoMucTieu(m.id, Number(e.target.value))} />
                                            <Text type="secondary"> / {m.giaTriMucTieu}</Text>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Drawer title="Mục tiêu" visible={hienThiDrawerMucTieu} onClose={() => setHienThiDrawerMucTieu(false)} footer={<Button block onClick={() => bieuMauMucTieu.submit()} type="primary">Lưu</Button>}>
                            <Form form={bieuMauMucTieu} layout="vertical" onFinish={luuMucTieu}>
                                <Form.Item name="tenMucTieu" label="Tên"><Input /></Form.Item>
                                <Form.Item name="giaTriMucTieu" label="Đích đến (số)"><InputNumber style={{ width: '100%' }} /></Form.Item>
                                <Form.Item name="hanChot" label="Ngày hết hạn"><DatePicker style={{ width: '100%' }} /></Form.Item>
                            </Form>
                        </Drawer>
                    </div>
                )}

                {tabHienTai === '5' && (
                    <div style={{ marginTop: '20px' }}>
                        <Space style={{ marginBottom: 16 }}>
                            <Input.Search placeholder="Tìm bài tập..." style={{ width: 250 }} onSearch={setTimKiemBaiTap} />
                            <Button type="primary" onClick={() => { setBaiTapDangSua(null); bieuMauBaiTap.resetFields(); setHienThiModalBaiTap(true); }}>Thêm bài</Button>
                        </Space>
                        <Row gutter={[16, 16]}>
                            {danhSachBaiTap.filter(b => b.tenBaiTap.toLowerCase().includes(timKiemBaiTap.toLowerCase())).map(b => (
                                <Col span={8} key={b.id}>
                                    <Card bordered={false} title={b.tenBaiTap} actions={[<EditOutlined onClick={() => { setBaiTapDangSua(b); bieuMauBaiTap.setFieldsValue(b); setHienThiModalBaiTap(true); }} />, <Popconfirm title="Xóa?" onConfirm={() => setDanhSachBaiTap(danhSachBaiTap.filter(x => x.id !== b.id))}><DeleteOutlined /></Popconfirm>]}>
                                        <Tag color="blue">{b.nhomCo}</Tag>
                                        <div style={{ marginTop: 12 }}>{b.moTa}</div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Modal title="Bài tập" visible={hienThiModalBaiTap} onCancel={() => setHienThiModalBaiTap(false)} onOk={() => bieuMauBaiTap.submit()}>
                            <Form form={bieuMauBaiTap} layout="vertical" onFinish={luuBaiTap}>
                                <Form.Item name="tenBaiTap" label="Tên bài tập"><Input /></Form.Item>
                                <Form.Item name="nhomCo" label="Nhóm cơ"><Input /></Form.Item>
                                <Form.Item name="moTa" label="Mô tả"><Input.TextArea /></Form.Item>
                            </Form>
                        </Modal>
                    </div>
                )}
            </Content>
        </Layout>
    );
};

export default UngDungTheDuc;