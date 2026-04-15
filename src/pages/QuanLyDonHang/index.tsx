import React, { useState, useEffect, useMemo } from 'react';
import {
    Table, Button, Space, Input, Select, Modal,
    Form, DatePicker, Tag, message, Popconfirm
} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

enum TrangThaiDonHang {
    CHO_XAC_NHAN = "Chờ xác nhận",
    DANG_GIAO = "Đang giao",
    HOAN_THANH = "Hoàn thành",
    HUY = "Hủy",
}

interface SanPham {
    id: string;
    ten: string;
    gia: number;
}

interface DonHang {
    id: string;
    tenKhachHang: string;
    ngayDatHang: string; 
    tongTien: number;
    trangThai: TrangThaiDonHang;
    danhSachSanPham: string[]; 
}

const DANH_SACH_SAN_PHAM_MAU: SanPham[] = [
    { id: 'P1', ten: 'Laptop Gaming', gia: 25000000 },
    { id: 'P2', ten: 'Chuột không dây', gia: 800000 },
    { id: 'P3', ten: 'Bàn phím cơ Silent', gia: 1500000 },
    { id: 'P4', ten: 'Màn hình 2K', gia: 6500000 },
];

const QuanLyDonHang: React.FC = () => {
    const [danhSachDonHang, setDanhSachDonHang] = useState<DonHang[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [donHangDangSua, setDonHangDangSua] = useState<DonHang | null>(null);
    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
    const [locTrangThai, setLocTrangThai] = useState<string>('All');

    const [form] = Form.useForm();

    //luu vao localStorage
    useEffect(() => {
        const savedOrders = localStorage.getItem('order_management_data');
        if (savedOrders) {
            setDanhSachDonHang(JSON.parse(savedOrders));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('order_management_data', JSON.stringify(danhSachDonHang));
    }, [danhSachDonHang]);

    // tim kiem va loc trang thai
    const duLieuDaLoc = useMemo(() => {
        return danhSachDonHang.filter(item => {
            const matchSearch = item.id.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
                item.tenKhachHang.toLowerCase().includes(tuKhoaTimKiem.toLowerCase());
            const matchStatus = locTrangThai === 'All' || item.trangThai === locTrangThai;
            return matchSearch && matchStatus;
        });
    }, [danhSachDonHang, tuKhoaTimKiem, locTrangThai]);

    //ham xu li
    const handleFormSubmit = (values: any) => {
        const tongTienHienTai = values.danhSachSanPham.reduce((sum: number, prodId: string) => {
            const p = DANH_SACH_SAN_PHAM_MAU.find(item => item.id === prodId);
            return sum + (p?.gia || 0);
        }, 0);

        const duLieuDonHangCapNhat = {
            ...values,
            tongTien: tongTienHienTai,
            ngayDatHang: values.ngayDatHang.format('YYYY-MM-DD HH:mm:ss'),
        };

        if (donHangDangSua) {
            //sua
            const newOrders = danhSachDonHang.map(o => o.id === donHangDangSua.id ? duLieuDonHangCapNhat : o);
            setDanhSachDonHang(newOrders);
            message.success('Cập nhật đơn hàng thành công!');
        } else {
            //them moi
            if (danhSachDonHang.some(o => o.id === values.id)) {
                return message.error('Mã đơn hàng đã tồn tại trong hệ thống!');
            }
            setDanhSachDonHang([duLieuDonHangCapNhat, ...danhSachDonHang]);
            message.success('Thêm mới đơn hàng thành công!');
        }

        setIsModalVisible(false);
        form.resetFields();
    };

    //huy don trong trang thai xac nhan
    const cancelOrder = (id: string) => {
        const newOrders = danhSachDonHang.map(o =>
            o.id === id ? { ...o, trangThai: TrangThaiDonHang.HUY } : o
        );
        setDanhSachDonHang(newOrders);
        message.warning('Đã hủy đơn hàng.');
    };

    // bang
    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            width: 120
        },
        {
            title: 'Khách hàng',
            dataIndex: 'tenKhachHang',
            key: 'tenKhachHang'
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'ngayDatHang',
            key: 'ngayDatHang',
            sorter: (a: DonHang, b: DonHang) => moment(a.ngayDatHang).unix() - moment(b.ngayDatHang).unix(),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'tongTien',
            key: 'tongTien',
            render: (val: number) => <b>{val.toLocaleString()}đ</b>,
            sorter: (a: DonHang, b: DonHang) => a.tongTien - b.tongTien,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (status: TrangThaiDonHang) => {
                const colors: any = {
                    [TrangThaiDonHang.CHO_XAC_NHAN]: 'orange',
                    [TrangThaiDonHang.DANG_GIAO]: 'blue',
                    [TrangThaiDonHang.HOAN_THANH]: 'green',
                    [TrangThaiDonHang.HUY]: 'red',
                };
                return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: DonHang) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setDonHangDangSua(record);
                            form.setFieldsValue({
                                ...record,
                                ngayDatHang: moment(record.ngayDatHang)
                            });
                            setIsModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>

                    {record.trangThai === TrangThaiDonHang.CHO_XAC_NHAN && (
                        <Popconfirm
                            title="Bạn có chắc muốn hủy đơn hàng này không?"
                            onConfirm={() => cancelOrder(record.id)}
                            okText="Đồng ý"
                            cancelText="Quay lại"
                        >
                            <Button type="link" danger icon={<DeleteOutlined />}>
                                Hủy
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>HỆ THỐNG QUẢN LÝ ĐƠN HÀNG</h1>

            {/* loc, them */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Space>
                    <Input
                        placeholder="Tìm theo mã hoặc tên khách..."
                        prefix={<SearchOutlined />}
                        style={{ width: 250 }}
                        onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                    />
                    <Select defaultValue="All" style={{ width: 180 }} onChange={setLocTrangThai}>
                        <Option value="All">Tất cả trạng thái</Option>
                        {Object.values(TrangThaiDonHang).map(s => <Option key={s} value={s}>{s}</Option>)}
                    </Select>
                </Space>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setDonHangDangSua(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                >
                    Tạo đơn hàng mới
                </Button>
            </div>

            {/* hien thi */}
            <Table
                columns={columns}
                dataSource={duLieuDaLoc}
                rowKey="id"
                bordered
                pagination={{ pageSize: 8 }}
            />

           {/* them sua */}
            <Modal
                title={donHangDangSua ? "Cập nhật đơn hàng" : "Thêm đơn hàng mới"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                width={600}
                okText="Xác nhận"
                cancelText="Bỏ qua"
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <Form.Item
                            name="id"
                            label="Mã đơn hàng"
                            rules={[{ required: true, message: 'Không được để trống' }]}
                        >
                            <Input disabled={!!donHangDangSua} placeholder="Ví dụ: DH001" />
                        </Form.Item>

                        <Form.Item
                            name="tenKhachHang"
                            label="Tên khách hàng"
                            rules={[{ required: true, message: 'Vui lòng nhập tên khách' }]}
                        >
                            <Input placeholder="Nhập tên khách hàng" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="danhSachSanPham"
                        label="Sản phẩm trong đơn"
                        rules={[{ required: true, message: 'Chọn ít nhất 1 sản phẩm' }]}
                    >
                        <Select mode="multiple" placeholder="Chọn các sản phẩm" allowClear>
                            {DANH_SACH_SAN_PHAM_MAU.map(p => (
                                <Option key={p.id} value={p.id}>{p.ten} ({p.gia.toLocaleString()}đ)</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <Form.Item name="ngayDatHang" label="Ngày đặt hàng" rules={[{ required: true }]}>
                            <DatePicker showTime style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item name="trangThai" label="Trạng thái đơn" rules={[{ required: true }]}>
                            <Select>
                                {Object.values(TrangThaiDonHang).map(s => <Option key={s} value={s}>{s}</Option>)}
                            </Select>
                        </Form.Item>
                    </div>  
                </Form>
            </Modal>
        </div>
    );
};

export default QuanLyDonHang;